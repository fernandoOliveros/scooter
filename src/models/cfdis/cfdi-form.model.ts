export interface ICfdiForm {
    id_Empresa : number;
    id_Moneda : number | null;
    id_FormaPago : number | null;
    id_MetodoPago: number | null;
    id_UsoCFDI : number | null;
    id_TipoComprobante : number | null;
    id_Viaje : number | null;
    id_Cliente : number | null;
    dec_SubTotal: number | null;
    dec_Total: number | null;
    st_CondicionesPago: string | null;
}

export interface IProducServicioCfdiForm {
    id_CFDI: number | null;
    id_ClaveProdServCFDI: number | null;
    id_ClaveUnidadPesoCFDI: number | null;
    id_ObjetoImp: number | null;
    dec_ImporteConcepto: number | null;
    dec_ValorUnitarioConcepto: number | null;
    st_DescripcionConcepto: string | null;
    id_ImpuestoTraslado: number | null;
    id_ImpuestoRetencion: number | null;
    id_TipoFactorTraslado: number | null;
    id_TipoFactorRetencion: number | null;
    dec_BaseTraslado: number | null;
    dec_BaseRetencion: number | null;
    dec_ImporteTraslado:  number | null;
    dec_ImporteRetencion: number | null;
    dec_TasaOCuotaTraslado: number | null;
    dec_TasaOCuotaRetencion: number | null;
    i_Cantidad: number | null;
    dec_Descuento: number | null;
}


//todo: INTERFACES PARA LOS CATÁLOGOS
export interface ICatMoneda {
    id_Moneda: number,
    c_Moneda: string,
    st_Descripcion: string
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
    st_descripcion: string;
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