export interface ICliente {
    id_Cliente: number;
    st_RazonSocial: string;
    st_AliasCliente : string;
    id_RegimenFiscal : number | null;
    st_RFC: string;
    i_Status: number;
    st_PersonaRepresenta: string;
    st_Celular: string;
    st_Correo: string;
    id_Empresa: number;
    id_Candado: number;
}