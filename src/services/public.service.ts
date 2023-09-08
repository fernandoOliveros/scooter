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


export const getTipoRemolque = () => {
    const controller = loadAbort();
    const urlGet = baseUrl + "remolques/readTypes";
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getColoniasByCodigoPostal = (codigo_postal : string) => {
    const controller = loadAbort();
    const url = baseUrl + "direccionOperadores/getByCP/" + codigo_postal;
    return {
        call: axios.get(url, {signal: controller.signal} ),
        controller
    }
}

export const getCatRegimenFiscal = () => {
    const controller = loadAbort();
    const url = baseUrl + "regimenFiscal";
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}