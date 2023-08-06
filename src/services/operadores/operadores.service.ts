import axios from "axios";
import baseUrl from "../../utils/base-url.utils";
import loadAbort from "../../utils/load-abort.util";
import { IOperadorForm } from "../../models/operadores/operador-form.model";
import { IOperadorDireccion } from "../../models/operadores/operador-direccion.model";
import { IOperadorTelefono } from "../../models/operadores/operador-telefono.model";
import { IOperadorContactos } from "../../models/operadores/operador-contactos.model";
import { IOperadorDocumentos } from "../../models/operadores/operador-docs.model";

//todo: GETS TO DATABASE
export const getOperadoresByEmpresa = (idEmpresa: number) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
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

export const getDireccionOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "direccionOperadores/read/" + idOperador;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getTelefonoOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "telefonosOperadores/read/" + idOperador;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getContactoOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "contactosEmOperadores/read/" + idOperador;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getDocumentsOperador = (idOperador: number) => {
    const controller = loadAbort();
    const uri = baseUrl + "documentosOperadores/read/" + idOperador;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

//todo: INSERT TO DATABASE

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


//todo: UPDATE'S DATABASE

export const updateOperador = (data: IOperadorForm, id: string) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "operadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateTelefonoOperador = (data: IOperadorTelefono, id: string) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "telefonosOperadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateDireccionOperador = (data: IOperadorDireccion, id: string) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "direccionOperadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateContactoOperador = (data: IOperadorContactos, id: string) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "contactosEmOperadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateFilesOperador = (documentos: IOperadorDocumentos, idDocumento: string, idOperador: string) => {
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