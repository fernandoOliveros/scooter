import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IRelViajeRemolqueForm, IViajeForm } from "../../models/viajes/viaje-form.model";
import api from "../api";



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
        call: api.post(baseUrl + "viajes/create", dataViaje, { signal: controller.signal, }),
        controller
    }
}

export const createRelViajeRemolques = (data: IRelViajeRemolqueForm) => {
    const controller = loadAbort();
    let uri = baseUrl + "relViajeRemolque/create";
    return {
        call: axios.post(uri, data, { signal: controller.signal, }),
        controller
    }
}