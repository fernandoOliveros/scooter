export interface ICartaPorteProductoServicioForm {
    id_ClaveProducto: number | null;
    PesoEnKg: number;
    Cantidad: number;
    deci_ValoeUnitario: number;
    id_ClaveUnidadPeso: number | null;
    MaterialPeligroso: String;
    id_MaterialesPeligrosos?: number;
    id_TipoEmbalaje?: number;
}