import { ChangeEvent, Fragment, useEffect, useState, ReactNode } from 'react'
import { ICatMoneda, ICfdiForm, IFormasPago, IMetodosPago, IObjetoImpuesto, IProdServicioCFDI, IProducServicioCfdiForm, ITasaCuota, ITipoComprobante, ITipoFactor, ITipoImpuestos, IUnidadPesoCFDI, IUsoCFDI } from '../../../models/cfdis/cfdi-form.model';
import { getCatTipoMonedas, getCatFormaPago, getCatMetodosPago, getCatProdServicioCFDI, getCatUnidadPesoCFDI, getCatUsoCFDI, getCatTipoImpuestos, getCatObjetoImpuesto, getCatTipoFactor, createCfdiGeneral, createServicesCfdi, createXmlCfdi } from '../../../services/cfdi/cfdi.service';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { ICliente } from '../../../models/clientes/cliente.model';
import { getClientesEmpresa } from '../../../services/clientes/clientes.service';
import { Autocomplete, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import DialogShared from '../../../components/shared/DialogShared';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { getViajesActivos } from '../../../services/public.service';
import { IViajesActivos } from '../../../models/viajes/viaje.model';

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

const ProductoServicioCfdiEmpty: IProducServicioCfdiForm = {
  id_CFDI: null, id_ClaveProdServCFDI: null, i_Cantidad: 1, id_ClaveUnidadPesoCFDI: null, st_DescripcionConcepto: null, dec_ValorUnitarioConcepto: null, dec_ImporteConcepto: null, dec_Descuento: null, id_ObjetoImp: null, dec_BaseTraslado: null, dec_BaseRetencion: null, id_ImpuestoTraslado: null, id_ImpuestoRetencion: null, dec_ImporteTraslado: null, dec_ImporteRetencion: null, id_TipoFactorTraslado: null, id_TipoFactorRetencion: null, dec_TasaOCuotaTraslado: null, dec_TasaOCuotaRetencion: null
};

type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

function FacturaForm() {
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;

  const [open, setOpen] = useState<boolean>(false);

  // todo: Arreglo para Producto servicio CFDI
  const [ arrServicioCfdi, setArrServicioCfdi] = useState<IProducServicioCfdiForm[]>([]);

  //todo _variables globales
  const [cfdiForm, setCfdiForm] = useState<ICfdiForm>({ id_Empresa : id_Empresa, id_Moneda : null, id_FormaPago : null, id_MetodoPago: null, id_UsoCFDI : null, id_TipoComprobante : null, id_Viaje : null, id_Cliente : null, dec_SubTotal: null, dec_Total: null, st_CondicionesPago: null });

  //string global para tipo de comprobante
  const [tipoComprobante, setTipoComprobante] = useState<string>("");
  const [productoServicioCfdi, setProductoServicioCfdi] = useState<IProducServicioCfdiForm>(ProductoServicioCfdiEmpty);
  const [showImpuestos, setShowImpuestos] = useState<boolean>(false);

  //todo: catalogos para Formulario
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
  const [selectTasaCuotaRetencion, setSelectTasaCuotaRetencion] = useState<ITasaCuota | null>(null);

  //todo: Custom Hooks
  const { callEndpoint } = useFetchAndLoad();
  
  // todo: FUNCION INICIAL PARA CARGAR SERVICIOS PARA LOS AUTOCOMPLETE'S
  useEffect(() => {
    const loadClientes = getClientesEmpresa(id_Empresa);
    const loadMonedas = getCatTipoMonedas();
    const loadFormasPago = getCatFormaPago();
    const loadMetodosPago = getCatMetodosPago();
    const loadProdServicioCfdi = getCatProdServicioCFDI();
    const loadUnidadPesoCfdi = getCatUnidadPesoCFDI();
    const loadUsoCfdi = getCatUsoCFDI();
    const loadTipoImpuestos = getCatTipoImpuestos();
    const loadObjetoImpuesto = getCatObjetoImpuesto();
    const loadTipoFactor = getCatTipoFactor();
    const loadViajesActivos = getViajesActivos(id_Empresa);

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

    const _getClientes = () => {
      loadClientes.call
      .then((resp) => {
        let response = resp.data;
        setCatClientes( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getMonedas = () => {
      loadMonedas.call
      .then((resp) => {
        let response = resp.data;
        setCatMonedas( response.data );
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
      loadUnidadPesoCfdi.call
      .then((resp) => {
        let response = resp.data;
        setCatUnidadPesoCFDI( response.data );
      }).catch((error: any) => {
        console.log(error);
      });
    }

    const _getUsoCfdi = () => {
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

    //todo: llamamos a los servicios de catálogos
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

  /* =================== FUNCIONES EFFECT PARA CATALOGOS DE LOS SELECT =====================*/

  //todo: funcion para select cat - viajes activos
  useEffect(() => {
    setCfdiForm({ ...cfdiForm, id_Viaje: (selectViaje !== null) ? selectViaje.id_Viaje : null });
  },[selectViaje]);

  //todo: Effect para select cat - clientes
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_Cliente: (selectClientes !== null) ? selectClientes.id_Cliente : null});
  },[selectClientes]);

  //todo: Effect para select cat - Monedas
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_Moneda: (selectMonedas !== null) ? selectMonedas.id_Moneda : null});
  },[selectMonedas]);

  useEffect(() => {
    setCfdiForm({...cfdiForm, id_UsoCFDI: (selectUsoCfdi) !== null ? selectUsoCfdi.id_UsoCFDI : null});
  },[selectUsoCfdi]);

  //todo: Effect para select cat - Tipo Comprobante
  useEffect(() => {
    //* seteamos el tipo de comprobante en la variable del formulario
    setCfdiForm({...cfdiForm, id_TipoComprobante: (selectTipoComprobante !== null) ? selectTipoComprobante.id_TipoComprobante : null});

    // *  hacemos set del tipoComprobante para validaciones
    let stringTipoComprobante = (selectTipoComprobante !== null) ? selectTipoComprobante.st_TipoComprobante : "";
    setTipoComprobante( stringTipoComprobante );
  },[selectTipoComprobante]);

  //todo:Effect para select cat - Formas de pago
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_FormaPago: (selectFormasPago !== null) ? selectFormasPago.id_FormaPago : null});
  },[selectFormasPago]);

  //todo:Effect para select cat - Metodos de pago
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_MetodoPago: (selectMetodosPago !== null) ? selectMetodosPago.id_MetodoPago : null});
  },[selectMetodosPago]);

  //todo: Effect para que se ejecuta cada vez que cambiemos de tipo de comprobante
  useEffect(() => {
    // //todo: Validación si es comprobante es "Traslado" o "Pago" el subtotal y total lo ponemos en 0
    if(selectTipoComprobante !== null && ( 
      selectTipoComprobante.st_TipoComprobante === "Traslado" || selectTipoComprobante.st_TipoComprobante === "Pago") ){
        setCfdiForm({...cfdiForm, dec_SubTotal: 0, dec_Total: 0});
    } else setCfdiForm({...cfdiForm, dec_SubTotal: null, dec_Total: null});
  },[cfdiForm.id_TipoComprobante]);

  /* ========================= SECCIÓN DE PRODUCTO SERVICIO CFDI ================================ */

  //todo: Funcion para editar formulario seccion de producto / servicio cfdi
  const onChangeFormPoductoServicio = ({ target: { name, value } }: handleChangeForm) => setProductoServicioCfdi({...productoServicioCfdi, [name]: value});

  //todo: Effect para select cat - productoServicio CFDI
  useEffect(()=>{
    setProductoServicioCfdi({...productoServicioCfdi, id_ClaveProdServCFDI: (selectProdServicioCfdi !== null) ? selectProdServicioCfdi.id_ClaveProdServCFDI : null });
  },[selectProdServicioCfdi]);

  //todo: Effect para select cat - productoServicio CFDI
  useEffect(()=>{
    setProductoServicioCfdi({...productoServicioCfdi, id_ClaveUnidadPesoCFDI: (selectUnidadPesoCfdi !== null) ? selectUnidadPesoCfdi.id_ClaveUnidadPesoCFDI : null });
  },[selectUnidadPesoCfdi]);

  //todo: Effect para select cat- Objeto de impuesto
  useEffect(()=> {
    if(selectObjetoImpuesto?.c_ObjetoImp === "02") {setShowImpuestos(true);}
    setProductoServicioCfdi({...productoServicioCfdi, id_ObjetoImp: (selectObjetoImpuesto !== null) ? selectObjetoImpuesto.id_ObjetoImp : null});
  },[selectObjetoImpuesto]);

  //todo:Effect para calcular el importe si cambian los campos: valor Unitario, descuento, cantidad
  useEffect(()=> {
    let importe: number = ImporteCalculate();
    setProductoServicioCfdi({...productoServicioCfdi, 
      dec_ImporteConcepto: importe,
      dec_BaseTraslado: importe, 
      dec_BaseRetencion: importe
    });
  }, [productoServicioCfdi.dec_ValorUnitarioConcepto, productoServicioCfdi.dec_Descuento, productoServicioCfdi.i_Cantidad]);

  //todo: Funcion para calcular el importe del producto / servicio cfdi
  const ImporteCalculate = (): number => {
    //todo: importe antes de descuento
    let importe: number = 0;
    //todo: importe si se aplica descuento sino toma el valor del importe normal
    let importeWithDescuento: number = 0;
    if(productoServicioCfdi.dec_ValorUnitarioConcepto !== null && productoServicioCfdi.i_Cantidad !== null ){
      importe = + (productoServicioCfdi.dec_ValorUnitarioConcepto * productoServicioCfdi.i_Cantidad).toFixed(3);
      importeWithDescuento = (productoServicioCfdi.dec_Descuento !== null ) 
      ? (importe - productoServicioCfdi.dec_Descuento)
      : importe;
    }
    return importeWithDescuento;
  }

  /* ======================================== IMPUESTOS TRASLADOS ================================================ */
  //todo:Effect para select cat - Tipo Impuesto traslado
  useEffect(() => {
    setProductoServicioCfdi({...productoServicioCfdi, id_ImpuestoTraslado: (selectTipoImpuestosTraslado !== null) ? selectTipoImpuestosTraslado.id_Impuesto : null});
  },[selectTipoImpuestosTraslado]);

  //todo:Effect para select cat - Tipo Factor Traslado
  useEffect(() => {
    setProductoServicioCfdi({...productoServicioCfdi, id_TipoFactorTraslado: (selectTipoFactorTraslado !== null) ? selectTipoFactorTraslado.id_TipoFactor : null});
  },[selectTipoFactorTraslado]);

  //todo: Effect para select Tasa Cuota Traslado
  useEffect(() => {
    setProductoServicioCfdi({...productoServicioCfdi, dec_TasaOCuotaTraslado: (selectTasaCuotaTraslado !== null) ? selectTasaCuotaTraslado.dec_ValorAplica : null });
  },[selectTasaCuotaTraslado]);

  //todo: Calculado el impuesto de Traslado respecto: Base, tasa Cuota
  useEffect( () => {
    let impuestoTraslado : number = calculateTrasladoImporte();
    setProductoServicioCfdi({...productoServicioCfdi, dec_ImporteTraslado: impuestoTraslado});
  },[productoServicioCfdi.dec_BaseTraslado, productoServicioCfdi.dec_TasaOCuotaTraslado]);

  const calculateTrasladoImporte = (): number => {
    let impuesto: number = 0;
    if(productoServicioCfdi.dec_BaseTraslado !== null && productoServicioCfdi.dec_TasaOCuotaTraslado !== null){
      impuesto = +(productoServicioCfdi.dec_BaseTraslado * productoServicioCfdi.dec_TasaOCuotaTraslado).toFixed(3);
    }
    return impuesto;
  }
  /* ======================================== IMPUESTOS RETENCIÓN ================================================ */
  //todo:Effect para select cat - Tipo Impuesto retencion
  useEffect(() => {
    setProductoServicioCfdi({...productoServicioCfdi, id_ImpuestoRetencion: (selectTipoImpuestosRetencion !== null) ? selectTipoImpuestosRetencion.id_Impuesto : null});
  },[selectTipoImpuestosRetencion]);

  //todo:Effect para select cat - Tipo Factor retencion
  useEffect(() => {
    setProductoServicioCfdi({...productoServicioCfdi, id_TipoFactorRetencion: (selectTipoFactorRetencion !== null) ? selectTipoFactorRetencion.id_TipoFactor : null});
  },[selectTipoFactorRetencion]);

  //todo: Effect para select Tasa Cuota retencion
  useEffect(() => {
    setProductoServicioCfdi({...productoServicioCfdi, dec_TasaOCuotaRetencion: (selectTasaCuotaRetencion !== null) ? selectTasaCuotaRetencion.dec_ValorAplica : null });
  },[selectTasaCuotaRetencion]);

  //todo: Calculado el impuesto de Retención respecto: base, Tasa Cuota
  useEffect( () => {
    let impuestoRetencion: number = calculateRetencionImporte();
    setProductoServicioCfdi({...productoServicioCfdi, dec_ImporteRetencion: impuestoRetencion});
  },[productoServicioCfdi.dec_BaseRetencion, productoServicioCfdi.dec_TasaOCuotaRetencion]);

  const calculateRetencionImporte = (): number => {
    let impuesto: number = 0;
    if(productoServicioCfdi.dec_BaseRetencion !== null && productoServicioCfdi.dec_TasaOCuotaRetencion !== null){
      impuesto = +(productoServicioCfdi.dec_BaseRetencion * productoServicioCfdi.dec_TasaOCuotaRetencion).toFixed(3);
    }
    return impuesto;
  }

  //todo: Funcion para validar que el importe no sea 0 y negativo
  useEffect(()=> {
    if( productoServicioCfdi?.dec_ImporteConcepto!== null && productoServicioCfdi?.dec_ImporteConcepto <= 0){
      cleanFieldNumber();
      Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'El importe no puede ser un número negativo, verifica la cantidad, y el valor unitario del servicio de la factura', showConfirmButton: true });
    }
  },[productoServicioCfdi.dec_ImporteConcepto]);

  //todo: Función para limpiar campos de traslados, retención y descuento por error de numeros negativos
  const cleanFieldNumber = () => {
    // * limpamos el select de tasaCuota Traslado
    setSelectTasaCuotaTraslado(null);
    // * limpamos el select de tasaCuota Retencion
    setSelectTasaCuotaRetencion(null);
    // * limpamos los campos, valor unitario, descuento, importe conepto
    setProductoServicioCfdi({...productoServicioCfdi, 
      dec_BaseTraslado: null, 
      dec_BaseRetencion: null, 
      id_ImpuestoTraslado: null, 
      id_ImpuestoRetencion: null, 
      dec_ImporteTraslado: null, 
      dec_ImporteRetencion: null, 
      dec_TasaOCuotaTraslado: null, 
      dec_TasaOCuotaRetencion: null, 
      dec_Descuento: null,
      dec_ImporteConcepto: null,
      dec_ValorUnitarioConcepto: null
    });
  }

  //todo: Funcion que limpia todos los <AutoComplete />
  const cleanSelectCat = () => {
    setSelectProdServicioCfdi(null);
    setSelectUnidadPesoCfdi(null);
    setSelectObjetoImpuesto(null);
    setSelectTipoImpuestosTraslado(null);
    setSelectTipoFactorTraslado(null);
    setSelectTasaCuotaTraslado(null);
    setSelectTipoImpuestosRetencion(null);
    setSelectTipoFactorRetencion(null);
    setSelectTasaCuotaRetencion(null);
  }

  /* =================================================== SUBMIT ==================================================== */

  const addServiceCfdi = () => {
    setArrServicioCfdi([...arrServicioCfdi, productoServicioCfdi]);
    setProductoServicioCfdi(ProductoServicioCfdiEmpty);
    cleanSelectCat();
  }

  const calculateSubAndTotal = () => {
    let retenciones: number = 0;
    let traslados: number = 0;
    let importesBeforeTaxes: number = 0;

    // iteramos los productos/servicios de la factura
    arrServicioCfdi.forEach(element => {
      retenciones += (element.dec_ImporteRetencion !== null) ? +(element.dec_ImporteRetencion.toFixed(2)) :  0;
      traslados += (element.dec_ImporteTraslado !== null) ? +(element.dec_ImporteTraslado.toFixed(2)) :  0;
      importesBeforeTaxes += (element.dec_ImporteConcepto !== null) ? +(element.dec_ImporteConcepto.toFixed(2)) :  0;
    });

    //todo: Variables para 
    let subTotal: number;
    let total: number;

    //Actualizamos total subtotal
    if(cfdiForm.dec_SubTotal !== null && cfdiForm.dec_Total !== null){
      subTotal = cfdiForm.dec_SubTotal + importesBeforeTaxes;
      total = cfdiForm.dec_Total + ((subTotal + traslados) - retenciones);
    }else{
      subTotal = importesBeforeTaxes;
      total = (subTotal + traslados) - retenciones;
    }
  
    // Actualizamos subtotal y total
    setCfdiForm({...cfdiForm, dec_SubTotal: subTotal, dec_Total: total});
  }

  const generateCFDI = async() => {
    try {
      //todo: creamos el cfdi general
      let result = await callEndpoint(createCfdiGeneral(cfdiForm));
      console.log(result.data);

      //guardamos temporalmente el id_Cfdi
      let idCfdi = result.data.data.id_CFDI.toString();
      console.log(idCfdi);

      //todo: Guardamos producto / servicio del cfdi
      arrServicioCfdi.forEach( async (element) => {
        await callEndpoint(createServicesCfdi(idCfdi, element));
      });

      //todo: Generamos el XML
      let xml = await callEndpoint(createXmlCfdi(idCfdi));
      console.log(xml);
    } catch (error) {
      console.log(error);
    }
  }

  //todo: generamod el CFDI general
  useEffect(() => {
    if(cfdiForm.dec_Total !== null && cfdiForm.dec_SubTotal !== null){
      generateCFDI();
    }
  },[cfdiForm.dec_Total, cfdiForm.dec_SubTotal]);
  
  return (
    <Fragment>
      <DialogShared open={open} children={<ProductosFacturasView productos={arrServicioCfdi} />} returnCloseDialog={ (e) => setOpen(e)} />
      <form className='form-horizontal'>
        <div className='form-body'>
          <h4 className="card-title">Información General de la Factura</h4>
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
        </div>
        <div className='borderForm'>
          <div className="form-body">
            <h4 className="card-title">Producto servicio de la Factura</h4>
            <Button className='mb-4' onClick={() => setOpen(true)} variant='contained' color='primary' size='medium' type="button">Ver lista de servicios</Button> 
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
                  <TextField onChange={onChangeFormPoductoServicio} id='i_Cantidad' className="form-control" variant="outlined" label="Cantidad"  type="number" inputProps={{ inputMode: 'numeric', autoComplete: "off", min: 1}} name="i_Cantidad" value={productoServicioCfdi.i_Cantidad || ''} required/>
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
                    renderInput={(params) => <TextField {...params} label="Unidad Peso" variant="outlined" required/>}
                  />
                </div>
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField size='medium' fullWidth onChange={onChangeFormPoductoServicio} id='st_DescripcionConcepto' className="form-control" variant="outlined" label="Descripción"  type="text" inputProps={{ autoComplete: "off" }} name="st_DescripcionConcepto" value={productoServicioCfdi.st_DescripcionConcepto || ''} />
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
                  <TextField fullWidth onChange={onChangeFormPoductoServicio} id='dec_ValorUnitarioConcepto' className="form-control" variant="outlined" label="Valor Unitario"  type="number" 
                  inputProps={{ autoComplete: "off", inputMode: 'numeric', pattern: '[0-9]*' , min: 1 }} name="dec_ValorUnitarioConcepto" value={productoServicioCfdi.dec_ValorUnitarioConcepto || ''} required/>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField fullWidth onChange={onChangeFormPoductoServicio} id='dec_Descuento' className="form-control" variant="outlined" label="Descuento"  type="number" inputProps={{ autoComplete: "off", inputMode: 'numeric', pattern: '[0-9]*' , min: 1}} name="dec_Descuento" value={productoServicioCfdi.dec_Descuento || ''}/>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField fullWidth  id='dec_ImporteConcepto'  name="dec_ImporteConcepto" className="form-control" variant="outlined" label="Importe"  type="number" inputProps={{ autoComplete: "off", inputMode: 'numeric', pattern: '[0-9]*' , min: 1, readOnly: true}} value={productoServicioCfdi.dec_ImporteConcepto || ''} required/>
                </div>
              </div>
            </div>
          </div>
          {
            (tipoComprobante === "Ingreso" || tipoComprobante === "Egreso") && showImpuestos ? (
              <div className="form-body">
                <h4 className="card-title mt-5">Impuestos</h4>
                <div className="row">
                  <div className="col-12">
                    <h5 className="card-title mt-3">Impuestos Traslados</h5>
                  </div>
                  <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                      <TextField id='dec_BaseTraslado' className="form-control" variant="outlined" label="Base Traslado"  type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' , autoComplete: "off", min: 1, readOnly: true }} name="dec_BaseTraslado" value={productoServicioCfdi.dec_BaseTraslado || ''} required />
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
                      <TextField className="form-control" label="Importe" id="dec_ImporteTraslado" name="dec_ImporteTraslado" type="text" value={productoServicioCfdi.dec_ImporteTraslado || ''} variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} required/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h5 className="card-title mt-3">Impuestos Retención</h5>
                  </div>
                  <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                      <TextField id='dec_BaseRetencion' className="form-control" variant="outlined" label="Base Retención"  type="number" inputProps={{ autoComplete: "off", min: 1, readOnly: true}} name="dec_BaseRetencion" value={productoServicioCfdi.dec_BaseRetencion || ''} required/>
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
                      <TextField className="form-control" label="Importe" id="dec_ImporteRetencion" name="dec_ImporteRetencion" type="text" value={productoServicioCfdi.dec_ImporteRetencion || ''} variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} required/>
                    </div>
                  </div>
                </div>
              </div>
            ) : void(0)
          }
          <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <Button onClick={addServiceCfdi} variant='contained' color='success' size='medium' type="button"> <i className="fa fa-plus"></i>Agregar Servicio Cfdi</Button>              
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-5">
            {
              arrServicioCfdi.length > 0 ? (
                <Button onClick={calculateSubAndTotal} variant='contained' color='success' size='medium' type="button"> <i className="fa fa-save">  </i> Crear Factura</Button>                  
              ): void(0)
            }
          </div>
        </div>
      </form>
    </Fragment>
  )
}
export default FacturaForm;

/* =============================== View para producto y servicio CFDI ======================= */
interface ProductosProps {
  productos: IProducServicioCfdiForm[];
}

export const ProductosFacturasView = ({ productos }: ProductosProps): ReactNode => {

  const returnIdDelete = (position: number) => {
    console.log(position);
  }
  return (
    <div className="table-responsive">
      <table className='table color-table dark-table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Id Producto Servicio</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Deescripción</th>
            <th>Acc</th>
          </tr>
        </thead>
        <tbody>
          {
            productos.map( (item, index) => (
              <tr>
                <td>{++index}</td>
                <td>{item.id_ClaveProdServCFDI}</td>
                <td>{item.i_Cantidad}</td>
                <td>{item.dec_ValorUnitarioConcepto}</td>
                <td>{item.st_DescripcionConcepto}</td>
                <td><Button onClick={() => returnIdDelete(index)}  variant='contained' color='error' size='medium' type="button"> Borrar Producto</Button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
