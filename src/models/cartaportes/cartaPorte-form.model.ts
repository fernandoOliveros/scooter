export interface ICartaPorteForm {
    id_Viaje: number | null;
    id_CFDI: number | null;
    folio_int_cp: number | null;
    i_NumberTotalMercancias: number | null;
    st_LugarExpedicion: string;
    dec_TotalDistRec: number | null; //debe la suma de las distancias recorridas
};