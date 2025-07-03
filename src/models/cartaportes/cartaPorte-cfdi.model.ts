export interface ICartaPorteCfdiForm {
    id_Empresa? : number;
    id_Moneda : number | null;
    id_FormaPago : number | null;
    id_MetodoPago: number | null;
    id_UsoCFDI : number | null;
    id_TipoComprobante : number | null;
    id_Viaje : number | null;
    id_Cliente : number | null;
    dec_SubTotal: number;
    dec_Total: number;
    dec_TotalImpuestosRetenidos: number;
    dec_TotalImpuestosTrasladados: number;
}

export interface IProducServicioCartaPorteCfdiForm {
    id_CFDI: number | null;
    id_ClaveProdServCFDI: number | null;
    id_ClaveUnidadPesoCFDI: number | null;
    id_ObjetoImp: number | null;
    dec_ImporteConcepto: number;
    dec_ValorUnitarioConcepto: number;
    st_DescripcionConcepto: string | null;
    id_ImpuestoTraslado: number | null;
    id_ImpuestoRetencion: number | null;
    id_TipoFactorTraslado: number | null;
    id_TipoFactorRetencion: number | null;
    dec_BaseTraslado: number;
    dec_BaseRetencion: number;
    dec_ImporteTraslado:  number;
    dec_ImporteRetencion: number;
    dec_TasaOCuotaTraslado: number;
    dec_TasaOCuotaRetencion: number;
    i_Cantidad: number;
}