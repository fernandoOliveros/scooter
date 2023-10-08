import axios from "axios";
import baseUrl from "../../utils/base-url.utils"
import loadAbort from "../../utils/load-abort.util";

export const getCatTipoMonedas = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readMoneda";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatRegimenFiscal = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readRegimenFiscalCFDI";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}


export const getCatFormaPago = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readFormasPago";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatMetodosPago = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readMetodosPago";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatProdServicioCFDI = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readProdServicioCFDI";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatUnidadPesoCFDI = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readUnidadPesoCFDI";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatUsoCFDI = () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readUsoCFDI";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatTipoImpuestos= () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readTipoImpuestos";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatObjetoImpuesto= () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readObjetoImpuesto";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const getCatTipoFactor= () => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "catalogos/readTipoFactor";
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}
