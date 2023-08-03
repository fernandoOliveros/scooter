import axios from "axios";
import baseUrl from "../../utils/base-url.utils";
import loadAbort from "../../utils/load-abort.util";

//FUNCION PARA BTENER LOS OPERADORES POR EMPRESA
export const getOperadoresByEmpresa = (idEmpresa: number) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    //Peticion
    const urlGet = baseUrl + "operadores/readByEmpresa/" + idEmpresa;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getIdOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "operadores/read/" + idOperador;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getDocumentsOperador = (idDocumento: number) => {
    const controller = loadAbort();
    const uri = baseUrl + "documentosOperadores/read/" + idDocumento;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}