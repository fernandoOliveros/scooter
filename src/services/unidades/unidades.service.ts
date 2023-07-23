import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IUnidadForm } from "../../models/unidades/unidad-form.model";
import { IUnidadDocumentos } from "../../models/unidades/unidad-docs.model";

export const getUnidades = (idEmpresa: number) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    //Peticion
    const urlGet = baseUrl + "unidadesEmpresa/read/" + idEmpresa;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
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
    return {
        call: axios.post(baseUrl + "unidades/create", dataUnidad, { signal: controller.signal, }),
        controller
    }
}

export const editUnidad = (idUnidad: string, dataUnidad: IUnidadForm) =>{
    const controller = loadAbort();
    return {
        call: axios.put(baseUrl + "unidades/update/" + idUnidad, dataUnidad, { signal: controller.signal, }),
        controller 
    }
}

export const uploadFilesUnidad = (documentos: IUnidadDocumentos, idUnidad: string) => {
    let format = new FormData();
    format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    format.append( "url_Factura", documentos.url_Factura);
    format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Unidad", idUnidad);
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "documentosUnidades/create", format, { signal: controller.signal, }),
        controller
    }
}

export const updateFilesUnidad = (documentos: IUnidadDocumentos, idDocumento: string, idUnidad: string) => {
    let format = new FormData();
    format.append( "url_TarjetaCirculacion", documentos.url_TarjetaCirculacion);
    format.append( "url_Factura", documentos.url_Factura);
    format.append( "url_PermisoSCT", documentos.url_PermisoSCT);
    format.append("id_Unidad", idUnidad);
    const controller = loadAbort();
    return {
        call: axios.put(baseUrl + "documentosUnidades/update/" + idDocumento, format, { signal: controller.signal, }),
        controller
    }
}