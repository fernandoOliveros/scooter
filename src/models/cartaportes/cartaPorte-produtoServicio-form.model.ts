export interface ICartaPorteProductoServicioForm {
    id_ClaveProducto: number | null;
    PesoEnKg: number;
    Cantidad: number;
    deci_ValoeUnitario: number;
    id_ClaveUnidadPeso: number | null;
    CantidadTransporta?: ProductoTransportado;
    MaterialPeligroso: String;
}
export interface ProductoTransportado {
    Cantidad: number;
}