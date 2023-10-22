export interface UnidadModel {
    id_Unidad: number;
    id_Candado: string;
    id_Empresa: number;
    id_TipoUnidad: number;
    st_Marca: string;
    st_SubMarca: string;
    st_PermisoSCT: string;
    st_Economico: string;
    st_Anio: string;
    st_Placa: string;
    st_NumMotor?: string;
    st_NumSerie?: string;
    st_NumPoliza?: string;
    date_Mecanico?: Date;
    date_Ecologico?: Date;
    st_DescripcionCandado: string;
}
