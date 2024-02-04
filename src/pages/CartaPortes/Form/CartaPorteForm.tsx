import { ChangeEvent, Fragment, lazy, useEffect, useState } from 'react'
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';

//components forms
import DirOrigenForm from './DirOrigenForm';
import DirDestinoForm from './DirDestinoForm';
import ProductoServicioForm from './ProductoServicioForm';
import { ICartaPorteForm } from '../../../models/cartaportes/cartaPorte-form.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { createCartaPorteService, createCfdiCartaPorte, createDestinoCartaPorteService, createOrigenCartaPorteService, createProductServiceCfdiCartaPorte, createProductosCartaPorteService, getViajesActivos } from '../../../services/cartaPorte/cartaPorte.service';
import { IViajesActivos } from '../../../models/cartaportes/cartaPorte.model';
import { ICatMoneda, IFormasPago, IMetodosPago, IObjetoImpuesto, IProdServicioCFDI, ITasaCuota, ITipoComprobante, ITipoFactor, ITipoImpuestos, IUnidadPesoCFDI, IUsoCFDI } from '../../../models/cfdis/cfdi-form.model';
import { ICartaPorteCfdiForm, IProducServicioCartaPorteCfdiForm } from '../../../models/cartaportes/cartaPorte-cfdi.model';
import { getClientesEmpresa } from '../../../services/clientes/clientes.service';
import { getCatTipoMonedas, getCatFormaPago, getCatMetodosPago, getCatProdServicioCFDI, getCatUsoCFDI, getCatTipoImpuestos, getCatObjetoImpuesto, getCatTipoFactor } from '../../../services/cfdi/cfdi.service';
import { ICliente } from '../../../models/clientes/cliente.model';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

//Lazy load Dialogs
const DialogOrigenes = lazy( () => import('../../../components/CartaPorte/DialogOrigenes'));
const DialogDestinos = lazy( () => import( '../../../components/CartaPorte/DialogDestinos'));
const DialogProductos = lazy( () => import( '../../../components/CartaPorte/DialogProductos'));

export interface Props {
  returnFormCartaPorte: (result: boolean) => void
}


type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

// todo: Catalogo para cfdi
let ITipoComprobanteArray = [
  {
    id_TipoComprobante: 1,
    c_TipoDeComprobante: 'I',
    st_TipoComprobante: 'Ingreso'
  },
  {
    id_TipoComprobante: 2,
    c_TipoDeComprobante: 'T',
    st_TipoComprobante: 'Traslado'
  },
  {
    id_TipoComprobante: 3,
    c_TipoDeComprobante: 'E',
    st_TipoComprobante: 'Egreso'
  },
  {
    id_TipoComprobante: 4,
    c_TipoDeComprobante: 'N',
    st_TipoComprobante: 'Nomina'
  }
];
 
let catTasaCuotaJson: ITasaCuota[] = [
  {
    id_TasaCuotaJson: 1,
    c_TasaCuota: "4 %",
    dec_ValorAplica: 0.04
  },
  {
    id_TasaCuotaJson: 2,
    c_TasaCuota: "8 %",
    dec_ValorAplica: 0.08
  },
  {
    id_TasaCuotaJson: 3,
    c_TasaCuota: "10 %",
    dec_ValorAplica: 0.10
  },
  {
    id_TasaCuotaJson: 4,
    c_TasaCuota: "12 %",
    dec_ValorAplica: 0.12
  },
  {
    id_TasaCuotaJson: 5,
    c_TasaCuota: "16 %",
    dec_ValorAplica: 0.16
  }
];

const productoServicioCfdiEmpty : IProducServicioCartaPorteCfdiForm = {
  id_CFDI: null,
  id_ClaveProdServCFDI: null,
  id_ClaveUnidadPesoCFDI: null,
  id_ObjetoImp: null,
  dec_ImporteConcepto: null,
  dec_ValorUnitarioConcepto: 1,
  st_DescripcionConcepto: null,
  id_ImpuestoTraslado: null,
  id_ImpuestoRetencion: null,
  id_TipoFactorTraslado: null,
  id_TipoFactorRetencion: null,
  dec_BaseTraslado: null,
  dec_BaseRetencion: null,
  dec_ImporteTraslado: null,
  dec_ImporteRetencion: null,
  dec_TasaOCuotaTraslado: null,
  dec_TasaOCuotaRetencion: null,
  i_Cantidad: 1
}

let catUnidadServicio : IUnidadPesoCFDI[] = [
  {
    id_ClaveUnidadPesoCFDI: 1,
    c_ClaveUnidad: "E48",
    st_Nombre: "Unidad de servicio",
    st_Descripción: "Unidad de conteo que define el número de unidades de servicio (unidad de servicio: definido período / propiedad / centro / utilidad de alimentación)."
  }
];

function CartaPorteForm({ returnFormCartaPorte }: Props) {

  // todo: Recolectamos el id_Empresa de local storage
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;

  //todo: Custom Hooks POST
  const { callEndpoint } = useFetchAndLoad();

  //todo: Variable general carta porte
  const [cartaPorte, setCartaPorte] = useState<ICartaPorteForm>({
    id_Viaje: null,
    id_CFDI: null,
    folio_int_cp: null,
    i_NumberTotalMercancias: null,
    st_LugarExpedicion: null,
    dec_TotalDistRec:  null,
    dec_PesoBrutoTotalMercancias: null,
    id_AseguraMedAmbiente: null,
    id_AseguraCarga: null,
    st_PolizaMedAmbiente: null,
    st_PolizaAseguraCarga: null
  });

  //todo: Variable general del cfdi de la carta porte
  const [cfdi, setCfdi] = useState<ICartaPorteCfdiForm>({
    id_Empresa : id_Empresa,
    id_Moneda : null,
    id_FormaPago : null,
    id_MetodoPago: null,
    id_UsoCFDI : null,
    id_TipoComprobante : null,
    id_Viaje : null,
    id_Cliente : null,
    dec_SubTotal: null,
    dec_Total: null
  });

  //todo: Variable general del producto/servicio del cfdi
  const [productCfdi, setProductCfdi] = useState<IProducServicioCartaPorteCfdiForm>(productoServicioCfdiEmpty);
  
  //todo: Variables para abrir el modal
  const [openOrigenes, SetOpenOrigenes] = useState<boolean>(false);
  const [openDestinos, SetOpenDestinos] = useState<boolean>(false);
  const [openProductos, SetOpenProductos] = useState<boolean>(false);

  //todo: Variables para el formulario
  const [arrOrigenes, setArrOrigenes] = useState<ICartaPorteDirOrigenForm[]>([]);
  const [arrDestinos, setArrDestino] = useState<ICartaPorteDirDestinoForm[]>([]);
  const [productosServicios, setProductoServicios] = useState<ICartaPorteProductoServicioForm[]>([]);
  const [tipoComprobante, setTipoComprobante] = useState<string>("");
  const [showImpuestos, setShowImpuestos] = useState<boolean>(false);

  //todo: catalogos para Cfdi
  const [catViajesActivos, setCatViajesActivos] = useState<IViajesActivos[]>([]);
  const [catClientes, setCatClientes] = useState<ICliente[]>([]);
  const [catMonedas, setCatMonedas] = useState<ICatMoneda[]>([]);
  const [catFormasPago, setCatFormasPago] = useState<IFormasPago[]>([]);
  const [catMetodosPago, setCatMetodosPago] = useState<IMetodosPago[]>([]);
  const [catProdServicioCFDI, setCatProdServicioCFDI] = useState<IProdServicioCFDI[]>([]);
  const [catUnidadPesoCFDI, setCatUnidadPesoCFDI] = useState<IUnidadPesoCFDI[]>([]);
  const [catUsoCFDI, setCatUsoCFDI] = useState<IUsoCFDI[]>([]);
  const [catTipoComprobante, setCatTipoComprobante] = useState<ITipoComprobante[]>([]);
  const [catTipoImpuestos, setCatTipoImpuestos] = useState<ITipoImpuestos[]>([]);
  const [catObjetoImpuesto, setCatObjetoImpuesto] = useState<IObjetoImpuesto[]>([]);
  const [catTipoFactor, setCatTipoFactor] = useState<ITipoFactor[]>([]);
  const [catTasaCuota, setCatTasaCuota] = useState<ITasaCuota[]>([]);

  //todo: variables para formulario <Autocomplete />
  const [selectViaje, setSelectViaje] = useState<IViajesActivos | null>(null);
  const [selectClientes, setSelectClientes] = useState< ICliente | null>(null);
  const [selectMonedas, setSelectMonedas] = useState< ICatMoneda | null>(null);
  const [selectFormasPago, setSelectFormasPago] = useState< IFormasPago | null>(null);
  const [selectMetodosPago, setSelectMetodosPago] = useState< IMetodosPago | null>(null);
  const [selectProdServicioCfdi, setSelectProdServicioCfdi] = useState< IProdServicioCFDI | null>(null);
  const [selectUnidadPesoCfdi, setSelectUnidadPesoCfdi] = useState< IUnidadPesoCFDI | null>(null);
  const [selectUsoCfdi, setSelectUsoCfdi] = useState< IUsoCFDI | null>(null);
  const [selectTipoComprobante, setSelectTipoComprobante] = useState< ITipoComprobante | null>(null);
  const [selectObjetoImpuesto, setSelectObjetoImpuesto] = useState<IObjetoImpuesto | null>(null);
  //todo Traslado
  const [selectTipoImpuestosTraslado, setSelectTipoImpuestosTraslado] = useState< ITipoImpuestos | null>(null);
  const [selectTipoFactorTraslado, setSelectTipoFactorTraslado] = useState<ITipoFactor | null>(null);
  const [selectTasaCuotaTraslado, setSelectTasaCuotaTraslado] = useState<ITasaCuota | null>(null);

  //todo: Retencion  
  const [selectTipoImpuestosRetencion, setSelectTipoImpuestosRetencion] = useState< ITipoImpuestos | null>(null);
  const [selectTipoFactorRetencion, setSelectTipoFactorRetencion] = useState<ITipoFactor | null>(null);
  const [selectTasaCuotaRetencion, setSelectTasaCuotaRetencion] = useState<ITasaCuota | null>(null)

  //todo: Función que se ejecuta cuando se monta el componente
  useEffect(() => {
    // services
    const loadViajesActivos = getViajesActivos(id_Empresa);
    const loadClientes = getClientesEmpresa(id_Empresa);
    const loadMonedas = getCatTipoMonedas();
    const loadFormasPago = getCatFormaPago();
    const loadMetodosPago = getCatMetodosPago();
    const loadProdServicioCfdi = getCatProdServicioCFDI();
    const loadUsoCfdi = getCatUsoCFDI();
    const loadTipoImpuestos = getCatTipoImpuestos();
    const loadObjetoImpuesto = getCatObjetoImpuesto();
    const loadTipoFactor = getCatTipoFactor();

    //obtenemos los viajes activos por empresa
    const _getViajesActivos = () => {
      loadViajesActivos.call
      .then((resp) => {
        let response = resp.data;
        setCatViajesActivos(response.data);
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getClientes =  () => {
      loadClientes.call
      .then((resp) => {
        let response = resp.data;
        setCatClientes(response.data);
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getMonedas = () => {
      loadMonedas.call
      .then((resp) => {
        let response = resp.data;
        setCatMonedas(response.data);
      }).catch((error: any) => {
        console.log(error);
      });
      
    }

    const _getFormasPago = () => {
      loadFormasPago.call
      .then((resp) => {
        let response = resp.data;
        setCatFormasPago( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getMetodosPago = () => {
      loadMetodosPago.call
      .then((resp) => {
        let response = resp.data;
        setCatMetodosPago( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getProdServiciosCfdi = () => {
      loadProdServicioCfdi.call
      .then((resp) => {
        let response = resp.data;
        setCatProdServicioCFDI( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getUnidadPesoCfdi = () => {
      setCatUnidadPesoCFDI( catUnidadServicio );
    }

    const _getUsoCfdi = async() => {
      loadUsoCfdi.call
      .then((resp) => {
        let response = resp.data;
        setCatUsoCFDI( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getTipoComprobante = () => {
      setCatTipoComprobante(ITipoComprobanteArray);
    }

    const _getTipoImpuestos = () => {
      loadTipoImpuestos.call
      .then((resp) => {
        let response = resp.data;
        setCatTipoImpuestos( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getObjetoImpuesto = () => {
      loadObjetoImpuesto.call
      .then((resp) => {
        let response = resp.data;
        setCatObjetoImpuesto( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getTipoFactor = () => {
      loadTipoFactor.call
      .then((resp) => {
        let response = resp.data;
        setCatTipoFactor( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getTasaCuota = () => {
      setCatTasaCuota(catTasaCuotaJson);
    }

    _getViajesActivos();
    _getClientes();
    _getMonedas();
    _getFormasPago();
    _getMetodosPago();
    _getProdServiciosCfdi();
    _getUnidadPesoCfdi();
    _getUsoCfdi();
    _getTipoComprobante();
    _getTipoImpuestos();
    _getObjetoImpuesto();
    _getTipoFactor();
    _getTasaCuota();
  },[]);

  //todo: Funciones reciben respuesta de los respectivos componentes
  const guardarOrigen = (origen: ICartaPorteDirOrigenForm) => setArrOrigenes([...arrOrigenes, origen]);
  const guardarDestino = (destino: ICartaPorteDirDestinoForm) => setArrDestino([...arrDestinos, destino]);
  const guardarProductosServicios = (producto: ICartaPorteProductoServicioForm) => setProductoServicios([...productosServicios, producto]);

  //todo: Funcion para calcular total de mercancia, distancia recorrida conforme se guarda en el arreglo de productoServicios
  useEffect(() => {
    let pesoBruto : number = 0;
    productosServicios.forEach( item => pesoBruto += + (item?.i_Cantidad));
    setCartaPorte({...cartaPorte, i_NumberTotalMercancias: productosServicios.length, dec_PesoBrutoTotalMercancias: pesoBruto});
  },[productosServicios]);

  useEffect(() => {
    let distanciaRecorrida: number = 0;
    // sumando las distancias
    arrDestinos.forEach(item => distanciaRecorrida += item?.dec_DistRe);
    setCartaPorte({...cartaPorte, dec_TotalDistRec: distanciaRecorrida});
  },[arrDestinos]);

  //todo: Funcion para editar formulario seccion de producto / servicio cfdi
  const onChangeFormPoductoServicio = ({ target: { name, value } }: handleChangeForm) => setProductCfdi({...productCfdi, [name]: value});

  //todo: funcion cada vez que se selecciona un viaje (select)
  useEffect(() => {
    setCartaPorte({ ...cartaPorte, id_Viaje: (selectViaje !== null) ? selectViaje.id_Viaje : null });
  },[selectViaje]);

   //todo: funcion cada vez que se selecciona un viaje (select)
   useEffect(() => {
    setCfdi({ ...cfdi, id_Viaje: (selectViaje !== null) ? selectViaje.id_Viaje : null });
  },[selectViaje]);

  //todo: Effect para select cat - Tipo Comprobante
  useEffect(() => {
    //* seteamos el tipo de comprobante en la variable del formulario
    setCfdi({...cfdi, id_TipoComprobante: (selectTipoComprobante !== null) ? selectTipoComprobante.id_TipoComprobante : null});

    // *  hacemos set del tipoComprobante para validaciones
    let stringTipoComprobante = (selectTipoComprobante !== null) ? selectTipoComprobante.st_TipoComprobante : "";
    setTipoComprobante( stringTipoComprobante );
  },[selectTipoComprobante]);

  //todo: Effect para select cat - clientes
  useEffect(() => {
    setCfdi({...cfdi, id_Cliente: (selectClientes !== null) ? selectClientes.id_Cliente : null});
  },[selectClientes]);

  //todo: Effect para select cat - Monedas
  useEffect(() => {
    setCfdi({...cfdi, id_Moneda: (selectMonedas !== null) ? selectMonedas.id_Moneda : null});
  },[selectMonedas]);

  //todo:Effect para select cat - Formas de pago
  useEffect(() => {
    setCfdi({...cfdi, id_FormaPago: (selectFormasPago !== null) ? selectFormasPago.id_FormaPago : null});
  },[selectFormasPago]);

  //todo:Effect para select cat - Metodos de pago
  useEffect(() => {
    setCfdi({...cfdi, id_MetodoPago: (selectMetodosPago !== null) ? selectMetodosPago.id_MetodoPago : null});
  },[selectMetodosPago]);

  //todo:Effect para select cat - uso de CFDI
  useEffect(() => {
    setCfdi({...cfdi, id_UsoCFDI: (selectUsoCfdi) !== null ? selectUsoCfdi.id_UsoCFDI : null});
  },[selectUsoCfdi]);

  //todo: Effect para select cat - productoServicio CFDI
  useEffect(()=>{
    setProductCfdi({...productCfdi, id_ClaveProdServCFDI: (selectProdServicioCfdi !== null) ? selectProdServicioCfdi.id_ClaveProdServCFDI : null });
  },[selectProdServicioCfdi]);

  //todo: Effect para select cat - Unidad peso CFDI
  useEffect(()=>{
    setProductCfdi({...productCfdi, id_ClaveUnidadPesoCFDI: (selectUnidadPesoCfdi !== null) ? selectUnidadPesoCfdi.id_ClaveUnidadPesoCFDI : null });
  },[selectUnidadPesoCfdi]);

  //todo: Effect para select cat- Objeto de impuesto
  useEffect(()=> {
    if(selectObjetoImpuesto?.c_ObjetoImp === "02") {setShowImpuestos(true);}
    setProductCfdi({...productCfdi, id_ObjetoImp: (selectObjetoImpuesto !== null) ? selectObjetoImpuesto.id_ObjetoImp : null});
  },[selectObjetoImpuesto]);

  //todo:Effect para catalogo - Tipo Impuesto traslado
  useEffect(() => {
    setProductCfdi({...productCfdi, id_ImpuestoTraslado: (selectTipoImpuestosTraslado !== null) ? selectTipoImpuestosTraslado.id_Impuesto : null});
  },[selectTipoImpuestosTraslado]);

  //todo:Effect para catalogo - Tipo Factor Traslado
  useEffect(() => {
    setProductCfdi({...productCfdi, id_TipoFactorTraslado: (selectTipoFactorTraslado !== null) ? selectTipoFactorTraslado.id_TipoFactor : null});
  },[selectTipoFactorTraslado]);

  //todo: Effect para catalogo - Tasa Cuota Traslado
  useEffect(() => {
    setProductCfdi({...productCfdi, dec_TasaOCuotaTraslado: (selectTasaCuotaTraslado !== null) ? selectTasaCuotaTraslado.dec_ValorAplica : null });
  },[selectTasaCuotaTraslado]);

  //todo:Effect para catalogo - Tipo Impuesto retención
  useEffect(() => {
    setProductCfdi({...productCfdi, id_ImpuestoRetencion: (selectTipoImpuestosRetencion !== null) ? selectTipoImpuestosRetencion.id_Impuesto : null});
  },[selectTipoImpuestosRetencion]);

  //todo:Effect para catalogo - Tipo Factor rertención
  useEffect(() => {
    setProductCfdi({...productCfdi, id_TipoFactorRetencion: (selectTipoFactorRetencion !== null) ? selectTipoFactorRetencion.id_TipoFactor : null});
  },[selectTipoFactorRetencion]);

  //todo: Effect para catalogo - Tasa Cuota retención
  useEffect(() => {
    setProductCfdi({...productCfdi, dec_TasaOCuotaRetencion: (selectTasaCuotaRetencion !== null) ? selectTasaCuotaRetencion.dec_ValorAplica : null });
  },[selectTasaCuotaRetencion]);

  //todo: Funcion para calcular el importe del servicio además de la base de impuesto traslado y retención
  const CalcularBaseImpuestos = () => {
    let importe: number = CalculateImporteBeforeImpuestos();
    setProductCfdi({...productCfdi, dec_ImporteConcepto: importe, dec_BaseTraslado: importe, dec_BaseRetencion: importe});
  }

  //todo: Funcion para calcular el importe del producto / servicio cfdi
  const CalculateImporteBeforeImpuestos = (): number => {
    let importe: number = 0;
    if(productCfdi.dec_ValorUnitarioConcepto !== null && productCfdi.i_Cantidad !== null ){
      importe = productCfdi.dec_ValorUnitarioConcepto * productCfdi.i_Cantidad;
    }
    return importe;
  }

  //todo: Effect para mandar llamar a la funcion para importe 
  //todo: (cuando cambie de valor dec_TasaOCuotaTraslado, base Traslado)
  useEffect(() => {
    CalcularImporteTrasladoAfterImpuestos();
  },[productCfdi.dec_TasaOCuotaTraslado, productCfdi.dec_BaseTraslado]);

  const CalcularImporteTrasladoAfterImpuestos = () => {
    let importe: number = 0;
    if(productCfdi.dec_BaseTraslado !== null && productCfdi.dec_TasaOCuotaTraslado !== null ){
      //.ToFixed(3) solo tomas 3 decimal y el  +() convierte string a number
      importe =  + (productCfdi.dec_BaseTraslado * productCfdi.dec_TasaOCuotaTraslado).toFixed(3);
      setProductCfdi({...productCfdi, dec_ImporteTraslado: importe});
    }else{
      setProductCfdi({...productCfdi, dec_ImporteTraslado: null});
    }
  }

  //todo: Effect para mandar llamar a la funcion para importe 
  //todo: (cuando cambie de valor dec_TasaOCuotaRetencion, dec_BaseRetencion)
  useEffect(() => {
    CalcularImporteRetencionAfterImpuestos();
  },[productCfdi.dec_TasaOCuotaRetencion, productCfdi.dec_BaseRetencion]);

  const CalcularImporteRetencionAfterImpuestos = () => {
    let importe: number = 0;
    if(productCfdi.dec_BaseRetencion !== null && productCfdi.dec_TasaOCuotaRetencion !== null ){
      //.ToFixed(3) solo tomas 3 decimal y el  +() convierte string a number
      importe = + (productCfdi.dec_BaseRetencion * productCfdi.dec_TasaOCuotaRetencion).toFixed(3);
      setProductCfdi({...productCfdi, dec_ImporteRetencion: importe});
    }else{
      setProductCfdi({...productCfdi, dec_ImporteRetencion: null});
    }
  }

  //todo: Effect para select de tipo de comprobante
  useEffect(() => {
    // //todo: Validación si es comprobante es "Traslado" o "Pago" el subtotal y total lo ponemos en 0
    if(selectTipoComprobante !== null && ( selectTipoComprobante.st_TipoComprobante === "Traslado") ){
      setCfdi({...cfdi, dec_SubTotal: 0, dec_Total: 0});
    } else setCfdi({...cfdi, dec_SubTotal: null, dec_Total: null});
  },[cfdi.id_TipoComprobante]);

  //todo: Abrimos el dialog correspondiente
  const viewOrigenes = (option: boolean) => SetOpenOrigenes(option);
  const viewDestinos = (option: boolean) => SetOpenDestinos(option);
  const viewProductos = (option: boolean) => SetOpenProductos(option);

  //todo: Funciones para eliminar un item de origen, destino o producto
  const eliminarOrigen = (position: number) => {
    console.log(position);
  }

  const eliminarDestino = (position: number) => {
    console.log(position);
  }

  const eliminarProducto = (position: number) => {
    console.log("Producto: " + position);
  }

  //todo: Funcion para calcular el total del cfdi de la carta porte
  const addSubAndTotal = () : number => {
    //total = (importe + traslados(16%)) - retención (04%)
    let total : number = 0;
    if(productCfdi.dec_ImporteConcepto != null && productCfdi.dec_ImporteTraslado != null && productCfdi.dec_ImporteRetencion != null){
      total = (productCfdi.dec_ImporteConcepto + productCfdi.dec_ImporteTraslado) - productCfdi?.dec_ImporteRetencion; 
    }
    return total;
  }

  //todo: Funcioón para crear y guardar el cfdi
  const createCfdi = async(e: any) => {
    e.preventDefault();
    let total = addSubAndTotal();
    let subtotal: number = productCfdi?.dec_ImporteConcepto!;
    try {
      let cfdi_result = await callEndpoint(createCfdiCartaPorte(subtotal, total, cfdi));
      console.log(cfdi_result.data);
      createProdServiceCfdi(cfdi_result.data.data.id_CFDI);
      console.log(cfdi_result);
    } catch (error) {
      console.log("Cfdi: " + error)
    }
  }

  //todo: Funcion para crear y guardar el producto/servicio de la carta porte
  const createProdServiceCfdi =  async(idCfi: number) => {
    try {
      let productoCfdi_result = await callEndpoint(createProductServiceCfdiCartaPorte(idCfi, productCfdi));
      console.log(productoCfdi_result.data.data);
      createCartaporte(idCfi);
    } catch (error) {
      console.log("Cfdi producto/Servicio: " + error)
    }
  }

  //todo: Funcion para crear y guardar la carta porte
  const createCartaporte = async(idCfi: number) => {
    try {
      let cartaPorte_response = await callEndpoint(createCartaPorteService(idCfi,cartaPorte));
      console.log(cartaPorte_response.data.data);
      createProductCartaPorte(cartaPorte_response.data.data.id_CartaPorte);
    } catch (error) {
      console.log("Carta Porte: " + error)
    }
  }

  //todo: Funcion para crear y guardar el product de la carta porte
  const createProductCartaPorte = (idCP: number) => {
    let result_productos: any;
    //todo: Guardamos producto / servicio del cfdi
    productosServicios.forEach( async (producto) => {
      try {
        result_productos = await callEndpoint(createProductosCartaPorteService(idCP, producto));
        console.log(result_productos);
      } catch (error) {
        console.log(error);
      }
    });
    createAddressOrigin(idCP);
  }

  //todo: Funcion para crear y guardar los origenes de la carta porte
  const createAddressOrigin = (idCP: number) => {
    let result_origen : any;
    arrOrigenes.forEach( async (origen) => {
      try {
        result_origen = await callEndpoint(createOrigenCartaPorteService(idCP, origen));
        console.log(result_origen);
      } catch (error) {
        console.log(error);
      }
    });
    createAddressDestiny(idCP);
  }

  //todo: Funcion para crear y guardar los destinos de la carta porte
  const createAddressDestiny = (idCP: number) => {
    let result_destino : any;
    arrDestinos.forEach( async (destino) => {
      try {
        result_destino = await callEndpoint(createDestinoCartaPorteService(idCP, destino));
        console.log(result_destino);
      } catch (error) {
        console.log(error);
      }
    }); 
  }
  
  return (
      <Fragment>
        <DialogOrigenes open={openOrigenes} origenes={arrOrigenes} deleteOrigen={(position) => eliminarOrigen(position)} returnCloseDialog={(e) => viewOrigenes(e)} />
        <DialogDestinos open={openDestinos} destinos={arrDestinos} deleteDestino={(position) => eliminarDestino(position)} returnCloseDialog={(e) => viewDestinos(e)} />
        <DialogProductos open={openProductos} productos={productosServicios} deleteProducto={(position) => eliminarProducto(position)}  returnCloseDialog={(e) => viewProductos(e)}/>
        <div className="form-horizontal">
          <div className="form-body">
            <h4 className="card-title mt-5">Configuración general del CFDI</h4>
            <div className='row'>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectViaje}
                    options={catViajesActivos}
                    onChange={(_option, value) => setSelectViaje(value)}
                    getOptionLabel={(option) => option.folio_int_viaje.toString()}
                    isOptionEqualToValue={(option, value) => option.id_Viaje === value.id_Viaje}
                    renderInput={(params) => <TextField {...params} label="Selecciona tu viaje" variant="outlined" required />}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectTipoComprobante}
                    options={catTipoComprobante}
                    onChange={(_option, value) => setSelectTipoComprobante(value)}
                    getOptionLabel={(option) => option.c_TipoDeComprobante + " - " + option.st_TipoComprobante}
                    isOptionEqualToValue={(option, value) => option.id_TipoComprobante === value.id_TipoComprobante}
                    renderInput={(params) => <TextField {...params} label="Tipo Comprobante" variant="outlined" required />}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectClientes}
                    options={catClientes}   
                    onChange={(_option, value) => setSelectClientes(value)}
                    getOptionLabel={(option) => option.st_RazonSocial}
                    isOptionEqualToValue={(option, value) => option.id_Cliente === value.id_Cliente}
                    renderInput={(params) => <TextField {...params} label="Cliente Factura" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectMonedas}
                    options={catMonedas}
                    onChange={(_option, value) => setSelectMonedas(value)}
                    getOptionLabel={(option) => option.c_Moneda + " - " + option.st_Descripcion}
                    isOptionEqualToValue={(option, value) => option.id_Moneda === value.id_Moneda}
                    renderInput={(params) => <TextField {...params} label="Moneda" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectFormasPago}
                    options={catFormasPago}
                    onChange={(_option, value) => setSelectFormasPago(value)}
                    getOptionLabel={(option) => option.c_FormaPago + " - " + option.st_descripcion}
                    isOptionEqualToValue={(option, value) => option.id_FormaPago === value.id_FormaPago}
                    renderInput={(params) => <TextField {...params} label="Formas de Pago" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectMetodosPago}
                    options={catMetodosPago}
                    onChange={(_option, value) => setSelectMetodosPago(value)}
                    getOptionLabel={(option) => option.c_MetodoPago + " - " + option.st_Descripcion}
                    isOptionEqualToValue={(option, value) => option.id_MetodoPago === value.id_MetodoPago}
                    renderInput={(params) => <TextField {...params} label="Metodo de Pago" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectUsoCfdi}
                    options={catUsoCFDI}
                    onChange={(_option, value) => setSelectUsoCfdi(value)}
                    getOptionLabel={(option) => option.c_UsoCFDI + " - " + option.st_Descripcion}
                    isOptionEqualToValue={(option, value) => option.id_UsoCFDI === value.id_UsoCFDI}
                    renderInput={(params) => <TextField {...params} label="Uso CFDI" variant="outlined" required/>}
                  />
                </div>
              </div>
            </div>
            <h4 className="card-title mt-5">Producto / Servicio del CFDI</h4>
            <div className="row">
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectProdServicioCfdi}
                    options={catProdServicioCFDI}   
                    onChange={(_option, value) => setSelectProdServicioCfdi(value)}
                    getOptionLabel={(option) => option.c_ClaveProdServ + " - " + option.Descripcion}
                    isOptionEqualToValue={(option, value) => option.id_ClaveProdServCFDI === value.id_ClaveProdServCFDI}
                    renderInput={(params) => <TextField {...params} label="Producto Servicio" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField onBlur={CalcularBaseImpuestos} onChange={onChangeFormPoductoServicio} id='i_Cantidad' className="form-control" variant="outlined" label="Cantidad"  type="number" inputProps={{ autoComplete: "off", min: 1}} name="i_Cantidad" value={productCfdi.i_Cantidad || ''} required/>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectUnidadPesoCfdi}
                    options={catUnidadPesoCFDI}   
                    onChange={(_option, value) => setSelectUnidadPesoCfdi(value)}
                    getOptionLabel={(option) => option.c_ClaveUnidad + " - " + option.st_Nombre}
                    isOptionEqualToValue={(option, value) => option.id_ClaveUnidadPesoCFDI === value.id_ClaveUnidadPesoCFDI}
                    renderInput={(params) => <TextField {...params} label="Unidad Servicio" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField size='medium' fullWidth onChange={onChangeFormPoductoServicio} id='st_DescripcionConcepto' className="form-control" variant="outlined" label="Descripción"  type="text" inputProps={{ autoComplete: "off" }} name="st_DescripcionConcepto" value={productCfdi.st_DescripcionConcepto || ''} />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    value={selectObjetoImpuesto}
                    options={catObjetoImpuesto}
                    onChange={(_option, value) => setSelectObjetoImpuesto(value)}
                    getOptionLabel={(option) => option.c_ObjetoImp + " - " + option.st_descripcion}
                    isOptionEqualToValue={(option, value) => option.id_ObjetoImp === value.id_ObjetoImp}
                    renderInput={(params) => <TextField {...params} label="Objeto de impuesto" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField onBlur={CalcularBaseImpuestos} fullWidth onChange={onChangeFormPoductoServicio} id='dec_ValorUnitarioConcepto' className="form-control" variant="outlined" label="Valor Unitario"  type="number" 
                  inputProps={{ autoComplete: "off", inputMode: 'numeric', pattern: '[0-9]*' , min: 1 }} name="dec_ValorUnitarioConcepto" value={productCfdi.dec_ValorUnitarioConcepto || ''} required/>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField fullWidth  id='dec_ImporteConcepto'  name="dec_ImporteConcepto" className="form-control" variant="outlined" label="Importe"  type="number" inputProps={{ autoComplete: "off", inputMode: 'numeric', pattern: '[0-9]*' , min: 1, readOnly: true}} value={productCfdi.dec_ImporteConcepto || ''} required/>
                </div>
              </div>
            </div>
            { 
              /* VALIDAMOS EL TIPO DE COMPROBANTE SEA INGRESO  Y QUE SEA CON DESGLOSE DE OBJETO*/
              ( tipoComprobante === "Ingreso" && showImpuestos) ? (
                <div className="row">
                  <h4 className="card-title mt-5">Impuestos</h4>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="card-title mt-3">Impuestos Traslados</h5>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <TextField id='dec_BaseTraslado' onChange={CalcularImporteTrasladoAfterImpuestos} className="form-control" variant="outlined" label="Base Traslado"  type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' , autoComplete: "off", min: 1, readOnly: true }} name="dec_BaseTraslado" value={productCfdi.dec_BaseTraslado || ''} required />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Autocomplete
                          value={selectTipoImpuestosTraslado}
                          options={catTipoImpuestos}   
                          onChange={(_option, value) => setSelectTipoImpuestosTraslado(value)}
                          getOptionLabel={(option) => option.c_Impuesto + " - " + option.st_Descripcion}
                          isOptionEqualToValue={(option, value) => option.id_Impuesto === value.id_Impuesto}
                          renderInput={(params) => <TextField {...params} label="Impuesto aplicado" variant="outlined" required/>}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Autocomplete
                          value={selectTipoFactorTraslado}
                          options={catTipoFactor}   
                          onChange={(_option, value) => setSelectTipoFactorTraslado(value)}
                          getOptionLabel={(option) => option.c_TipoFactor}
                          isOptionEqualToValue={(option, value) => option.id_TipoFactor === value.id_TipoFactor}
                          renderInput={(params) => <TextField {...params} label="Tipo de factor" variant="outlined" required/>}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Autocomplete
                          value={selectTasaCuotaTraslado}
                          options={catTasaCuota}   
                          onChange={(_option, value) => setSelectTasaCuotaTraslado(value)}
                          getOptionLabel={(option) => option.c_TasaCuota}
                          isOptionEqualToValue={(option, value) => option.id_TasaCuotaJson === value.id_TasaCuotaJson}
                          renderInput={(params) => <TextField {...params} label="Tasa Cuota (%)" variant="outlined" required/>}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <TextField className="form-control" onChange={CalcularImporteRetencionAfterImpuestos} label="Importe" id="dec_ImporteTraslado" name="dec_ImporteTraslado" type="text" value={productCfdi.dec_ImporteTraslado || ''} variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} required/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="card-title mt-3">Impuestos Retención</h5>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <TextField id='dec_BaseRetencion' className="form-control" variant="outlined" label="Base Retención"  type="number" inputProps={{ autoComplete: "off", min: 1, readOnly: true}} name="dec_BaseRetencion" value={productCfdi.dec_BaseRetencion || ''} required/>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Autocomplete
                          value={selectTipoImpuestosRetencion}
                          options={catTipoImpuestos}   
                          onChange={(_option, value) => setSelectTipoImpuestosRetencion(value)}
                          getOptionLabel={(option) => option.c_Impuesto + " - " + option.st_Descripcion}
                          isOptionEqualToValue={(option, value) => option.id_Impuesto === value.id_Impuesto}
                          renderInput={(params) => <TextField {...params} label="Impuesto aplicado" variant="outlined" required/>}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Autocomplete
                          value={selectTipoFactorRetencion}
                          options={catTipoFactor}   
                          onChange={(_option, value) => setSelectTipoFactorRetencion(value)}
                          getOptionLabel={(option) => option.c_TipoFactor}
                          isOptionEqualToValue={(option, value) => option.id_TipoFactor === value.id_TipoFactor}
                          renderInput={(params) => <TextField {...params} label="Tipo de factor" variant="outlined" required/>}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <Autocomplete
                          value={selectTasaCuotaRetencion}
                          options={catTasaCuota}   
                          onChange={(_option, value) => setSelectTasaCuotaRetencion(value)}
                          getOptionLabel={(option) => option.c_TasaCuota}
                          isOptionEqualToValue={(option, value) => option.id_TasaCuotaJson === value.id_TasaCuotaJson}
                          renderInput={(params) => <TextField {...params} label="Tasa Cuota(%)" variant="outlined" required/>}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <TextField className="form-control" label="Importe" id="dec_ImporteRetencion" name="dec_ImporteRetencion" type="text" value={productCfdi.dec_ImporteRetencion || ''} variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} required/>
                      </div>
                    </div>
                  </div>
                </div>
              ) : void(0)
            }
            {/* ORIGENES */}
            <DirOrigenForm retornaOrigen={(e) => guardarOrigen(e)} retornaVerOrigenes={(e) => viewOrigenes(e)} />
            {/* DESTINOS */}
            <DirDestinoForm retornaDestino={(e) => guardarDestino(e)} retornaVerDestinos={(e) => viewDestinos(e)} />
            {/* PRODUCTOS Y BIENES TRANSPORTADOS */}
            <ProductoServicioForm retornaProducto={(e) => guardarProductosServicios(e)} retornaVerProductos={(e) => viewProductos(e)} />
          </div>
          <div className="col-12 text-end">
            <Button variant='contained' color='success' size='medium' type="button" onClick={createCfdi}>Generar carta porte</Button>
          </div>
        </div>
      </Fragment>
  )
}
export default CartaPorteForm;

{/* <DynamicList open={open} items={ () => arrOrigenes} itemComponent={
            (data, index) => (
              <div className="table-responsive">
                <table className='table color-table dark-table'>
                  <thead>
                    <tr>
                      <th>Nombre Remitente</th>
                      <th>RFC</th>
                      <th>Calle</th>
                      <th>CP</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data?.st_RemitenteNombre}</td>
                      <td>{data?.st_RemitenteRFC}</td>
                      <td>{data?.st_Calle}</td>
                      <td>{data?.c_codigoPostal}</td>
                      <td><Button variant='contained' onClick={() => deleteOrigen(data.)} startIcon={<VisibilityIcon />} size='small'>Ver Origenes</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>  
            )
          }  returnCloseDialog={(close) => setOpen(close)}/> */}