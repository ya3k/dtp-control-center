import envConfig from "@/configs/envConfig";
import { apiEndpoint } from "@/configs/routes";
import { LoginResponseSchemaType } from "@/schemaValidations/auth.schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpError extends Error {
  status: number;
  payload: { message: string; [key: string]: any };
  constructor({ status, payload }: { status: number; payload: any }) {
    // Create a more descriptive error message
    const message =
      typeof payload === "object" && payload?.message
        ? payload.message
        : `HTTP Error: ${status}`;

    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
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

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export type CustomOptionsType = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  showErrorToast?: boolean; // Option to show error toast
  errorMessage?: string; // Custom error message
};

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

  //Nếu không truyền baseUrl thì lấy từ envConfig
  //Nếu truyền baseUrl thì lấy từ options
  //Nếu truyền baseUrl là "" thì đồng nghĩa với API gọi đến Nextjs server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  // /api/tour
  // api/tour
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    cache: "no-cache",
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: Response = await response.json();

  const data = {
    status: response.status,
    payload,
  };
  if (!response.ok) {
    if (response.status === 400) {
      throw new EntityError(
        data as { status: 400; payload: EntityErrorPayload },
      );
    } else {
      throw new HttpError(data);
    }
  }

  //automatically set/remove session token and role when login or logout on client side
  if (typeof window !== "undefined") {
    if ([apiEndpoint.login].includes(url)) {
      sessionToken.value = (
        payload as LoginResponseSchemaType
      ).data?.accessToken;
      userRole.value = (payload as LoginResponseSchemaType).data?.role;
    } else if ([apiEndpoint.logout].includes(url)) {
      sessionToken.value = "";
      userRole.value = "";
    }
  }
  return data;
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
