export interface OperadorModel {
    id_Operador: number;
    st_Nombre: string;
    st_ApellidoPaterno: string;
    st_ApellidoMaterno: string;
    date_Nacimiento: Date;
    st_NumIMSS?: string;
    st_CURP: string;
    st_RFC: string;
    st_NumLicencia?: string;
    date_LicenciaVigencia?: Date;
}