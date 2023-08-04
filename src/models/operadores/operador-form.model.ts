export interface IOperadorForm{
    id_Empresa:  number | null;
    id_TipoPuesto:  number | null;
    st_Nombre:  string;
    st_ApellidoP:  string;
    st_ApellidoM:  string;
    date_Nacimiento:  Date | null;
    st_NumIMSS: string;
    st_CURP:  string;
    st_RFC: string;
    st_NumLicencia:  string | null;
    date_LicenciaVigencia: Date | null;
    i_Status:  number;
}