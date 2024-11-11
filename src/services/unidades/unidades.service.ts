import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IUnidadForm } from "../../models/unidades/unidad-form.model";
import { IUnidadDocumentos } from "../../models/unidades/unidad-docs.model";

export const getUnidades = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    //Peticion
    const urlGet = baseUrl + "unidadesEmpresa/read";
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.get(urlGet, { headers: header, signal: controller.signal}),
        controller
    }
}

export const getIdUnidad = (idUnidad: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "unidades/read/" + idUnidad;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getDocumentsUnidad = (idDocumento: number) => {
    const controller = loadAbort();
    const uri = baseUrl + "documentosUnidades/read/" + idDocumento;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const createUnidad = (dataUnidad: IUnidadForm) => {
    const controller = loadAbort();
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.post(baseUrl + "unidades/create", dataUnidad, { signal: controller.signal,  headers: header}),
        controller
    }
}

export const editUnidad = (idUnidad: number, dataUnidad: IUnidadForm) =>{
    const controller = loadAbort();
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.put(baseUrl + `unidades/update/${idUnidad}`, dataUnidad, { signal: controller.signal,  headers: header}),
        controller 
    }
}

export const uploadFilesUnidad = (documentos: IUnidadDocumentos, idUnidad: number) => {
    let format = new FormData();
    const controller = loadAbort();
    format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    format.append( "url_Factura", documentos.url_Factura);
    format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Unidad", idUnidad.toString());
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.post(baseUrl + "documentosUnidades/create", format, { signal: controller.signal, headers: header}),
        controller
    }
}

export const updateFilesUnidad = (documentos: IUnidadDocumentos, idDocumento: number, idUnidad: number) => {
    let format = new FormData();
    const controller = loadAbort();
    format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    format.append( "url_Factura", documentos.url_Factura);
    format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Unidad", idUnidad.toString());
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.put(baseUrl + "documentosUnidades/update/" + idDocumento, format, { signal: controller.signal, headers: header }),
        controller
    }
}

export const deleteUnidad = (id_Unidad: number) => {
    const controller = loadAbort();
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.delete(baseUrl + `unidades/delete/${id_Unidad}`, {signal: controller.signal, headers: header}),
        controller
    }
}