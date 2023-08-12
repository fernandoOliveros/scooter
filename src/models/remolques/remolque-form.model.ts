export interface IRemolqueForm {
    id_Empresa : number | null;
    st_Anio : string;
    st_Economico : string;
    st_Marca : string;
    st_Placa : string;
    st_NumSerie? : string;
    date_VigenciaFM : Date | null;
    id_TipoRemolque : number | null;
}