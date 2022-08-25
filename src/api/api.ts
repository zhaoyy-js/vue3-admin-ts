import { get, post } from "./http";

export const validate = (params:any) => post("/link/validateLinkExpire", params);
