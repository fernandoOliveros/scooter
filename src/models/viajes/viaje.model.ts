export interface IViajeModel {
    id_Viaje: number;
    folio_int_viaje: number;
    id_Cliente: number;
    id_TipoViaje: number;
    id_Unidad: number;
    id_Operador: number;
    id_Remolque: number;
    i_km_totales: number;
    id_Empresa: number;
    id_StatusViaje: number;
    createdAt: string;
    id_Candado: string | number;
    st_EconomicoUnidad: string;
    st_Nombre: string;
    st_ApellidoP: string;
    st_EconomicoRemolque: string
}


export interface IViajesActivos {
    id_Viaje: number;
    folio_int_viaje: number;
    id_Cliente: number;
    id_TipoViaje: number;
    id_Unidad: number;
    id_Operador: number;
    id_Remolque: number;
    i_km_totales: number;
    id_Empresa: number;
    id_StatusViaje: number;
    createdAt: string;
    id_Candado: string;
    st_EconomicoUnidad: string;
    st_Nombre: string;
    st_ApellidoP: string;
    st_EconomicoRemolque: string;
    HasCFDI: boolean;
}