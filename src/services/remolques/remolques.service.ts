import axios from "axios";
import baseUrl from "../../utils/base-url.utils";
import loadAbort from "../../utils/load-abort.util";
import { IRemolqueForm } from "../../models/remolques/remolque-form.model";
import { IRemolqueDocumentos } from "../../models/remolques/remolque-docs.model";

export const getRemolques = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    //Peticion
    const urlGet = baseUrl + "remolques/readByEmpresa";
    return {
        call: axios.get(urlGet, { headers: header, signal: controller.signal}),
        controller
    }
}

export const getIdRemolque = (idRemolque: string) => {
    const controller = loadAbort();
    const urlGet = baseUrl + "remolques/read/" + idRemolque;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getDocumentsRemolque = (idDocumento: number) => {
    const controller = loadAbort();
    const uri = baseUrl + "documentosRemolques/read/" + idDocumento;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const createRemolque = (data: IRemolqueForm) => {
    const controller = loadAbort();
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.post(baseUrl + "remolques/create", data, { signal: controller.signal, headers: header}),
        controller
    }
}

export const editRemolque = (idRemolque: number, data: IRemolqueForm) =>{
    const controller = loadAbort();
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.put(baseUrl + "remolques/update/" + idRemolque, data, { signal: controller.signal, headers: header}),
        controller 
    }
}

export const uploadFilesRemolque = (documentos: IRemolqueDocumentos, idRemolque: number) => {
    let format = new FormData();
    format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    format.append( "url_Factura", documentos.url_Factura);
    format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Remolque", idRemolque.toString());
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "documentosRemolques/create", format, { signal: controller.signal, headers: header}),
        controller
    }
}


export const updateFilesRemolque = (documentos: IRemolqueDocumentos, idDocumento: number, idRemolque: number) => {
    let format = new FormData();
    format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    format.append( "url_Factura", documentos.url_Factura);
    format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Remolque", idRemolque.toString());
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    const controller = loadAbort();
    return {
        call: axios.put(baseUrl + "documentosRemolques/update/" + idDocumento, format, { signal: controller.signal, headers: header}),
        controller
    }
}

export const deleteRemolque = (id_Remolque: number) => {
    const controller = loadAbort();
    let user = JSON.parse(localStorage.getItem('user') as string);
    let header = { 'Authorization': `Bearer ${user?.token}` };
    return {
        call: axios.delete(baseUrl + `remolques/delete/${id_Remolque}`, {signal: controller.signal, headers: header}),
        controller
    }
}