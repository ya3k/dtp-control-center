/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefreshTokenRequestType } from "@/app/api/auth/refresh-token/route";
import { SetTokenResponseType } from "@/app/api/auth/set-token/route";
import { apiEndpoint, nextServer } from "@/configs/routes";
import http from "@/lib/http";
import {
  LoginResponseSchemaType,
  LoginSchemaType,
  RegisterResponseSchemaType,
  RegisterSchemaType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  login: (body: LoginSchemaType) =>
    http.post<LoginResponseSchemaType>(apiEndpoint.login, body),
  storeToken: (token : string) =>{
    http.put(apiEndpoint.storeToken, token)
  },
  register: (body: Omit<RegisterSchemaType, "confirmPassword">) =>
    http.post<RegisterResponseSchemaType>(apiEndpoint.register, body),
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post(
      apiEndpoint.logout,
      {},
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      },
    ),
  refreshFromNextServerToServer: (body: RefreshTokenRequestType, sessionToken: string) =>
    http.post<LoginResponseSchemaType>(
      apiEndpoint.refresh,
      body,
      { headers: { Authorization: `Bearer ${sessionToken}` } },
    ),

  //next server
  setToken: (body: LoginResponseSchemaType) =>
    http.post<SetTokenResponseType>(nextServer.setToken, body, { baseUrl: "" }),
  refreshFromNextClientToNextServer: () =>
    http.post<LoginResponseSchemaType | any>(
      nextServer.refreshToken,
      {},
      { baseUrl: "" },
    ),

  logoutFromNextClientToNextServer: (force?: boolean | undefined) =>
    http.post(nextServer.logout, { force }, { baseUrl: "" }),

  confirmAccountFromNextClientToNextServer: (body: {
    confirmationToken: string;
  }) => http.post(nextServer.confirmation, body, { baseUrl: "" }),

  confirmAccountFromNextServerToServer: (body: { confirmationToken: string }) =>
    http.post(apiEndpoint.confirmation, body),

  confrimAccountClientToBe: (body: { confirmationToken: string }) =>
    http.post(apiEndpoint.confirmation, body),

};

export default authApiRequest;
