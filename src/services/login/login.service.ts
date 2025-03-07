import axios from "axios";
import loadAbort from "../../utils/load-abort.util";
import baseUrl from "../../utils/base-url.utils";
import { loginModel } from "../../models/login/login.model";

const loginService = (loginPost: loginModel) => {
    const controller = loadAbort();
    return {
      call: axios.post(baseUrl + "auth/login", loginPost, { signal: controller.signal }),
      controller
    };
}
export default loginService;