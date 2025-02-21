export interface IRemolqueForm {
    st_Anio : string;
    st_Economico : string;
    st_Marca : string;
    st_Placa : string;
    st_NumSerie? : string;
    date_VigenciaFM : Date | null;
    id_TipoRemolque : number | null;
    dec_PesoBrutoVehicular: number | null;
}