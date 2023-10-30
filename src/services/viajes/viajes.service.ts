import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IViajeForm } from "../../models/viajes/viaje-form.model";



export const createViaje = (dataViaje: IViajeForm) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "viajes/create", dataViaje, { signal: controller.signal, }),
        controller
    }
}