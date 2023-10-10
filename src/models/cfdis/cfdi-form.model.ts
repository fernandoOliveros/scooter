export interface ICfdiForm {
    id_Empresa : number;
    id_Moneda : number | null;
    id_FormaPago : number | null;
    id_MetodoPago: number | null;
    id_ClaveProdServCFDI : number | null;
    id_ClaveUnidadPeso : number | null;
    id_UsoCFDI : number | null;
    id_TipoComprobante : number | null;
    id_Viaje : number | null;
    id_Cliente : number | null;
    id_TipoViaje : number | null;
    st_nombreCrudoXML?: string;
    dec_SubTotal: number | null;
    dec_Total: number | null;
    dec_BaseTraslado: number | null;
    dec_BaseRetencion: number | null;
    id_ObjetoImp: number | null;
    c_ImpuestoTraslado: string | null;
    c_ImpuestoRetencion: string | null;
    dec_ImporteTraslado: number | null;
    dec_ImporteRetencion: number | null;
    st_TipoFactorTraslado: string | null;
    st_TipoFactorRetencion: string | null;
    dec_TasaOCuotaTraslado: number | null;
    dec_TasaOCuotaRetencion: number | null;
    st_RFC_emisor: string | null;
    st_RFC_receptor: string | null;
    st_LugarExpedicion: string | null;
}

export interface IProducServicioCfdiForm {
    id_ClaveProdServCFDI: number | null;
    dec_Cantidad: number | null;
    id_ClaveUnidadPeso: number | null;
    st_Descripcion: string | null;
    dec_ValorUnitario: number | null;
    dec_Importe: number | null;
    dec_Descuento: number | null;
    id_ObjetoImp: number | null;
    dec_BaseTraslado: number | null;
    c_ImpuestoTraslado: string | null;
    dec_ImporteTraslado: number | null;
    st_TipoFactorTraslado: string | null;
    dec_TasaOCuotaTraslado: number | null;
    dec_BaseRetencion: number | null;
    c_ImpuestoRetencion: string | null;
    dec_ImporteRetencion: number | null;
    st_TipoFactorRetencion: string | null;
    dec_TasaOCuotaRetencion: number | null;
}


//todo: INTERFACES PARA LOS CATÁLOGOS
export interface ICatMoneda {
    id_Moneda: number,
    c_Moneda: string,
    Descripción: string
}

export interface IRegFiscal {
    id_RegimenFiscal: number;
    c_RegimenFiscal: number;
    st_Descripcion: string;
    Física: string;
    Moral: string;
}

export interface IFormasPago {
    id_FormaPago: number;
    c_FormaPago: string;
    Descripción: string;
}

export interface IMetodosPago {
    id_MetodoPago: number;
    c_MetodoPago: string;
    st_Descripcion: string;
}

export interface IProdServicioCFDI{
    id_ClaveProdServCFDI: number;
    c_ClaveProdServ: number;
    Descripcion: string;
}

export interface IUnidadPesoCFDI{
    id_ClaveUnidadPesoCFDI: number;
    c_ClaveUnidad: string;
    st_Nombre: string;
    st_Descripción: string;
}

export interface IUsoCFDI{
    id_UsoCFDI: number;
    c_UsoCFDI: string;
    st_Descripcion: string;
}

export interface ITipoComprobante{
    id_TipoComprobante: number;
    c_TipoDeComprobante: string;
    st_TipoComprobante: string;
}

export interface ITipoImpuestos {
    id_Impuesto: number;
    st_Descripcion: string;
    c_Impuesto: string;
}

export interface IObjetoImpuesto{
    id_ObjetoImp: number;
    st_descripcion: string;
    c_ObjetoImp: string;
}

export interface ITipoFactor {
    id_TipoFactor: number;
    c_TipoFactor: string;
}


export interface ITasaCuota {
    id_TasaCuotaJson: number;
    c_TasaCuota: string;
    dec_ValorAplica: number;
}