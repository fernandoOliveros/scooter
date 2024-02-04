export interface ICartaPorteDirOrigenForm {
    id_CartaPorte?: number | null;
    id_Estado: number | null;
    id_Localidad: number | null;
    id_Municipio: number | null;
    id_Colonia: number | null;
    st_Calle : string;
    st_NoExterior : string;
    st_NoInterior : string;
    st_RefDomicilio : string;
    st_RemitenteNombre : string;
    date_FechaSalida: Date | null;
    st_RemitenteRFC : string;
    c_codigoPostal : string;
}