export interface IRemolqueForm {
    id_Empresa : number,
    st_Anio : string,
    st_Economico : string,
    st_Marca : string,
    st_Placa : string,
    st_NumSerie? : string,
    date_VigenciaFM : Date,
    id_TipoRemolque : number
}