export interface ICartaPorteUbicaciones{
    Domicilio: Domicilio
    date_FechaSalida?:  Date | null;
    st_FechaHoraLlegada?: Date | null;
    st_RemitenteRFC?: string;
    st_RemitenteNombre?: string;
    st_DestinatarioRFC?: string;
    st_DestinatarioNombre?: string;
    TipoUbicacion: string;
    DistanciaRecorrida?: string;
    DistanciaRecorridaSpecified?: boolean;
}
interface Domicilio {
    c_codigoPostal: string;
    id_Estado: number | null;
    id_Municipio:number | null;
    id_Localidad:number | null; 
    id_Colonia:number | null;
    Pais: string;
    st_Calle:string;
    st_NoExterior: string;
    st_NoInterior:string;
    st_RefDomicilio: string;
}