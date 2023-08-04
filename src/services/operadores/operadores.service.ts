import axios from "axios";
import baseUrl from "../../utils/base-url.utils";
import loadAbort from "../../utils/load-abort.util";
import { IOperadorForm } from "../../models/operadores/operador-form.model";
import { IOperadorDireccion } from "../../models/operadores/operador-direccion.model";
import { IOperadorTelefono } from "../../models/operadores/operador-telefono.model";
import { IOperadorContactos } from "../../models/operadores/operador-contactos.model";
import { IOperadorDocumentos } from "../../models/operadores/operador-docs.model";

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

export const createOperador = (operador: IOperadorForm) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "operadores/create", operador, { signal: controller.signal }),
        controller
    }
}

export const insertDireccion = (direccion: IOperadorDireccion) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "direccionOperador/create", direccion, { signal: controller.signal }),
        controller
    }
}

export const insertTelefono = (telefono: IOperadorTelefono) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "telefonosOperador/create", telefono, { signal: controller.signal }),
        controller
    }
}

export const insertContacto = (contacto: IOperadorContactos) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "contactosEmOperadores/create", contacto, { signal: controller.signal }),
        controller
    }
}
export const uploadFilesOperador = (documentos: IOperadorDocumentos, idOperador: string) => {
    let format = new FormData();
    format.append( "url_CURP", documentos.url_CURP);
    format.append( "url_RFC", documentos.url_RFC);
    format.append( "url_ComprobanteDom", documentos.url_ComprobanteDom);
    format.append("id_Operador", idOperador);
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "documentosOperadores/create", format, { signal: controller.signal, }),
        controller
    }
}

export const updateFilesUnidad = (documentos: IOperadorDocumentos, idDocumento: string, idOperador: string) => {
    let format = new FormData();
    format.append( "url_CURP", documentos.url_CURP);
    format.append( "url_RFC", documentos.url_RFC);
    format.append( "url_ComprobanteDom", documentos.url_ComprobanteDom);
    format.append("id_Operador", idOperador);
    const controller = loadAbort();
    return {
        call: axios.put(baseUrl + "documentosOperadores/update/" + idDocumento, format, { signal: controller.signal, }),
        controller
    }
}