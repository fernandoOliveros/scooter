import axios from "axios";
import baseUrl from "../../utils/base-url.utils"
import loadAbort from "../../utils/load-abort.util";


export const getViajeActivos = (idEmpresa: string) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "viajes/readActivosByEmpresa/" + idEmpresa;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }

}
