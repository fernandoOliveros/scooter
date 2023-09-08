export interface ICfdiForm {
    id_Empresa : number | null;
    id_Moneda : number | null;
    id_FormaPago : number | null;
    id_MetodoPago: number | null;
    id_ClaveProdServCFDI : number | null;
    id_ClaveUnidadPeso : number | null;
    id_UsoCFDI : number    | null;
    id_TipoComprobante : number | null;
    id_Viaje : number | null;
    id_Cliente : number | null;
    id_TipoViaje : number| null;
    st_nombreCrudoXML?: string;
}