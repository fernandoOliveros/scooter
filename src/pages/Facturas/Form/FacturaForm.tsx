import { ChangeEvent, useEffect, useState } from 'react'
import { ICatMoneda, ICfdiForm, IFormasPago, IMetodosPago, IObjetoImpuesto, IProdServicioCFDI, IRegFiscal, ITasaCuota, ITipoComprobante, ITipoFactor, ITipoImpuestos, IUnidadPesoCFDI, IUsoCFDI } from '../../../models/cfdis/cfdi-form.model';
import config from '../../../utils/config-cfdi.json';
import { getCatTipoMonedas, getCatRegimenFiscal, getCatFormaPago, getCatMetodosPago, getCatProdServicioCFDI, getCatUnidadPesoCFDI, getCatUsoCFDI, getCatTipoImpuestos, getCatObjetoImpuesto, getCatTipoFactor } from '../../../services/cfdi/cfdi.service';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { ICliente } from '../../../models/clientes/cliente.model';
import { getClientes } from '../../../services/clientes/clientes.service';
import { Autocomplete, TextField } from '@mui/material';

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

type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

function FacturaForm() {
  //todo: Validaciones
  const validates = config.Comprobante;
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;

  //todo _variables globales
  const [cfdiForm, setCfdiForm] = useState<ICfdiForm>({ id_Empresa : id_Empresa, id_Moneda : null, id_FormaPago : null, id_MetodoPago: null, id_ClaveProdServCFDI : null, id_ClaveUnidadPeso : null, id_UsoCFDI : null, id_TipoComprobante : null, id_Viaje : null, id_Cliente : null, id_TipoViaje : null, st_nombreCrudoXML: '', dec_SubTotal: null, dec_Total: null, dec_BaseTraslado: null, dec_BaseRetencion: null, id_ObjetoImp: null, c_ImpuestoTraslado: null, c_ImpuestoRetencion: null, dec_ImporteTraslado: null, dec_ImporteRetencion: null, st_TipoFactorTraslado: null, st_TipoFactorRetencion: null, dec_TasaOCuotaTraslado: null, dec_TasaOCuotaRetencion: null, st_RFC_emisor: null, st_RFC_receptor: null });

  const [tipoComprobante, setTipoComprobante] = useState<string>("");

  //todo: catalogos para Formulario
  const [catClientes, setCatClientes] = useState<ICliente[]>([]);
  const [catMonedas, setCatMonedas] = useState<ICatMoneda[]>([]);
  const [catRegFiscal, setCatRegFiscal] = useState<IRegFiscal[]>([]);
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
  const [selectClientes, setSelectClientes] = useState< ICliente | null>(null);
  const [selectMonedas, setSelectMonedas] = useState< ICatMoneda | null>(null);
  const [selectRegFiscal, setSelectRegFiscal] = useState< IRegFiscal | null>(null);
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


  const onChangeCfdiForm = ({ target: { name, value } }: handleChangeForm) => {
    setCfdiForm({...cfdiForm, [name]: value});
  }

  // ! Función inicial
  useEffect(() => {
    // ? Services
    const loadClientes = getClientes(id_Empresa);
    const loadMonedas = getCatTipoMonedas();
    const loadRegFiscal = getCatRegimenFiscal();
    const loadFormasPago = getCatFormaPago();
    const loadMetodosPago = getCatMetodosPago();
    const loadProdServicioCfdi = getCatProdServicioCFDI();
    const loadUnidadPesoCfdi = getCatUnidadPesoCFDI();
    const loadUsoCfdi = getCatUsoCFDI();
    const loadTipoImpuestos = getCatTipoImpuestos();
    const loadObjetoImpuesto = getCatObjetoImpuesto();
    const loadTipoFactor = getCatTipoFactor();

    const _getClientes =  async() => {
      let result = await loadClientes.call;
      if(result.data.success){
        let response = result.data;
        setCatClientes( response.data );
      }
    }

    const _getMonedas = async() => {
      let result = await loadMonedas.call;
      if(result.data.success){
        let response = result.data;
        setCatMonedas( response.data );
      }
    }

    const _getRegFiscal = async() => {
      let result = await loadRegFiscal.call;
      if(result.data.success){
        let response = result.data;
        setCatRegFiscal( response.data );
      }
    }

    const _getFormasPago = async() => {
      let result = await loadFormasPago.call;
      if(result.data.success){
        let response = result.data;
        setCatFormasPago( response.data );
      }
    }

    const _getMetodosPago = async() => {
      let result = await loadMetodosPago.call;
      if(result.data.success){
        let response = result.data;
        setCatMetodosPago( response.data );
      }
    }

    const _getProdServiciosCfdi = async() => {
      let result = await loadProdServicioCfdi.call;
      if(result.data.success){
        let response = result.data;
        setCatProdServicioCFDI( response.data );
      }
    }

    const _getUnidadPesoCfdi = async() => {
      let result = await loadUnidadPesoCfdi.call;
      if(result.data.success){
        let response = result.data;
        setCatUnidadPesoCFDI( response.data );
      }
    }

    const _getUsoCfdi = async() => {
      let result = await loadUsoCfdi.call;
      if(result.data.success){
        let response = result.data;
        setCatUsoCFDI( response.data );
      }
    }

    const _getTipoComprobante = () => {
      setCatTipoComprobante(ITipoComprobanteArray);
    }

    const _getTipoImpuestos = async() => {
      let result = await loadTipoImpuestos.call;
      if(result.data.success){
        let response = result.data;
        setCatTipoImpuestos( response.data );
      }
    }

    const _getObjetoImpuesto = async() => {
      let result = await loadObjetoImpuesto.call;
      if(result.data.success){
        let response = result.data;
        setCatObjetoImpuesto( response.data );
      }
    }

    const _getTipoFactor = async() => {
      let result = await loadTipoFactor.call;
      if(result.data.success){
        let response = result.data;
        setCatTipoFactor( response.data );
      }
    }

    const _getTasaCuota = () => {
      setCatTasaCuota(catTasaCuotaJson);
    }

    //todo: llamamos a los servicios de catálogos
    _getClientes();
    _getMonedas();
    _getRegFiscal();
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

  //todo: Effect para select cat - clientes
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_Cliente: (selectClientes !== null) ? selectClientes.id_Cliente : null});
  },[selectClientes]);

  //todo: Effect para select cat - Monedas
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_Moneda: (selectMonedas !== null) ? selectMonedas.id_Moneda : null});
  },[selectMonedas]);

  //todo: Effect para select cat - Tipo Comprobante
  useEffect(() => {
    //* seteamos el tipo de comprobante en la variable del formulario
    setCfdiForm({...cfdiForm, id_TipoComprobante: (selectTipoComprobante !== null) ? selectTipoComprobante.id_TipoComprobante : null});

    // *  hacemos set del tipoComprobante para validaciones
    let dev = (selectTipoComprobante !== null) ? selectTipoComprobante?.st_TipoComprobante : "";
    setTipoComprobante( dev );
  },[selectTipoComprobante]);

  //todo: Effect para que se ejecuta cada vez que cambiemos de tipo de comprobante
  useEffect(() => {
    // //todo: Validación si es comprobante es "Traslado" o "Pago" el subtotal y total lo ponemos en 0
    if(selectTipoComprobante !== null && ( 
      selectTipoComprobante.st_TipoComprobante === "Traslado" || selectTipoComprobante.st_TipoComprobante === "Pago") ){
       setCfdiForm({...cfdiForm, dec_SubTotal: 0, dec_Total: 0});
    }else{
     setCfdiForm({...cfdiForm, dec_SubTotal: null, dec_Total: null});
    }
  },[cfdiForm.id_TipoComprobante]);

  //todo:Effect para select cat - Formas de pago
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_FormaPago: (selectFormasPago !== null) ? selectFormasPago.id_FormaPago : null});
  },[selectFormasPago]);

  //todo:Effect para select cat - Metodos de pago
  useEffect(() => {
    setCfdiForm({...cfdiForm, id_MetodoPago: (selectMetodosPago !== null) ? selectMetodosPago.id_MetodoPago : null});
  },[selectMetodosPago]);

  /* ================== AREA DE SELECT DE IMPUESTOS TRASLADOS =========================== */

  //todo:Effect para select cat - Tipo Impuesto traslado
  useEffect(() => {
    setCfdiForm({...cfdiForm, c_ImpuestoTraslado: (selectTipoImpuestosTraslado !== null) ? selectTipoImpuestosTraslado.c_Impuesto : null});
  },[selectTipoImpuestosTraslado]);

  //todo:Effect para select cat - Tipo Factor Traslado
  useEffect(() => {
    setCfdiForm({...cfdiForm, st_TipoFactorTraslado: (selectTipoFactorTraslado !== null) ? selectTipoFactorTraslado.c_TipoFactor : null});
  },[selectTipoFactorTraslado]);

  //todo: Effect para select Tasa Cuota Traslado
  useEffect(() => {
    setCfdiForm({...cfdiForm, dec_TasaOCuotaTraslado: (selectTasaCuotaTraslado !== null) ? selectTasaCuotaTraslado.dec_ValorAplica : null });
  },[selectTasaCuotaTraslado]);

  //todo: Calculado el impuesto de Traslado respecto a la Tasa Cuota
  useEffect( () => {
    if(cfdiForm.dec_BaseTraslado !== null && selectTasaCuotaTraslado !== null){
      let impuesto: number = cfdiForm.dec_BaseTraslado * selectTasaCuotaTraslado.dec_ValorAplica;
      setCfdiForm({...cfdiForm, dec_ImporteTraslado: impuesto});
    }
  },[cfdiForm.dec_TasaOCuotaTraslado]);

  //todo: Calculado el impuesto de Traslado respecto a la base
  useEffect( () => {
    if(cfdiForm.dec_BaseTraslado !== null && selectTasaCuotaTraslado !== null){
      let impuesto: number = cfdiForm.dec_BaseTraslado * selectTasaCuotaTraslado.dec_ValorAplica;
      setCfdiForm({...cfdiForm, dec_ImporteTraslado: impuesto});
    }
  },[cfdiForm.dec_BaseTraslado]);

  /* ================== AREA DE SELECT DE IMPUESTOS RETENCIÓN =========================== */

  //todo:Effect para select cat - Tipo Impuesto retención
  useEffect(() => {
    setCfdiForm({...cfdiForm, c_ImpuestoRetencion: (selectTipoImpuestosRetencion !== null) ? selectTipoImpuestosRetencion.c_Impuesto : null});
  },[selectTipoImpuestosRetencion]);

  //todo:Effect para select cat - Tipo Factor Traslado
  useEffect(() => {
    setCfdiForm({...cfdiForm, st_TipoFactorRetencion: (selectTipoFactorRetencion !== null) ? selectTipoFactorRetencion.c_TipoFactor : null});
  },[selectTipoFactorRetencion]);

  //todo: Effect para select Tasa Cuota Traslado
  useEffect(() => {
    setCfdiForm({...cfdiForm, dec_TasaOCuotaRetencion: (selectTasaCuotaRetencion !== null) ? selectTasaCuotaRetencion.dec_ValorAplica : null });
  },[selectTasaCuotaRetencion]);

  //todo: Calculado el impuesto de Retención respecto a la Tasa Cuota
  useEffect( () => {
    if(cfdiForm.dec_BaseRetencion !== null && selectTasaCuotaRetencion !== null){
      let impuesto: number = cfdiForm.dec_BaseRetencion* selectTasaCuotaRetencion.dec_ValorAplica;
      setCfdiForm({...cfdiForm, dec_ImporteRetencion: impuesto});
    }
  },[cfdiForm.dec_TasaOCuotaRetencion]);

  //todo: Calculado el impuesto de Retención respecto a la base 
  useEffect( () => {
    if(cfdiForm.dec_BaseRetencion !== null && selectTasaCuotaRetencion !== null){
      let impuesto: number = cfdiForm.dec_BaseRetencion * selectTasaCuotaRetencion.dec_ValorAplica;
      setCfdiForm({...cfdiForm, dec_ImporteRetencion: impuesto});
    }
  },[cfdiForm.dec_BaseRetencion]);
  
  return (
    <form className='form-horizontal'>
      <div className='form-body'>
        <h4 className="card-title">Información General de la Factura</h4>
        <div className='row'>
          <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <div className="form-group">
              <Autocomplete
                value={selectClientes}
                options={catClientes}   
                onChange={(_option, value) => setSelectClientes(value)}
                getOptionLabel={(option) => option.st_RazonSocial}
                isOptionEqualToValue={(option, value) => option.id_Cliente === value.id_Cliente}
                renderInput={(params) => <TextField {...params} label="Receptor" variant="outlined" />}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <div className="form-group">
              <Autocomplete
                value={selectMonedas}
                options={catMonedas}
                onChange={(_option, value) => setSelectMonedas(value)}
                getOptionLabel={(option) => option.c_Moneda + " - " + option.Descripción}
                isOptionEqualToValue={(option, value) => option.id_Moneda === value.id_Moneda}
                renderInput={(params) => <TextField {...params} label="Moneda" variant="outlined" />}
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
                renderInput={(params) => <TextField {...params} label="Tipo Comprobante" variant="outlined" />}
              />
            </div>
          </div>
          <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <div className="form-group">
              <Autocomplete
                value={selectFormasPago}
                options={catFormasPago}
                onChange={(_option, value) => setSelectFormasPago(value)}
                getOptionLabel={(option) => option.c_FormaPago + " - " + option.Descripción}
                isOptionEqualToValue={(option, value) => option.id_FormaPago === value.id_FormaPago}
                renderInput={(params) => <TextField {...params} label="Formas de Pago" variant="outlined" />}
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
                renderInput={(params) => <TextField {...params} label="Metodo de Pago" variant="outlined" />}
              />
            </div>
          </div>
        </div>
      </div>
      {
        tipoComprobante === "Ingreso" || tipoComprobante === "Egreso" ? (
          <div className="form-body">
            <h4 className="card-title">Impuestos</h4>
            <div className="row">
              <div className="col-12">
                <h6 className="card-title mb-3">Impuestos Traslados</h6>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField onChange={onChangeCfdiForm} id='dec_BaseTraslado' className="form-control" variant="outlined" label="Base"  type="number" inputProps={{ autoComplete: "off", min: 1}} name="dec_BaseTraslado" value={cfdiForm.dec_BaseTraslado || ''} required/>
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
                    renderInput={(params) => <TextField {...params} label="Impuesto traslado" variant="outlined" />}
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
                    renderInput={(params) => <TextField {...params} label="Tipo Factor" variant="outlined" />}
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
                    renderInput={(params) => <TextField {...params} label="Tasa Cuota(%)" variant="outlined" />}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField className="form-control" label="Importe" id="dec_ImporteTraslado" name="dec_ImporteTraslado" type="text" value={cfdiForm.dec_ImporteTraslado || ''} variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h6 className="card-title">Impuestos Retención</h6>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField onChange={onChangeCfdiForm} id='dec_BaseRetencion' className="form-control" variant="outlined" label="Base Retención"  type="number" inputProps={{ autoComplete: "off", min: 1}} name="dec_BaseRetencion" value={cfdiForm.dec_BaseRetencion || ''} required/>
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
                    renderInput={(params) => <TextField {...params} label="Impuesto retención" variant="outlined" />}
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
                    renderInput={(params) => <TextField {...params} label="Tipo Factor" variant="outlined" />}
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
                    renderInput={(params) => <TextField {...params} label="Tasa Cuota(%)" variant="outlined" />}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField className="form-control" label="Importe" id="dec_ImporteRetencion" name="dec_ImporteRetencion" type="text" value={cfdiForm.dec_ImporteRetencion || ''} variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }}/>
                </div>
              </div>
            </div>
          </div>
        ) : void(0)
      }
    </form>
  )
}

export default FacturaForm;