import { Fragment, useEffect, useState } from 'react'
import { IAutoComplete } from '../../../../models/shared/autocomplete.model';
import { getViajesActivos } from '../../../../services/public.service';
import { IViajesActivos } from '../../../../models/viajes/viaje.model';
import { useFormContext, Controller } from 'react-hook-form';
import { ICartaPorteFormData } from '../../../../models/cartaportes/cartaporte-formData';
import { AutocompleteField } from '../../../../components/shared/AutoCompleteField';
import { ICatMoneda, IFormasPago, IMetodosPago, IObjetoImpuesto, IProdServicioCFDI, ITasaCuota, ITipoComprobante, ITipoFactor, ITipoImpuestos, IUnidadPesoCFDI, IUsoCFDI } from '../../../../models/cfdis/cfdi-form.model';
import { getClientesEmpresa } from '../../../../services/clientes/clientes.service';
import { ICliente } from '../../../../models/clientes/cliente.model';
import { getCatFormaPago, getCatMetodosPago, getCatObjetoImpuesto, getCatProdServicioCFDI, getCatTipoFactor, getCatTipoImpuestos, getCatTipoMonedas, getCatUsoCFDI } from '../../../../services/cfdi/cfdi.service';
import { Autocomplete, TextField } from '@mui/material';

function SectionCfdiCartaPorte() {

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

  let catUnidadServicio : IUnidadPesoCFDI[] = [
    {
      id_ClaveUnidadPesoCFDI: 678,
      c_ClaveUnidad: "E48",
      st_Nombre: "Unidad de servicio",
      st_Descripción: "Unidad de conteo que define el número de unidades de servicio (unidad de servicio: definido período / propiedad / centro / utilidad de alimentación)."
    }
  ];

  // Forulario control
  const { control, watch, setValue, getValues, register, formState: { errors }} = useFormContext<ICartaPorteFormData>();

  // Catálogos
  const [catViajesActivos, setCatViajesActivos] = useState<IAutoComplete[]>([]);
  const [catTipoComprobante, setCatTipoComprobante] = useState<IAutoComplete[]>([]);
  const [catClientes, setCatClientes] = useState<IAutoComplete[]>([]);
  const [catMonedas, setCatMonedas] = useState<IAutoComplete[]>([]);
  const [catFormasPago, setCatFormasPago] = useState<IAutoComplete[]>([]);
  const [catMetodosPago, setCatMetodosPago] = useState<IAutoComplete[]>([]);
  const [catProdServicioCFDI, setCatProdServicioCFDI] = useState<IAutoComplete[]>([]);
  const [catUnidadPesoCFDI, setCatUnidadPesoCFDI] = useState<IAutoComplete[]>([]);
  const [catUsoCFDI, setCatUsoCFDI] = useState<IAutoComplete[]>([]);
  const [catTipoImpuestos, setCatTipoImpuestos] = useState<IAutoComplete[]>([]);
  const [catObjetoImpuesto, setCatObjetoImpuesto] = useState<IAutoComplete[]>([]);
  const [catTipoFactor, setCatTipoFactor] = useState<IAutoComplete[]>([]);
  const [catTasaCuota, setCatTasaCuota] = useState<IAutoComplete[]>([]);
  
  // Watchs
  const wTipoComprobante = watch("cfdi.id_TipoComprobante");
  const wObjetoDeImpuesto = watch("productCfdi.id_ObjetoImp");
  const wValorUnitarioConcepto = watch("productCfdi.dec_ValorUnitarioConcepto");
  const wCantidadServicioCfdi = watch("productCfdi.i_Cantidad");

  // watch Impuesto Traslado
  const wdec_TasaOCuotaTraslado = watch("productCfdi.dec_TasaOCuotaTraslado");
  const wdec_BaseTraslado = watch('productCfdi.dec_BaseTraslado');

  // watch Impuesto Retención 
  const wdec_TasaOCuotaRetencion= watch("productCfdi.dec_TasaOCuotaRetencion");
  const wdec_BaseRetencion= watch('productCfdi.dec_BaseRetencion');

  // init Function
  useEffect( () => {
      // services
      const loadViajesActivos = getViajesActivos();
      const loadClientes = getClientesEmpresa();
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
          let dataParse = response.data.map( (item: IViajesActivos) => ({
              id: item.id_Viaje,
              label: item.folio_int_viaje + " - " + item.st_EconomicoUnidad
          }));
          setCatViajesActivos(dataParse);
        }).catch((error: any) => {
          console.log(error);
        });
      }

      // Tipo Comprobante
      const _getTipoComprobante = () => {
        let dataParse = ITipoComprobanteArray.map( (item) => ({
          id: item.id_TipoComprobante,
          label: item.c_TipoDeComprobante + " - " + item.st_TipoComprobante
        }));
        setCatTipoComprobante(dataParse);
      }

      // Clientes Cfdi
      const _getClientes =  () => {
        loadClientes.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: ICliente) => ({
            id: item.id_Cliente,
            label: item.st_RazonSocial
          }));
          setCatClientes(dataParse);
        }).catch((error: any) => {
          console.log(error);
        });
      }

      // Tipo moneda
      const _getMonedas = () => {
        loadMonedas.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: ICatMoneda) => ({
            id: item.id_Moneda,
            label: item.c_Moneda + " - " + item.st_Descripcion
          }));
          setCatMonedas(dataParse);
        }).catch((error: any) => {
          console.log(error);
        });
        
      }

      const _getFormasPago = () => {
        loadFormasPago.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: IFormasPago) => ({
            id: item.id_FormaPago,
            label: item.c_FormaPago + " - " + item.st_descripcion
          }));
          setCatFormasPago(dataParse);
        }).catch((error: any) => {
          console.log(error);
        });
      }
  
      const _getMetodosPago = () => {
        loadMetodosPago.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: IMetodosPago) => ({
            id: item.id_MetodoPago,
            label: item.c_MetodoPago + " - " + item.st_Descripcion
          }));
          setCatMetodosPago(dataParse);
        }).catch((error: any) => {
          console.log(error);
        });
      }
  
      const _getProdServiciosCfdi = () => {
        loadProdServicioCfdi.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: IProdServicioCFDI) => ({
            id: item.id_ClaveProdServCFDI,
            label: item.c_ClaveProdServ + " - " + item.Descripcion
          }));
          setCatProdServicioCFDI( dataParse );
        }).catch((error: any) => {
          console.log(error);
        });
      }
  
      const _getUnidadPesoCfdi = () => {
        let dataParse = catUnidadServicio.map( (item) => ({
          id: item.id_ClaveUnidadPesoCFDI,
          label: item.c_ClaveUnidad + " - " + item.st_Nombre
        }));
        setCatUnidadPesoCFDI( dataParse );
      }
  
      const _getUsoCfdi = async() => {
        loadUsoCfdi.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: IUsoCFDI) => ({
            id: item.id_UsoCFDI,
            label: item.c_UsoCFDI + " - " + item.st_Descripcion
          }));
          setCatUsoCFDI( dataParse );
        }).catch((error: any) => {
          console.log(error);
        });
      }

      const _getTipoImpuestos = () => {
        loadTipoImpuestos.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: ITipoImpuestos) => ({
            id: item.id_Impuesto,
            label: item.c_Impuesto + " - " + item.st_Descripcion
          }));
          setCatTipoImpuestos( dataParse );
        }).catch((error: any) => {
          console.log(error);
        });
      }

      const _getObjetoImpuesto = () => {
        loadObjetoImpuesto.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: IObjetoImpuesto) => ({
            id: item.id_ObjetoImp,
            label: item.c_ObjetoImp + " - " + item.st_descripcion
          }));
          setCatObjetoImpuesto( dataParse );
        }).catch((error: any) => {
          console.log(error);
        });
      }
  
      const _getTipoFactor = () => {
        loadTipoFactor.call
        .then((resp) => {
          let response = resp.data;
          let dataParse = response.data.map( (item: ITipoFactor) => ({
            id: item.id_TipoFactor,
            label: item.c_TipoFactor
          }));
          setCatTipoFactor( dataParse );
        }).catch((error: any) => {
          console.log(error);
        });
      }

      const _getTasaCuota = () => {
        let dataParse = catTasaCuotaJson.map( (item: ITasaCuota) => ({
          id: item.id_TasaCuotaJson,
          label: item.c_TasaCuota
        }));
        setCatTasaCuota( dataParse );
      }
  
      _getViajesActivos();
      _getTipoComprobante();
      _getClientes();
      _getMonedas();
      _getFormasPago();
      _getMetodosPago();
      _getProdServiciosCfdi();
      _getUnidadPesoCfdi();
      _getUsoCfdi();
      _getTipoImpuestos();
      _getObjetoImpuesto();
      _getTipoFactor();
      _getTasaCuota();
  },[]);

  // CAT - TIPO COMPROBANTE
  useEffect( () => {
    // Si es traslado
      setValue('cfdi.dec_Total', (wTipoComprobante === 2) ? 0 : null);
      setValue('cfdi.dec_SubTotal', (wTipoComprobante === 2) ? 0 : null);
  },[wTipoComprobante]);

  // INPUT VALOR UNITARIO CONCEPTO
  useEffect( () => {
    let importe: number = calcularImporteAntesDeImpuestos();
    setValue("productCfdi.dec_ImporteConcepto", importe);
    setValue("productCfdi.dec_BaseTraslado", importe);
    setValue("productCfdi.dec_BaseRetencion", importe);
  },[wValorUnitarioConcepto, wCantidadServicioCfdi]);

  // Obtiene Importe del Impuesto Traslado
  useEffect(() => {
    let importe: number = calcularImporteTrasladoDespuestoImpuestos();
    setValue('productCfdi.dec_ImporteTraslado', importe);
    setValue('cfdi.dec_TotalImpuestosTrasladados', importe);
  },[wdec_TasaOCuotaTraslado, wdec_BaseTraslado]);
  
  const calcularImporteTrasladoDespuestoImpuestos = (): number => {
    let importe: number = 0;
    let dec_BaseTraslado = getValues('productCfdi.dec_BaseTraslado');
    let dec_TasaOCuotaTraslado = getValues('productCfdi.dec_TasaOCuotaTraslado');
    if( ( dec_BaseTraslado != 0 && dec_BaseTraslado != null) && dec_TasaOCuotaTraslado != 0 && dec_TasaOCuotaTraslado != null){
      importe =  + (dec_BaseTraslado * dec_TasaOCuotaTraslado).toFixed(3);
    }
    return importe;
  }

  // Obtiene Importe del Impuesto Retención
  useEffect(() => {
    let importe: number = calcularImporteRetencionDespuestoImpuestos();
    setValue('productCfdi.dec_ImporteRetencion', importe);
    setValue('cfdi.dec_TotalImpuestosRetenidos', importe);
  },[wdec_TasaOCuotaRetencion, wdec_BaseRetencion]);

  const calcularImporteRetencionDespuestoImpuestos = (): number => {
    let importe: number = 0;
    let dec_BaseRetencion = getValues('productCfdi.dec_BaseRetencion');
    let dec_TasaOCuotaRetencion = getValues('productCfdi.dec_TasaOCuotaRetencion');
    if( ( dec_BaseRetencion != 0 && dec_BaseRetencion != null) && dec_TasaOCuotaRetencion != 0 && dec_TasaOCuotaRetencion != null){
      importe =  + (dec_BaseRetencion * dec_TasaOCuotaRetencion).toFixed(3);
    }
    return importe;
  }

  // Funciones utils
  const calcularImporteAntesDeImpuestos = (): number => {
    let importe: number = 0;
    if( (wValorUnitarioConcepto !== null && wValorUnitarioConcepto !== 0  ) && (wCantidadServicioCfdi !== null && wCantidadServicioCfdi !== 0 )){
      importe = + (wValorUnitarioConcepto * wCantidadServicioCfdi).toFixed(3);
    }
    return importe;
  }

  return (
    <Fragment>
      <div className="row">
        <h3 className="card-title mt-3 mb-5">Datos Generales del CFDI</h3>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
                options={catViajesActivos}
                control={control}
                name='general.id_Viaje'
                placeholder='Selecciona tu viaje'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catTipoComprobante}
              control={control}
              name='cfdi.id_TipoComprobante'
              placeholder='Selecciona tipo de comprobante'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catClientes}
              control={control}
              name='cfdi.id_Cliente'
              placeholder='Cliente Factura'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catMonedas}
              control={control}
              name='cfdi.id_Moneda'
              placeholder='Moneda'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catFormasPago}
              control={control}
              name='cfdi.id_FormaPago'
              placeholder='Formas de Pago'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catMetodosPago}
              control={control}
              name='cfdi.id_MetodoPago'
              placeholder='Métodos de Pago'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catUsoCFDI}
              control={control}
              name='cfdi.id_UsoCFDI'
              placeholder='Uso del CFDI'
            />
          </div>
        </div>
      </div>
      <div className="row">
        <h3 className="card-title mt-3 mb-5">Producto - Servicio del CFDI</h3>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catProdServicioCFDI}
              control={control}
              name='productCfdi.id_ClaveProdServCFDI'
              placeholder='Producto Servicio CFDI'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField id='i_Cantidad' className="form-control" variant="outlined" label="Cantidad"  type="number"
            {...register("productCfdi.i_Cantidad", {
              required: "Campo Requerido",
            })}
            error={errors.productCfdi?.i_Cantidad? true : false}
            helperText={errors.productCfdi?.i_Cantidad && errors.productCfdi?.i_Cantidad.message?.toString()}
            inputProps={{ autoComplete: "off", min: 1, defaultValue: 1}}
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catUnidadPesoCFDI}
              control={control}
              name='productCfdi.id_ClaveUnidadPesoCFDI'
              placeholder='Unidad Servicio CFDI'
            />
          </div>
        </div>
        <div className="col-md-8 col-lg-8 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField size='medium' fullWidth id='st_DescripcionConcepto' className="form-control" variant="outlined" label="Descripción" type="text"
            {...register("productCfdi.st_DescripcionConcepto", {
              required: "Campo Requerido",
            })}
            error={errors.productCfdi?.st_DescripcionConcepto? true : false}
            helperText={errors.productCfdi?.st_DescripcionConcepto && errors.productCfdi?.st_DescripcionConcepto.message?.toString()}
            inputProps={{ autoComplete: "off"}}/>
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField
              options={catObjetoImpuesto}
              control={control}
              name='productCfdi.id_ObjetoImp'
              placeholder='Objeto de Impuesto'
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField
            fullWidth className="form-control" variant="outlined" label="Valor Unitario" type="number"
            {...register("productCfdi.dec_ValorUnitarioConcepto", {
              required: "Campo Requerido",
            })}
            error={errors.productCfdi?.dec_ValorUnitarioConcepto? true : false}
            helperText={errors.productCfdi?.dec_ValorUnitarioConcepto && errors.productCfdi?.dec_ValorUnitarioConcepto.message?.toString()}
            inputProps={{ autoComplete: "off", min: 1, step: "any"}}
            />
          </div>
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField fullWidth className="form-control" variant="outlined" label="Importe" type="number" 
            {...register("productCfdi.dec_ImporteConcepto", {
              required: "Campo Requerido",
            })}
            error={errors.productCfdi?.dec_ImporteConcepto? true : false}
            helperText={errors.productCfdi?.dec_ImporteConcepto && errors.productCfdi?.dec_ImporteConcepto.message?.toString()}
            inputProps={{ autoComplete: "off", step: "any" }}
            />
          </div>
        </div>
      </div>
      {
        /* VALIDAMOS EL TIPO DE COMPROBANTE SEA INGRESO  Y QUE SEA CON DESGLOSE DE OBJETO*/
        ( wTipoComprobante == 1 && wObjetoDeImpuesto == 2) ? (
          <div className="row">
            <h3 className="card-title mt-5">Impuestos</h3>
            <div className="row">
              <div className="col-12">
                <h5 className="card-title mt-3">Impuesto Traslado</h5>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField id='dec_BaseTraslado' className="form-control" variant="outlined" label="Base Traslado"  type="number" 
                  {...register("productCfdi.dec_BaseTraslado", {
                    required: "Campo Requerido",
                  })}
                  error={errors.productCfdi?.dec_BaseTraslado? true : false}
                  helperText={errors.productCfdi?.dec_BaseTraslado && errors.productCfdi?.dec_BaseTraslado.message?.toString()}
                  inputProps={{ autoComplete: "off", readOnly: true }}/>
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                   <AutocompleteField
                    options={catTipoImpuestos}
                    control={control}
                    name='productCfdi.id_ImpuestoTraslado'
                    placeholder='Impuesto Traslado Aplicado'
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <AutocompleteField
                    options={catTipoFactor}
                    control={control}
                    name='productCfdi.id_TipoFactorTraslado'
                    placeholder='Tipo Factor'
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Controller
                    name='productCfdi.dec_TasaOCuotaTraslado'
                    control={control}
                    rules={{ required: "Selecciona una tasa" }}
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        options={catTasaCuotaJson}
                        getOptionLabel={(option) => option.c_TasaCuota}
                        // Guardamos el valor aplicado directamente
                        onChange={(_, newValue) => { field.onChange(newValue ? newValue.dec_ValorAplica : null) }}
                        // Buscamos el objeto cuyo valor aplicado coincida con el valor actual
                        value={ catTasaCuotaJson.find((op) => op.dec_ValorAplica === field.value) || null }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tasa Cuota (%)"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField className="form-control" label="Importe" id="dec_ImporteTraslado" type="text" variant="outlined"
                  {...register("productCfdi.dec_ImporteTraslado", {
                    required: "Campo Requerido",
                  })}
                  error={errors.productCfdi?.dec_ImporteTraslado? true : false}
                  helperText={errors.productCfdi?.dec_ImporteTraslado && errors.productCfdi?.dec_ImporteTraslado.message?.toString()}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h5 className="card-title mt-3">Impuesto Retención</h5>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField id='dec_BaseRetencion' className="form-control" variant="outlined" label="Base Retención"  type="number"
                  {...register("productCfdi.dec_BaseRetencion", {
                    required: "Campo Requerido",
                  })}
                  error={errors.productCfdi?.dec_BaseRetencion? true : false}
                  helperText={errors.productCfdi?.dec_BaseRetencion && errors.productCfdi?.dec_BaseRetencion.message?.toString()}
                  inputProps={{ autoComplete: "off", min: 1, readOnly: true}}/>
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                   <AutocompleteField
                    options={catTipoImpuestos}
                    control={control}
                    name='productCfdi.id_ImpuestoRetencion'
                    placeholder='Impuesto Traslado Aplicado'
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <AutocompleteField
                    options={catTipoFactor}
                    control={control}
                    name='productCfdi.id_TipoFactorRetencion'
                    placeholder='Tipo Factor'
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Controller
                    name='productCfdi.dec_TasaOCuotaRetencion'
                    control={control}
                    rules={{ required: "Selecciona una tasa" }}
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        options={catTasaCuotaJson}
                        getOptionLabel={(option) => option.c_TasaCuota}
                        // Guardamos el valor aplicado directamente
                        onChange={(_, newValue) => { field.onChange(newValue ? newValue.dec_ValorAplica : null) }}
                        // Buscamos el objeto cuyo valor aplicado coincida con el valor actual
                        value={ catTasaCuotaJson.find((op) => op.dec_ValorAplica === field.value) || null }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tasa Cuota (%)"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <TextField className="form-control" label="Importe" id="dec_ImporteRetencion" type="text" variant="outlined"
                  {...register("productCfdi.dec_ImporteRetencion", {
                    required: "Campo Requerido",
                  })}
                  error={errors.productCfdi?.dec_ImporteRetencion? true : false}
                  helperText={errors.productCfdi?.dec_ImporteRetencion && errors.productCfdi?.dec_ImporteRetencion.message?.toString()}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}/>
                </div>
              </div>
            </div>
          </div>
        ) : void(0)
      }
    </Fragment>
  )
}

export default SectionCfdiCartaPorte