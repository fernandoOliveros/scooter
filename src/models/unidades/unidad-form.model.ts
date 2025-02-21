export interface IUnidadForm{
    st_Marca: string,
    st_SubMarca: string,
    id_TipoUnidad: number | null | string,
    st_PermisoSCT: string,
    st_Economico: string,
    st_Placa: string,
    st_Anio: string,
    st_NumMotor: string,
    st_NumSerie: string,
    st_NumPoliza: string,
    date_Mecanico: Date | null,
    date_Ecologico: Date | null,
    id_Candado: number,
    id_TipoPermiso: number | null;
    id_AseguradoraRespCivil: number | null;
    dec_PesoBrutoVehicular: number | null;
}