export interface ICliente {
    id_Cliente: number;
    st_RazonSocial: string;
    st_AliasCliente : string;
    id_RegimenFiscal : number | null;
    st_RFC: string;
    i_Status: number;
    st_PersonaRepresenta: string | null;
    st_Celular: string | null;
    st_Correo: string | null;
    id_Empresa: number;
    id_Candado: number;
}