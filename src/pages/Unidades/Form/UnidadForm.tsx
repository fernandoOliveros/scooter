import { ChangeEvent, useEffect, useState } from 'react'
import { ITipoUnidad } from '../../../models/shared/tipo-unidad.model';
import { getTipoUnidad } from '../../../services/public.service';
import { IUnidadForm } from '../../../models/unidades/unidad-form.model';
import { IUnidadDocumentos } from '../../../models/unidades/unidad-docs.model';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';

// todo: Variables globales en el componente
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export interface Props {
  id_Documento: string | undefined
}

const UnidadForm = ({ id_Documento = undefined }: Props) => {
  //Variables globales
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;
  const navigate = useNavigate();
  const [load, setLoad] = useState<boolean>(false);

  // todo: Forms
  const [unidadForm, setUnidadForm] = useState<IUnidadForm>({st_Marca: '', st_SubMarca:'', id_TipoUnidad: 0, st_PermisoSCT: '', st_Economico: '', st_Placa: '', st_Anio: '', st_NumMotor: '', st_NumSerie: '', st_NumPoliza: '', date_Mecanico:  null, date_Ecologico: null, id_Empresa: id_Empresa, id_Candado: 1});
  const [documentos, setDocumentos] = useState<IUnidadDocumentos>({url_TarjetaCirculacion: null, url_Factura: null, url_PermisoSCT: null});

  //todo: select - catálogos
  const [selectTipoUnidad, setSelectTipoUnidad] = useState<IAutoComplete>({id: 0, label: 'Selecciona el tipo de unidad'});

  //todo: Catálogos
  const [ tipoUnidades, setTipoUnidades] = useState<IAutoComplete[]>([]);

  //todo: Services
  const loadTipoUnidades = getTipoUnidad();
  const catTipoUnidades = async () => {
    let result = await loadTipoUnidades.call
    if(result.data.success){
      let info = result.data.data;
      let dataOkey = info.map( (item: ITipoUnidad) => ({
        id: item.id_TipoUnidad,
        label: item.st_ClaveTransporte + " - " + item.st_Descripcion
      }));
      setTipoUnidades(dataOkey);
    }
  }

  //todo: función se ejecuta cada vez que se monta el componente
  useEffect(() => {
      catTipoUnidades();
    return () => {
      loadTipoUnidades.controller.abort();
    }
  }, []);

  //todo: Funciones
  const onChangeUnidadForm = ({ target: { name, value } }: handleChangeForm)=> {
    setUnidadForm({...unidadForm, [name] : value});
  }
  
  const onchangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 5002400;
    let doc = e.target.id;
    let sizeFile = e.target.files?.[0].size;
    console.log(e.target.files?.[0]);
  }

  const onChangeTipoUnidad = (arreglo: any) => {
    console.log(arreglo);
    if(arreglo !== null){
      setSelectTipoUnidad( arreglo );
      tipoUnidades.forEach((alias) => {
        if(alias.id === arreglo.id){
          setUnidadForm({...unidadForm, id_TipoUnidad: arreglo.id});
        }
      });
    }
  }
 
  const onSubmit = (e: any) => {
    setLoad(true);
    e.preventDefault();
    let body = { ...unidadForm };
    console.log(body);
  }

    
  return (
      <form className='form-horizontal'>
        <div className="form-body">
          <h4 className="card-title">Información General de la Unidad</h4>
          <hr></hr>
          <div className='row'>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Economico' className="form-control" variant="outlined" label="Eco"  type="text" name="st_Economico" onChange={onChangeUnidadForm} value={unidadForm.st_Economico || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-3 col-lg-4 col-sm-12 col-xs-12">
              <Autocomplete
                value={selectTipoUnidad}
                options={tipoUnidades}   
                onChange={(option, value) => onChangeTipoUnidad(value)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option === value }
                renderInput={(params) => <TextField {...params} label="Tipo Unidades" variant="outlined" />}
              />
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Marca' className="form-control" variant="outlined" label="Marca"  type="text" name="st_Marca" onChange={onChangeUnidadForm} value={unidadForm.st_Marca || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_SubMarca' className="form-control" variant="outlined" label="Sub - Marca"  type="text" name="st_SubMarca" onChange={onChangeUnidadForm} value={unidadForm.st_SubMarca || '' } inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Anio' className="form-control" variant="outlined" label="Año"  type="text" name="st_Anio" onChange={onChangeUnidadForm} value={unidadForm.st_Anio || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Placa' className="form-control" variant="outlined" label="Placas"  type="text" name="st_Placa" onChange={onChangeUnidadForm} value={unidadForm.st_Placa || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_NumMotor' className="form-control" variant="outlined" label="Número de Motor"  type="text" name="st_NumMotor" onChange={onChangeUnidadForm} value={unidadForm.st_NumMotor || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_NumSerie' className="form-control" variant="outlined" label="Número de Serie"  type="text" name="st_NumSerie" onChange={onChangeUnidadForm} value={unidadForm.st_NumSerie || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_NumPoliza' className="form-control" variant="outlined" label="Número de Póliza"  type="text" name="st_NumPoliza" onChange={onChangeUnidadForm} value={unidadForm.st_NumPoliza || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField id='st_PermisoSCT' className="form-control" variant="outlined" label="Permiso SCT"  type="text" name="st_PermisoSCT" onChange={onChangeUnidadForm} value={unidadForm.st_PermisoSCT || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField fullWidth id="date_Mecanico" name="date_Mecanico" label="Fecha de Ventimiento F. Mécanico" InputLabelProps={{ shrink: true }} type="date" onChange={onChangeUnidadForm} value={unidadForm.date_Mecanico || ''}  inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="form-group">
                  <TextField fullWidth id="date_Ecologico" name="date_Ecologico" label="Fecha de Ventimiento Ecológica" InputLabelProps={{ shrink: true }} type="date" onChange={onChangeUnidadForm} value={unidadForm.date_Ecologico || ''}  inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
          </div>
          <h4 className="card-title mt-4">Documentación de la Unidad</h4>
            <hr></hr>
            <div className="row">
              <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <Button variant="contained" component="label" >Tarjeta Circulacion
                          <input id='url_TarjetaCirculacion'  accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                      </Button>
                      <p className="card-title" id="file-url_TarjetaCirculacion">Sube el archivo correspondiente - Tarjeta de Circulación</p>
                  </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <Button variant="contained" component="label" >Factura
                          <input id='url_Factura'  accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                      </Button>
                      <p className="card-title" id="file-url_Factura">Sube el archivo correspondiente - Fatura</p>
                  </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <Button variant="contained" component="label" >Permiso SCT
                          <input id='url_PermisoSCT' accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                      </Button>
                      <p className="card-title"  id="file-url_PermisoSCT">Sube el archivo correspondiente - Permiso SCT</p>
                  </div>
              </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="form-group">
                      {
                        !load ? (
                          <button onClick={onSubmit} className="btn btn-success" type="button"><i className="fa fa-save">  </i> {id_Documento !== undefined ? "Editar" : "Guardar"} </button>
                        ) : (
                          <i className="fa fa-spinner fa-spin" style={{fontSize: "25px", color: "#038a68"}}>  </i>
                        )
                      }
                    </div>
                </div>
            </div>
        </div>
    </form>
  )
}

export default UnidadForm