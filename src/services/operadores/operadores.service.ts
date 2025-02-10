import baseUrl from "../../utils/base-url.utils";
import loadAbort from "../../utils/load-abort.util";
import { IOperadorForm } from "../../models/operadores/operador-form.model";
import { IOperadorDireccion } from "../../models/operadores/operador-direccion.model";
import { IOperadorTelefono } from "../../models/operadores/operador-telefono.model";
import { IOperadorContactos } from "../../models/operadores/operador-contactos.model";
import { IOperadorDocumentos } from "../../models/operadores/operador-docs.model";
import api from "../api";

//todo: GETS TO DATABASE
export const getOperadoresByEmpresa = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    const urlGet = baseUrl + "operadores/readByEmpresa";
    return {
        call: api.get(urlGet, { signal: controller.signal}),
        controller
    }
}

export const getIdOperador = (idOperador: string | null = null) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "operadores/read/" + idOperador;
    return {
        call: api.get(urlGet, { signal: controller.signal }),
        controller
    }
}

export const getDireccionOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "direccionOperadores/read/" + idOperador;
    return {
        call: api.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getTelefonoOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "telefonosOperadores/read/" + idOperador;
    return {
        call: api.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getContactoOperador = (idOperador: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "contactosEmOperadores/read/" + idOperador;
    return {
        call: api.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getDocumentsOperador = (idOperador: number) => {
    const controller = loadAbort();
    const uri = baseUrl + "documentosOperadores/read/" + idOperador;
    return {
        call: api.get(uri, {signal: controller.signal}),
        controller
    }
}

//todo: INSERT TO DATABASE

export const createOperador = (operador: IOperadorForm) => {
    const controller = loadAbort();
    return {
        call: api.post(baseUrl + "operadores/create", operador, {  signal: controller.signal }),
        controller
    }
}

export const insertDireccion = (direccion: IOperadorDireccion, idOperador: number) => {
    const controller = loadAbort();
    direccion.id_Operador = idOperador;
    return {
        call: api.post(baseUrl + "direccionOperadores/create", direccion, { signal: controller.signal }),
        controller
    }
}

export const insertTelefono = (telefono: IOperadorTelefono, idOperador: number) => {
    const controller = loadAbort();
    telefono.id_Operador = idOperador;
    return {
        call: api.post(baseUrl + "telefonosOperadores/create", telefono, { signal: controller.signal }),
        controller
    }
}

export const insertContacto = (contacto: IOperadorContactos, idOperador: number) => {
    const controller = loadAbort();
    contacto.id_Operador = idOperador;
    return {
        call: api.post(baseUrl + "contactosEmOperadores/create", contacto, { signal: controller.signal }),
        controller
    }
}
export const uploadFilesOperador = (documentos: IOperadorDocumentos, idOperador: number) => {
    let format = new FormData();
    const controller = loadAbort();
    if (documentos.url_CURP) format.append("url_CURP", documentos.url_CURP, "CURP.pdf");
    if (documentos.url_RFC) format.append("url_RFC", documentos.url_RFC, "RFC.pdf");
    if (documentos.url_ComprobanteDom) format.append("url_ComprobanteDom", documentos.url_ComprobanteDom, "ComprobanteDomicilio.pdf");
    format.append("id_Operador", idOperador.toString());
    return {
        call: api.post(baseUrl + "documentosOperadores/create", format, { signal: controller.signal ,
            headers: { "Content-Type": "multipart/form-data" }
        }),
        controller
    };
};



//todo: UPDATE'S DATABASE

export const updateOperador = (data: IOperadorForm, id: number) => {
    const controller = loadAbort();
    return {
        call: api.put(baseUrl + "operadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateTelefonoOperador = (data: IOperadorTelefono, id: number) => {
    const controller = loadAbort();
    return {
        call: api.put(baseUrl + "telefonosOperadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateDireccionOperador = (data: IOperadorDireccion, id: number) => {
    const controller = loadAbort();
    return {
        call: api.put(baseUrl + "direccionOperadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateContactoOperador = (data: IOperadorContactos, id: number) => {
    const controller = loadAbort();
    return {
        call: api.put(baseUrl + "contactosEmOperadores/update/" + id, data, { signal: controller.signal }),
        controller
    }
}

export const updateFilesOperador = (documentos: IOperadorDocumentos, idDocumento: number, idOperador: number) => {
    let format = new FormData();
    if (documentos.url_CURP) format.append("url_CURP", documentos.url_CURP, "CURP.pdf");
    if (documentos.url_RFC) format.append("url_RFC", documentos.url_RFC, "RFC.pdf");
    if (documentos.url_ComprobanteDom) format.append("url_ComprobanteDom", documentos.url_ComprobanteDom, "ComprobanteDomicilio.pdf");
    format.append("id_Operador", idOperador.toString());
    const controller = loadAbort();
    return {
        call: api.put(baseUrl + "documentosOperadores/update/" + idDocumento, format, { signal: controller.signal, }),
        controller
    }
}

export const settingHeader = () => {
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return header
}