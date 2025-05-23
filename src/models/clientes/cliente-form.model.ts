export interface IClienteForm {
    st_RazonSocial: string;
    st_AliasCliente : string;
    id_RegimenFiscal : number | null;
    st_RFC: string;
    i_Status: number;
    c_DomicilioFiscal: string;
    st_PersonaRepresenta?: string;
    st_Celular?: string;
    st_Correo?: string;
    id_Empresa: number | null;
    id_Candado?: number | null;
}