export interface IViajeForm {
    folio_int_viaje: number;
    id_Cliente: number | null;
    id_TipoViaje: number | null;
    id_Unidad : number | null;
    id_Operador : number | null;
    id_Remolque : number | null;
    i_km_totales: number;
    id_Empresa : number | null;
    id_StatusViaje : number;
    remolque?:number[];
}