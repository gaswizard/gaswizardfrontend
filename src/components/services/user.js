import * as opsService from "./Ops";

import { registerApi,getUserReferralCode } from "../Constant/Api";

const registerUser = async (data) => {
  let result = await opsService.postdata(registerApi, data);
  return result;
};
const getUSerReferral = async (data) => {
  let result = await opsService.postdata(getUserReferralCode, data);
  return result;
};

export { registerUser,getUSerReferral };
