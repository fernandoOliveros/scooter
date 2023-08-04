export interface IOperadorDireccion {
    id_Operador?: number | null;
    c_codigoPostal?: string;
    id_Estado?: number | null;
    id_Localidad?: number | null;
    id_Municipio?: number | null;
    id_Colonia?: number | null;
    st_Calle?: string;
    st_NoExterior?: string;
    st_NoInterior?: string;
    st_RefDomicilio?: string;
}