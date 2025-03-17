import { toast } from "sonner"
import envConfig from "@/configs/envConfig";
import { apiEndpoint } from "@/configs/routes";
import { LoginResponseSchemaType } from "@/schemaValidations/auth.schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
class HttpError extends Error {
  status: number;
  payload: { message: string; [key: string]: any };
  constructor({ status, payload }: { status: number; payload: any }) {
    // Create a more descriptive error message
    const message = typeof payload === "object" && payload?.message ? payload.message : `HTTP Error: ${status}`

    super(message)
    this.name = "HttpError"
    this.status = status
    this.payload = payload
  }
} 
type EntityErrorPayload = {
  message: string;
  error: string[];
};
export class EntityError extends HttpError {
  status: 400;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 400;
    payload: EntityErrorPayload;
  }) {
    super({ status: 400, payload });
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private sessionToken = ""

  get value() {
    return this.sessionToken
  }

  set value(token: string) {
    // Check if calling from client side or server side
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side")
    }
    this.sessionToken = token
  }
}

class UserRole {
  private role = ""

  get value() {
    return this.role
  }

  set value(role: string) {
    // Check if calling from client side or server side
    if (typeof window === "undefined") {
      throw new Error("Cannot set role on server side")
    }
    this.role = role
  }
}

// Only manipulate on client side
export const sessionToken = new SessionToken()
export const userRole = new UserRole()

export type MethodType = "GET" | "POST" | "PUT" | "DELETE"

export type CustomOptionsType = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined
  showErrorToast?: boolean // Option to show error toast
  errorMessage?: string // Custom error message
}

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
)
: Promise<
{
  status: number
  payload: Response | null
}
> =>
{
  const { baseUrl: optionsBaseUrl, showErrorToast = true, errorMessage, ...fetchOptions } = options || {}

  const body = fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined

  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: sessionToken.value ? `Bearer ${sessionToken.value}` : "",
  }

  // If no baseUrl is provided, use the one from envConfig
  // If baseUrl is provided, use it
  // If baseUrl is "", it means the API call is to the Next.js server
  const baseUrl = optionsBaseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : optionsBaseUrl

  // /api/tour
  // api/tour
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      cache: "no-cache",
      headers: {
        ...baseHeaders,
        ...fetchOptions?.headers || {},
      },
      body,
      method,
    });
    const contentType = response.headers.get("Content-Type")
      let payload: Response | null = null
      if (response.status !== 204) {
        const responseText = await response.text()
        try {
          payload =
            contentType && contentType.includes("application/json")
              ? JSON.parse(responseText)
              : (responseText as unknown as Response)
        } catch (error) {
          throw new HttpError({ status: response.status, payload: responseText })
        }
      }
    payload: Response = await response.json();
    const data = {
      status: response.status,
      payload,
    };
    if (!response.ok) {
      const error = new HttpError(data)
  
      // Show error toast if enabled
      if (showErrorToast) {
        const toastMessage =
          errorMessage ||
          (typeof error.payload === "object" && error.payload?.message) ||
          `Error ${error.status}: Request failed`
  
        toast.error(toastMessage)
      }
  
      throw error
    }
    //automatically set/remove session token and role when login or logout on client side
    if ([apiEndpoint.login].includes(url)) {
      const loginResponse = payload as unknown as LoginResponseSchemaType
      if (loginResponse.data?.accessToken) {
        sessionToken.value = loginResponse.data.accessToken
        userRole.value = loginResponse.data.role
      }
    } else if (apiEndpoint.logout.includes(url)) {
      sessionToken.value = ""
      userRole.value = ""
    }
    return data;
  } catch (error) {
    if (!(error instanceof HttpError) && showErrorToast) {
      toast.error(errorMessage || "Network error. Please check your connection.")
    }
    throw error
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
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("DELETE", url, options);
  },
};

export default http;

