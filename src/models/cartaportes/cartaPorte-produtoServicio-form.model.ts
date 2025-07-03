export interface ICartaPorteProductoServicioForm {
    id_CartaPorte?: number | null;
    id_ClaveProducto: number | null;
    id_ClaveUnidadPeso: number | null;
    dec_PesoEnKg: number;
    i_Cantidad: number;
    id_DirDestinoCP: number|  null;
    id_DirOrigenCP: number | null;
    st_Descripcion: string;
    st_Dimensiones: string;
    i_MaterialPeligroso: number;
    id_MaterialesPeligrosos: number | null;
    id_TipoEmbalaje: number | null;
}