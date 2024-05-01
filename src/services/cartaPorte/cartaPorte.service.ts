import axios from "axios";
import baseUrl from "../../utils/base-url.utils"
import loadAbort from "../../utils/load-abort.util";
import { ICartaPorteCfdiForm, IProducServicioCartaPorteCfdiForm } from "../../models/cartaportes/cartaPorte-cfdi.model";
import { ICartaPorteForm } from "../../models/cartaportes/cartaPorte-form.model";
import { ICartaPorteProductoServicioForm } from "../../models/cartaportes/cartaPorte-produtoServicio-form.model";
import { ICartaPorteDirOrigenForm } from "../../models/cartaportes/cartaPorte-dirOrigen-form.model";
import { ICartaPorteDirDestinoForm } from "../../models/cartaportes/cartaPorte-dirDestino-form.model";


export const getCartaPorteByEmpresa = (idEmpresa: string) => {
    const controller = loadAbort();
    let uri = baseUrl + "cartaporte/readAllByEmpresa/" + idEmpresa;
    return {
        call: axios.get(uri, { signal: controller.signal }),
        controller
    }
}

export const timbrarXmlCartaPorte = (id: number) =>{
    const controller = loadAbort();
    let uri = baseUrl + "timbox/timboxTimbrar/" + id;
    return {
        call: axios.post(uri, {signal: controller.signal}),
        controller
    }
}



export const createXml = (id_CartaPorte: number) => {
    const controller = loadAbort();
    let uri = baseUrl + "cartaporte/create/" + id_CartaPorte;
    return {
        call: axios.get(uri, {signal: controller.signal}),
        controller
    }
}

// =================================== Servicios para Carta Porte ==============================================

export const createCartaPorteService = (idCfdi: number, data: ICartaPorteForm) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "cartaporte/create";
    data.id_CFDI = idCfdi;
    return {
        call: axios.post(uri, data, {signal: controller.signal}),
        controller
    }
}

export const createProductosCartaPorteService = (id_CartaPorte: number, producto: ICartaPorteProductoServicioForm) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "prodServCP/create";
    producto.id_CartaPorte = id_CartaPorte
    return {
        call: axios.post(uri, producto, {signal: controller.signal}),
        controller
    }
}

export const createOrigenCartaPorteService = (id_CartaPorte: number, origen: ICartaPorteDirOrigenForm) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "prodServCP/create/ubicacionOrigen";
    origen.id_CartaPorte = id_CartaPorte
    return {
        call: axios.post(uri, origen, {signal: controller.signal}),
        controller
    }
}

export const createDestinoCartaPorteService = (id_CartaPorte: number, destino: ICartaPorteDirDestinoForm) => {
    const controller = loadAbort(); //Opcion para cancelar solicitud
    let uri = baseUrl + "prodServCP/create/ubicacionDestino";
    destino.id_CartaPorte = id_CartaPorte
    return {
        call: axios.post(uri, destino, {signal: controller.signal}),
        controller
    }
}

// =================================== Servicios Cfdi Carta Porte ==============================================

export const createCfdiCartaPorte = (subtotal: number, total: number, cfdi: ICartaPorteCfdiForm) => {
    const controller = loadAbort();
    let uri = baseUrl + "cfdi/create";
    cfdi.dec_SubTotal = subtotal;
    cfdi.dec_Total = total;
    return {
        call: axios.post(uri, cfdi, {signal: controller.signal}),
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
