export interface IViajeForm {
    folio_int_viaje: number;
    id_Cliente: number | null;
    id_TipoViaje: number | null;
    id_Unidad : number | null;
    id_Operador : number | null;
    i_km_totales: number ;
    id_Empresa : number | null;
    id_StatusViaje : number;
    id_Candado: number;
}


export interface IRelViajeRemolqueForm {
    id_Viaje: number;
    id_Remolque: number;
}