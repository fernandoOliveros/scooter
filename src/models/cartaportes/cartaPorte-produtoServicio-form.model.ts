export interface ICartaPorteProductoServicioForm {
    id_ClaveProducto: number | null;
    id_ClaveUnidadPeso: number | null;
    dec_PesoEnKg: number;
    i_Cantidad: number;
    id_DirDestinoCP: number|  null;
    id_DirOrigenCP: number | null;
    st_Descripcion: string | null;
    st_Dimensiones: string | null;
    i_MaterialPeligroso: number;
    id_MaterialesPeligrosos: number | null;
    id_TipoEmbalaje: number | null;
}