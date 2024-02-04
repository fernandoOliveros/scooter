import axios from "axios";
import baseUrl from "../../utils/base-url.utils"
import loadAbort from "../../utils/load-abort.util";
import { ICartaPorteCfdiForm, IProducServicioCartaPorteCfdiForm } from "../../models/cartaportes/cartaPorte-cfdi.model";
import { ICartaPorteForm } from "../../models/cartaportes/cartaPorte-form.model";


export const getViajesActivos = (idEmpresa: string) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "viajes/readActivosByEmpresa/" + idEmpresa;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

export const createCartaPorteService = (idCfdi: number, data: ICartaPorteForm) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "cartaporte/create";
    data.id_CFDI = idCfdi;
    return {
        call: axios.post(uri, data, {signal: controller.signal}),
        controller
    }
}

export const createCfdiCartaPorte = (data: ICartaPorteCfdiForm) => {
    const controller = loadAbort();
    let uri = baseUrl + "cfdi/create";
    return {
        call: axios.post(uri, data, {signal: controller.signal}),
        controller
    }
}

export const createProductServiceCfdiCartaPorte = (idCfdi: number, productos: IProducServicioCartaPorteCfdiForm) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "prodServCFDI/create";
    productos.id_CFDI = idCfdi;
    console.log(productos);
    return {
        call: axios.post(uri, productos, {signal: controller.signal}),
        controller
    }
}
