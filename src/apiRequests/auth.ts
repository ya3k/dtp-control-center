import { SetTokenResponseType } from "@/app/api/auth/set-token/route";
import { apiEndpoint, nextServer } from "@/configs/routes";
import http from "@/lib/https";
import {
  LoginResponseSchemaType,
  LoginSchemaType,
  RegisterResponseSchemaType,
  RegisterSchemaType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  login: (body: LoginSchemaType) =>
    http.post<LoginResponseSchemaType>(apiEndpoint.login, body),
  register: (body: Omit<RegisterSchemaType, "confirmPassword">) =>
    http.post<RegisterResponseSchemaType>(apiEndpoint.register, body),
  logout: () => http.post(apiEndpoint.logout),
  setToken: (body: { sessionToken: string; role: string }) =>
    http.post<SetTokenResponseType>(nextServer.setToken, body, { baseUrl: "" }),
  removeToken: () => http.delete(nextServer.removeToken, { baseUrl: "" }),
};

export default authApiRequest;
