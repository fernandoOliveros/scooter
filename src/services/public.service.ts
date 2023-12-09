import axios from "axios";
import loadAbort from "../utils/load-abort.util"
import baseUrl from "../utils/base-url.utils";



export const getUltimoFolioViaje = (id_Empresa: string) => {
    const controller = loadAbort();
    //Peticion
    const urlGet = baseUrl + "viajes/getLatestFolio/" + id_Empresa;
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
    
}

export const getTipoPermisoSct = () =>{
    const controller = loadAbort();
    //Peticion
    const urlGet = baseUrl + "unidades/readTiposPermisosSCT";
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }

}

export const getTipoUnidad = () => {
    const controller = loadAbort();
    //Peticion
    const urlGet = baseUrl + "tiposUnidades/read";
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getAseguradoras = () => {
    const controller = loadAbort();
    //Peticion
    const urlGet = baseUrl + "catalogos/readAseguradora";
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getTipoRemolque = () => {
    const controller = loadAbort();
    const urlGet = baseUrl + "remolques/readTypes";
    return {
        call: axios.get(urlGet, {signal: controller.signal}),
        controller
    }
}

export const getColoniasByCodigoPostal = (codigo_postal : string) => {
    const controller = loadAbort();
    const url = baseUrl + "direccionOperadores/getByCP/" + codigo_postal;
    return {
        call: axios.get(url, {signal: controller.signal} ),
        controller
    }
}

export const getProductosServicioCP = () =>{
    const controller = loadAbort();
    const url = baseUrl + "catalogos/readProdServicioCP";
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}

export const getProductoCPLike = (search: string) => {
    const controller = loadAbort();
    const url = baseUrl + 'productos/readClaveProductoServicio/"' + search + '"';
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}

export const getMaterialesPeligrosos = () =>{
    const controller = loadAbort();
    const url = baseUrl + "catalogos/readMaterialesPeligrosos";
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}

export const getOrigenesCPEmpresa = (id_Empresa: string) => {
    const controller = loadAbort();
    const url = baseUrl + "complemento de la url" + id_Empresa;
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}

export const getUnidadPesoCP = () => {
    const controller = loadAbort();
    const url = baseUrl + "productos/readClaveUnidadPeso";
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}

export const getEmbalajesCP = () =>{
    const controller = loadAbort();
    const url = baseUrl + "catalogos/readEmbalajes";
    return {
        call: axios.get(url, { signal: controller.signal }),
        controller
    }
}