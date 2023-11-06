import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IViajeForm } from "../../models/viajes/viaje-form.model";



export const getViajesEmpresa = (idEmpresa: string) => {
    const controller = loadAbort();
    return {
        call: axios.get(baseUrl + "viajes/readByEmpresa/" + idEmpresa,  { signal: controller.signal, }),
        controller
    }
}

export const createViaje = (dataViaje: IViajeForm) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "viajes/create", dataViaje, { signal: controller.signal, }),
        controller
    }
}