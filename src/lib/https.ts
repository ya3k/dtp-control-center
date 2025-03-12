import envConfig from "@/configs/envConfig";
import { apiEndpoint } from "@/configs/routes";
import { LoginResponseSchemaType } from "@/schemaValidations/auth.schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
class HttpError extends Error {
  status: number;
  payload: any;
  constructor({ status, payload }: { status: number; payload: any }) {
    super(`HTTP Error: ${status}`);
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
    //CHeck if calling from client side or server side
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
    //CHeck if calling from client side or server side
    if (typeof window === "undefined") {
      throw new Error("Cannot set role on server side");
    }
    this.role = role;
  }
}

//only manipulate on client side
export const sessionToken = new SessionToken();
export const userRole = new UserRole();

type MethodType = "GET" | "POST" | "PUT" | "DELETE";

type CustomOptionsType = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

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
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const contentType = response.headers.get("Content-Type");
  let payload: Response | null = null;

  if (response.status !== 204) {
    const responseText = await response.text();
    try {
      payload = contentType && contentType.includes("application/json")
        ? JSON.parse(responseText)
        : responseText;
    } catch (error) {
      throw new HttpError({ status: response.status, payload: responseText });
    }
  }

  const data = {
    status: response.status,
    payload,
  };

  if (!response.ok) {
    return new HttpError(data);
  }
  //automatically set/remove session token and role when login or logout on client side
  if ([apiEndpoint.login].includes(url)) {
    sessionToken.value = (payload as LoginResponseSchemaType).data?.accessToken;
    userRole.value = (payload as LoginResponseSchemaType).data?.role;
  } else if (apiEndpoint.logout.includes(url)) {
    sessionToken.value = "";
    userRole.value = "";
  }
  return data;
};

const http = {
  get: <Response>(
    url: string,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("GET", url, options);
  },
  post: <Response>(
    url: string,
    body?: any,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("POST", url, { ...options, body });
  },
  put: <Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete: <Response>(
    url: string,
    options?: Omit<CustomOptionsType, "body"> | undefined,
  ) => {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
