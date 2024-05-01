export interface ICartaPorteCfdiForm {
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
    dec_TotalImpuestosRetenidos?: number | null;
    dec_TotalImpuestosTrasladados?: number | null;
}

export interface IProducServicioCartaPorteCfdiForm {
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
}