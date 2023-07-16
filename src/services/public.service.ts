import axios from "axios";
import loadAbort from "../utils/load-abort.util"
import baseUrl from "../utils/base-url.utils";

export const getTipoUnidad = () => {
    const controller = loadAbort();
    //Peticion
    const urlGet = baseUrl + "tiposUnidades/read";
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}