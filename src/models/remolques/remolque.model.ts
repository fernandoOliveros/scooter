export interface IRemolqueModel {
    id_Remolque: number;
    id_TipoRemolque: number;
    id_Empresa: number;
    st_Anio: string;
    st_Economico: string;
    st_Marca: string;
    st_Placa: string;
    st_NumSerie: string;
    date_VigenciaFM: Date;
    i_Status: number;
    url_TarjetaCirculacion?: string;
    url_Factura?: string;
    url_PermisoSCT?: string;
    id_Documento?: number;
}