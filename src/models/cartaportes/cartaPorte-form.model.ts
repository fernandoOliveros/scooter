export interface ICartaPorteForm {
    id_Viaje: number | null;
    id_CFDI: number | null;
    folio_int_cp: number | null;
    i_NumTotalMercancias: number | null;
    st_LugarExpedicion: string | null;
    dec_TotalDistRec: number | null; //debe la suma de las distancias recorridas
    dec_PesoBrutoTotalMercancias: number | null;
    id_AseguraMedAmbiente: number | null;
    id_AseguraCarga: number | null;
    st_PolizaMedAmbiente: string | null;
    st_PolizaAseguraCarga: string | null;
};