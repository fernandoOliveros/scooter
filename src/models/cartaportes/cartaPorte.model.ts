export interface ICartaPorte {
    id_CartaPorte: number | null;
    id_Viaje: number | null;
    id_CFDI: number | null;
    folio_int_cp: number | null;
    i_NumberTotalMercancias: number | null;
    st_LugarExpedicion: string;
    dec_TotalDistRec: number | null; //debe la suma de las distancias recorridas
};


export interface IProductosServicios {
    id_ClaveProducto: number;
    st_ClaveProducto: string;
    st_DescripcionProducto: string;
    st_PalabrasClave: string;
    st_MaterialPeligroso: string;
}

export interface IUnidadPeso {
    id_ClaveUnidadPeso: number;
    st_ClaveUnidad: string;
    st_NombreClave: string;
    st_DescripcionClave: string;
}

export interface IMaterialPeligroso {
    c_MaterialesPeligrosos: string;
    st_descripcion: string;
    id_MaterialesPeligrosos: number;
}

export interface IEmbalaje {
    c_tipoEmbalaje: string;
    st_descripcion: string;
    id_TipoEmbalaje: number;
}


export interface IViajesActivos {
    id_Viaje: number;
    folio_int_viaje: number;
    id_Cliente: number;
    id_TipoViaje: number;
    id_Unidad: number;
    id_Operador: number;
    id_Remolque: number;
    i_km_totales: number;
    id_Empresa: number;
    id_StatusViaje: number;
    createdAt: string;
    id_Candado: string;
    st_EconomicoUnidad: string;
    st_Nombre: string;
    st_ApellidoP: string;
    st_EconomicoRemolque: string;
    HasCFDI: boolean;
}