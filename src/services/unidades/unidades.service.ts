import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { UnidadModel } from "../../models/unidades/unidad.model";

export const getUnidades = (idEmpresa: number) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    //Peticion
    const urlGet = baseUrl + "unidadesEmpresa/read/" + idEmpresa;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const createUnidad = (dataUnidad: UnidadModel) => {
    const controller = loadAbort();
    return {
        call: axios.post<UnidadModel>(baseUrl + "unidades/create", {dataUnidad}, {signal: controller.signal}),
        controller
    }
}