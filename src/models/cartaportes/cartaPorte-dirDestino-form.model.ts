export interface ICartaPorteDirDestinoForm {
    id_CartaPorte?: number | null;
    id_Estado: number | null;
    id_Localidad: number | null;
    id_Municipio: number | null;
    id_Colonia: number | null;
    c_codigoPostal: string;
    st_Calle: string;
    st_NoExterior: string;
    st_NoInterior: string;
    st_RefDomicilio: string;
    st_DestinatarioNombre: string;
    st_IdUbicacion: string | null;
    date_FechaLlegada: Date | null;
    st_DestinatarioRFC: string;
    dec_DistRe: number;
}