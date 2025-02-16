import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IUnidadForm } from "../../models/unidades/unidad-form.model";
import { IUnidadDocumentos } from "../../models/unidades/unidad-docs.model";
import api from "../api";
import axios from "axios";

export const getUnidades = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    //Peticion
    const urlGet = baseUrl + "unidadesEmpresa/read";
    return {
        call: api.get(urlGet, { signal: controller.signal}),
        controller
    }
}

export const getIdUnidad = (idUnidad: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "unidades/read/" + idUnidad;
    return {
        call: api.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getDocumentsUnidad = (idDocumento: number) => {
    const controller = loadAbort();
    const uri = baseUrl + "documentosUnidades/read/" + idDocumento;
    return {
        call: api.get(uri, {signal: controller.signal}),
        controller
    }
}

export const createUnidad = (dataUnidad: IUnidadForm) => {
    const controller = loadAbort();
    return {
        call: api.post(baseUrl + "unidades/create", dataUnidad, { signal: controller.signal }),
        controller
    }
}

export const editUnidad = (idUnidad: number, dataUnidad: IUnidadForm) =>{
    const controller = loadAbort();
    return {
        call: api.put(baseUrl + `unidades/update/${idUnidad}`, dataUnidad, { signal: controller.signal }),
        controller 
    }
}

export const uploadFilesUnidad = (documentos: IUnidadDocumentos, idUnidad: number) => {
    let format = new FormData();
    const controller = loadAbort();
    let header = settingHeader();
    if (documentos.url_TarjetaCirculacion) format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    if (documentos.url_Factura) format.append( "url_Factura", documentos.url_Factura);
    if (documentos.url_PermisoSCT)format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Unidad", idUnidad.toString());
    for (const [key, value] of format.entries()) {
        console.log(`${key}:`, value);
    }

    return {
        call: axios.post(baseUrl + "documentosUnidades/create", format, { headers: header,  signal: controller.signal }),
        controller
    }
}

export const updateFilesUnidad = (documentos: IUnidadDocumentos, idDocumento: number, idUnidad: number) => {
    let format = new FormData();
    const controller = loadAbort();
    let header = settingHeader();
    if (documentos.url_TarjetaCirculacion) format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    if (documentos.url_Factura) format.append( "url_Factura", documentos.url_Factura);
    if (documentos.url_PermisoSCT)format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Unidad", idUnidad.toString());
    for (const [key, value] of format.entries()) {
        console.log(`${key}:`, value);
    }
    return {
        call: axios.put(baseUrl + "documentosUnidades/update/" + idDocumento, format, { headers: header, signal: controller.signal }),
        controller
    }
}

export const deleteUnidad = (id_Unidad: number) => {
    const controller = loadAbort();
    return {
        call: api.delete(baseUrl + `unidades/delete/${id_Unidad}`, { signal: controller.signal }),
        controller
    }
}

export const settingHeader = () => {
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data'};
    return header
}