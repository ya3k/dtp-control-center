import envConfig from "@/configs/envConfig";
import { apiEndpoint, nextServer } from "@/configs/routes";
import { LoginResponseSchemaType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";
import { toast } from "sonner"; // Import toast for showing errors

const AUTHENTICATION_STATUS = 401;

// Define the common API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpError extends Error {
  status: number;
  payload: ApiResponse | { message: string;[key: string]: any };

  constructor({ status, payload }: { status: number; payload: any }) {
    // Create a more descriptive error message based on the API response format
    let message = `HTTP Error: ${status}`;

    if (typeof payload === 'object') {
      if (payload?.message) {
        message = payload.message;
      }

      // Check for the specific error format and use the first error if available
      if (Array.isArray(payload?.error) && payload.error.length > 0) {
        message = payload.error[0];
      }
    }

    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }

  // Helper method to get all error messages
  get errorMessages(): string[] {
    if (typeof this.payload === 'object' && Array.isArray(this.payload?.error)) {
      return this.payload.error;
    }
    return [this.message];
  }
}

export class EntityError extends HttpError {
  status: 400;
  payload: ApiResponse;

  constructor({ status, payload }: { status: 400; payload: ApiResponse }) {
    super({ status: 400, payload });
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private sessionToken = "";

  get value() {
    return this.sessionToken;
  }

  set value(token: string) {
    // Check if calling from client side or server side
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.sessionToken = token;
  }
}

class RefreshToken {
  private refreshToken = "";

  get value() {
    return this.refreshToken;
  }

  set value(token: string) {
    // Check if calling from client side or server side
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.refreshToken = token;
  }
}

class UserRole {
  private role = "";

  get value() {
    return this.role;
  }

  set value(role: string) {
    // Check if calling from client side or server side
    if (typeof window === "undefined") {
      throw new Error("Cannot set role on server side");
    }
    this.role = role;
  }
}

// Only manipulate on client side
export const sessionToken = new SessionToken();
export const userRole = new UserRole();
export const refreshToken = new RefreshToken();

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export type CustomOptionsType = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  showErrorToast?: boolean; // Option to show error toast
  errorMessage?: string; // Custom error message
};

let clientLogoutRequest: null | Promise<any> = null;

/**
 * Makes an HTTP request with the specified method, URL, and options.
 *
 * @param method - The HTTP method to use (GET, POST, PUT, DELETE)
 * @param url - The URL to request
 * @param options - Additional options for the request
 * @returns A promise that resolves to the response data
 * @throws HttpError if the request fails
 */
const request = async <Response>(
  method: MethodType,
  url: string,
  options?: CustomOptionsType | undefined,
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: sessionToken.value ? `Bearer ${sessionToken.value}` : "",
  };

  // Build URL
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      cache: "no-store",
      headers: {
        ...baseHeaders,
        ...options?.headers,
      },
      body,
      method,
    });

    const contentType = response.headers.get("content-type");
    let payload: Response | ApiResponse | any;

    if (contentType && contentType.includes("application/json")) {
      try {
        payload = await response.json();
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        payload = {
          success: false,
          message: "Invalid response format",
          data: null
        };
      }
    } else {
      const text = await response.text();
      payload = {
        success: false,
        message: text || "No content",
        data: null
      };
    }

    // Handle API-specific error format
    if (payload && typeof payload === 'object') {
      if (payload.success === false && payload.error) {
        if (!response.ok || response.status >= 400) {
          // Show error toast if enabled
          if (options?.showErrorToast !== false) {
            // Use the first error message, or fallback to the general message, or a default
            const errorMsg = Array.isArray(payload.error) && payload.error.length > 0
              ? payload.error[0]
              : (payload.message || options?.errorMessage || "An error occurred");

            toast.error(errorMsg);
          }

          if (response.status === 400) {
            throw new EntityError({
              status: 400,
              payload: payload as ApiResponse,
            });
          }

          throw new HttpError({
            status: response.status,
            payload,
          });
        }
      }
    }

    if (!response.ok) {
      if (response.status === 400) {
        throw new EntityError({
          status: 400,
          payload: payload as ApiResponse,
        });
      } else if (response.status === AUTHENTICATION_STATUS) {
        // Handle authentication errors
        if (typeof window !== "undefined") {
          if (!clientLogoutRequest) {
            clientLogoutRequest = fetch(`${nextServer.logout}`, {
              method: "POST",
              body: JSON.stringify({ force: true }),
              headers: {
                ...baseHeaders,
              },
            });
            await clientLogoutRequest;
            sessionToken.value = "";
            userRole.value = "";
            refreshToken.value = "";
            clientLogoutRequest = null;
            location.href = "/login";
          }
        } else {
          const sessionToken = (options?.headers as any)?.Authorization?.split(
            "Bearer ",
          )[1];
          redirect("/logout?sessionToken=" + sessionToken);
        }
      } else {
        // Show error toast for other errors if enabled
        if (options?.showErrorToast !== false) {
          toast.error(options?.errorMessage || payload?.message || `Error: ${response.status}`);
        }

        throw new HttpError({
          status: response.status,
          payload,
        });
      }
    }

    const data = {
      status: response.status,
      payload,
    };

    // Authentication related code (unchanged)
    if (typeof window !== "undefined") {
      if ([apiEndpoint.login].includes(url)) {
        sessionToken.value = (
          payload as LoginResponseSchemaType
        ).data?.accessToken;
        userRole.value = (payload as LoginResponseSchemaType).data?.role;
        refreshToken.value = (payload as LoginResponseSchemaType).data?.refreshToken;
      } else if ([apiEndpoint.logout].includes(url)) {
        sessionToken.value = "";
        userRole.value = "";
        refreshToken.value = "";
      }
    }

    return data;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    // Handle unexpected errors
    if (options?.showErrorToast !== false) {
      toast.error(options?.errorMessage || "Network or server error occurred");
    }

    throw new HttpError({
      status: 0,
      payload: {
        success: false,
        message: (error as Error).message || "Unknown error occurred",
        data: null
      }
    });
  }
};

const http = {
  /**
   * Makes a GET request to the specified URL.
   *
   * @param url - The URL to request
   * @param options - Additional options for the request
   * @returns A promise that resolves to the response data
   */
  get: <Response>(
    url: string,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("GET", url, options);
  },

  /**
   * Makes a POST request to the specified URL with the provided body.
   *
   * @param url - The URL to request
   * @param body - The request body
   * @param options - Additional options for the request
   * @returns a promise that resolves to the response data
   */
  post: <Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("POST", url, { ...options, body });
  },

  /**
   * Makes a PUT request to the specified URL with the provided body.
   *
   * @param url - The URL to request
   * @param body - The request body
   * @param options - Additional options for the request
   * @returns A promise that resolves to the response data
   */
  put: <Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("PUT", url, { ...options, body });
  },

  /**
   * Makes a DELETE request to the specified URL.
   *
   * @param url - The URL to request
   * @param options - Additional options for the request
   * @returns A promise that resolves to the response data
   */
  delete: <Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
