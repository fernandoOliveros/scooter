export interface IOperadorModel {
    id_Operador: number;
    st_Nombre: string;
    st_ApellidoP: string;
    st_ApellidoM: string;
    date_Nacimiento: Date;
    st_NumIMSS?: string;
    st_CURP: string;
    st_RFC: string;
    st_NumLicencia?: string;
    date_LicenciaVigencia?: Date;
}