import { ChangeEvent, useEffect, useState } from 'react'
import { ITipoUnidad } from '../../../models/shared/tipo-unidad.model';
import { getAseguradoras, getTipoPermisoSct, getTipoUnidad } from '../../../services/public.service';
import { IUnidadForm } from '../../../models/unidades/unidad-form.model';
import { IUnidadDocumentos } from '../../../models/unidades/unidad-docs.model';
import { ITipoPermiso } from '../../../models/unidades/unidad.tipo.permiso.model';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { Autocomplete, Button, TextField } from '@mui/material';
import {createUnidad, editUnidad, getIdUnidad, updateFilesUnidad, uploadFilesUnidad} from '../../../services/unidades/unidades.service';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import ViewDocuments from '../Documents/ViewDocuments';
import { IAseguradoras } from '../../../models/shared/aseguradoras.model';

//todo: interfaz de Props
export interface Props {
  id_Unidad?: string,
  returnFormUnidad: (success: boolean) => void
}

// todo: VARIABLES GLOBALES
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
const MAX_FILE_SIZE = 5002400;
const nameDocumentsUnidad = ["url_TarjetaCirculacion", "url_Factura", "url_PermisoSCT"];

const UnidadForm = ({ id_Unidad = '', returnFormUnidad}: Props) => {
  //Variables globales
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;
  const [load, setLoad] = useState<boolean>(false);
  const [idDocumento, setIdDocumento] = useState<number>(0);

  //Service to get Specific Unidad
  const loadSpecificUnidad = getIdUnidad(id_Unidad);
  const loadTipoUnidades = getTipoUnidad();
  const loadTipoPermisoSct = getTipoPermisoSct();

  // todo: Formulario
  const [unidadForm, setUnidadForm] = useState<IUnidadForm>({st_Marca: '', st_SubMarca:'', id_TipoUnidad: 0, st_PermisoSCT: '', st_Economico: '', st_Placa: '', st_Anio: '', st_NumMotor: '', st_NumSerie: '', st_NumPoliza: '', date_Mecanico:  null, date_Ecologico: null, id_Empresa: id_Empresa, id_Candado: 1, id_TipoPermiso: null, id_AseguradoraRespCivil: null});
  const [documentos, setDocumentos] = useState<IUnidadDocumentos>({url_TarjetaCirculacion: '', url_Factura: '', url_PermisoSCT: ''});

  //todo: select - catálogos
  const [selectTipoUnidad, setSelectTipoUnidad] = useState<ITipoUnidad | null>(null);
  const [selectTipoPermiso, setSelectTipoPermiso] = useState<ITipoPermiso | null>(null);
  const [selectAseguradora, setSelectAseguradora] = useState<IAseguradoras | null>(null);

  //todo: Catálogos
  const [ tipoUnidades, setTipoUnidades] = useState<ITipoUnidad[]>([]);
  const [ tipoPermisosSct, setTipoPermisosSCT] = useState<ITipoPermiso[]>([]);
  const [ aseguradoras, setAseguradoras] = useState<IAseguradoras[]>([]);

  //todo: Custom Hooks
  const { callEndpoint } = useFetchAndLoad();

  //Todo: Servicios para hacer funcionar el formulario para editar una unidad
  const validateUnidadEmpresa = (idEmpresa : number) => {
    if(id_Empresa === idEmpresa)
      return true;
    else
      return false;
  }

  //todo: INITIAL'S FUNCTIONS
  useEffect(() => {
    console.log("effect initial");
    //services
    const apiTipoUnidades = getTipoUnidad();
    const apiTipoPermiso = getTipoPermisoSct();
    const apiAseguradoras = getAseguradoras();

    const catTipoUnidades = async () => {
      let result = await apiTipoUnidades.call
      if(result.data.success){
        let response = result.data;
        setTipoUnidades(response.data);
      }
    }

    const catTipoPermisoSct =  async () => {
      let result = await apiTipoPermiso.call
      if(result.data.success){
        let response = result.data;
        setTipoPermisosSCT( response.data );
      }
    }

    const catAseguradoras = async () => {
      let result = await apiAseguradoras.call
      if(result.data.success){
        let response = result.data;
        setAseguradoras( response.data );
      }
    }

    //llamamos las funciones
    catTipoUnidades();
    catTipoPermisoSct();
    catAseguradoras();

    //destruccción de componente
    return () => {
      apiTipoUnidades.controller.abort();
      apiTipoPermiso.controller.abort();
      apiAseguradoras.controller.abort();
    }
  },[]);

  //Se ejecuta solo cuando el id_Unidad cambia
  useEffect(() => {
    console.log("effect para editar unidad");

    const getUnidadWithId = async () => {
      try {
        const result = await loadSpecificUnidad.call;
        if(result.status === 200){
          const dataUnidad = result.data.data[0];
          const validateEmpresa = validateUnidadEmpresa(dataUnidad.id_Empresa);
          if(validateEmpresa){
            setIdDocumento(dataUnidad.id_Documento);
            const arregloUnidad  = {
              st_Marca: dataUnidad.st_Marca, 
              st_SubMarca:dataUnidad.st_SubMarca,
              id_TipoUnidad: dataUnidad.id_TipoUnidad, 
              st_PermisoSCT:  dataUnidad.st_PermisoSCT,
              st_Economico:dataUnidad.st_Economico, 
              st_Placa: dataUnidad.st_Placa,
              st_Anio: dataUnidad.st_Anio,
              st_NumMotor: dataUnidad.st_NumMotor, 
              st_NumSerie: dataUnidad.st_NumSerie, 
              st_NumPoliza: dataUnidad.st_NumPoliza, 
              date_Mecanico: dataUnidad.date_Mecanico, 
              date_Ecologico: dataUnidad.date_Ecologico, 
              id_Empresa: dataUnidad.id_Empresa, 
              id_Candado: dataUnidad.id_Candado,
              id_TipoPermiso: dataUnidad.id_TipoPermiso,
              id_AseguradoraRespCivil: dataUnidad.id_AseguradoraRespCivil
            };
            getSelectTipoUnidad(arregloUnidad.id_TipoUnidad);
            getSelectTipoPermisoSct(dataUnidad.id_TipoPermiso);
            setUnidadForm({...unidadForm, ...arregloUnidad});
          }else{
            alert("Error, la unidad no corresponde a tu empresa");
          }
        }else{
          alert("Error, no se encontró información de la unidad");
        }
      } catch (error) {
        alert("Error al recuperar la información de la unidad");
        
      }
    }

    const getSelectTipoUnidad = async(id: number) => {
      let result = await loadTipoUnidades.call;
      if(result.data.success){
        let response = result.data;
        let findOption = response.data.filter( (x: ITipoUnidad) => x.id_TipoUnidad === id);
        setSelectTipoUnidad(findOption[0]);
      }
    }

    const getSelectTipoPermisoSct = async (id: number) => {
      let result = await loadTipoPermisoSct.call;
      if(result.data.success){
        let response = result.data;
        let findOption = response.data.filter((x: ITipoPermiso) => id === x.id_TipoPermiso);
        setSelectTipoPermiso(findOption[0]);
      }
    }
    
    if(id_Unidad.trim() !== '') { getUnidadWithId(); } // Preguntamos si vamos a editar?
    return () => {
      if(id_Unidad.trim() !== '') { loadSpecificUnidad.controller.abort(); } // Preguntamos si vamos a editar?
    }
  },[id_Unidad]);

  //todo: Funciones para la lógica de formulario
  const onChangeUnidadForm = ({ target: { name, value } }: handleChangeForm)=> {
    setUnidadForm({...unidadForm, [name] : value});
  }
  
  const onchangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
    let selector = nameDocumentsUnidad.filter( x => x === e.target.id);
    let sizeFile: any = e.target.files?.[0].size;
    let typeFile = e.target.files?.[0].type;

    if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
      setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
    }else{
      setDocumentos({...documentos, [selector[0]]: ''});
      alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
    }
  }

  //todo: Change <AutoComplete />
  useEffect(()=>{
    setUnidadForm({...unidadForm, id_TipoPermiso: (selectTipoPermiso !== null) ? selectTipoPermiso.id_TipoPermiso : null });
  },[selectTipoPermiso]);

  useEffect(() => {
    setUnidadForm({...unidadForm, id_TipoUnidad: (selectTipoUnidad !== null) ? selectTipoUnidad.id_TipoUnidad : null });
  },[selectTipoUnidad]);

  useEffect( () => {
    setUnidadForm({...unidadForm, id_AseguradoraRespCivil: (selectAseguradora !== null) ? selectAseguradora.id_Aseguradora : null });
  },[selectAseguradora]);

 
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoad(true);
    try {
      //todo: Creamos la unidad
      let result = await callEndpoint(createUnidad(unidadForm));
      //Todo: Creamos el registro de los documentos
      let createDocuments = await callEndpoint(uploadFilesUnidad(documentos,result.data.data.id_Unidad));
      //Todo: Actualizamos nombre de los archivos con la unidad y los documentos
      await callEndpoint(updateFilesUnidad(documentos, createDocuments.data.data.id_Documento, result.data.data.id_Unidad));
      returnFormUnidad(true);
    } catch (error) {
      returnFormUnidad(false);
    }
    setLoad(false);
  }

  const onSubmitEdit = async (e:any) => {
    e.preventDefault();
    setLoad(true);
    try {
      //Editamos la unidad
      await callEndpoint(editUnidad(id_Unidad,unidadForm));
      //actualizamos los archivos
      await callEndpoint(updateFilesUnidad(documentos, idDocumento.toString(), id_Unidad));
      returnFormUnidad(true);
    } catch (error) {
      returnFormUnidad(false);
    }
    setLoad(false); 
  }

  return (
    <form className='form-horizontal'>
        <div className="form-body">
          <h4 className="card-title">Información General de la Unidad</h4>
          <hr></hr>
          <div className='row'>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Economico' className="form-control" variant="outlined" label="Eco"  type="text" name="st_Economico" onChange={onChangeUnidadForm} value={unidadForm.st_Economico || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <Autocomplete
                value={selectTipoUnidad}
                options={tipoUnidades}
                onChange={(_option, value) => setSelectTipoUnidad(value)}
                getOptionLabel={(option) => option.st_ClaveTransporte + ' - ' + option.st_Descripcion}
                isOptionEqualToValue={(option, value) => option.id_TipoUnidad=== value.id_TipoUnidad}
                renderInput={(params) => <TextField {...params} label="Tipo Unidades" variant="outlined" />}
              />
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Marca' className="form-control" variant="outlined" label="Marca"  type="text" name="st_Marca" onChange={onChangeUnidadForm} value={unidadForm.st_Marca || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_SubMarca' className="form-control" variant="outlined" label="Sub - Marca"  type="text" name="st_SubMarca" onChange={onChangeUnidadForm} value={unidadForm.st_SubMarca || '' } inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Anio' className="form-control" variant="outlined" label="Año"  type="text" name="st_Anio" onChange={onChangeUnidadForm} value={unidadForm.st_Anio || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Placa' className="form-control" variant="outlined" label="Placas"  type="text" name="st_Placa" onChange={onChangeUnidadForm} value={unidadForm.st_Placa || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_NumMotor' className="form-control" variant="outlined" label="Número de Motor"  type="text" name="st_NumMotor" onChange={onChangeUnidadForm} value={unidadForm.st_NumMotor || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_NumSerie' className="form-control" variant="outlined" label="Número de Serie"  type="text" name="st_NumSerie" onChange={onChangeUnidadForm} value={unidadForm.st_NumSerie || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-12 col-xs-12'>
              <div className="form-group">
                <Autocomplete
                  value={selectTipoPermiso}
                  options={tipoPermisosSct}
                  onChange={(_option, value) => setSelectTipoPermiso(value)}
                  getOptionLabel={(option) => option.st_Clave + ' - ' + option.st_Descripcion}
                  isOptionEqualToValue={(option, value) => option.id_TipoPermiso === value.id_TipoPermiso}
                  renderInput={(params) => <TextField {...params} label="Tipo Permiso SCT" variant="outlined" />}
                />
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_PermisoSCT' className="form-control" variant="outlined" label="Permiso SCT"  type="text" name="st_PermisoSCT" onChange={onChangeUnidadForm} value={unidadForm.st_PermisoSCT || ''} inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField fullWidth id="date_Mecanico" name="date_Mecanico" label="Fecha de Ventimiento F. Mécanico" InputLabelProps={{ shrink: true }} type="date" onChange={onChangeUnidadForm} value={unidadForm.date_Mecanico || ''}  inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField fullWidth id="date_Ecologico" name="date_Ecologico" label="Fecha de Ventimiento Ecológica" InputLabelProps={{ shrink: true }} type="date" onChange={onChangeUnidadForm} value={unidadForm.date_Ecologico || ''}  inputProps={{ autoComplete: "off" }} required/>
              </div>
            </div>
          </div>
          <h4 className="card-title">Información General de la Unidad</h4>
          <hr></hr>
          <div className="row">
            <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <Autocomplete
                value={selectAseguradora}
                options={aseguradoras}
                onChange={(_option, value) => setSelectAseguradora(value)}
                getOptionLabel={(option) => option.st_NombreAseguradora}
                isOptionEqualToValue={(option, value) => option.id_Aseguradora=== value.id_Aseguradora}
                renderInput={(params) => <TextField {...params} label="Selecciona una aseguradora" variant="outlined" />}
              />
            </div>
            <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_NumPoliza' className="form-control" variant="outlined" label="Número de Póliza"  type="text" name="st_NumPoliza" onChange={onChangeUnidadForm} value={unidadForm.st_NumPoliza || ''} inputProps={{ autoComplete: "off" }} required/>
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
                    {
                      documentos.url_TarjetaCirculacion === '' ? 
                      (
                        <p className="card-title" >Sube el archivo correspondiente - Tarjeta de Circulación</p>
                      ) : <p className="card-title text-success">Archivo aceptado</p>
                    }
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                <div className="form-group">
                    <Button variant="contained" component="label" >Factura
                        <input id='url_Factura'  accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                    </Button>
                    {
                      documentos.url_Factura === '' ? 
                      (
                        <p className="card-title" >Sube el archivo correspondiente - Factura</p>
                      ) : <p className="card-title text-success">Archivo aceptado</p>
                    }
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                <div className="form-group">
                    <Button variant="contained" component="label" >Permiso SCT
                        <input id='url_PermisoSCT' accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                    </Button>
                    {
                      documentos.url_PermisoSCT === '' ? 
                      (
                        <p className="card-title" >Sube el archivo correspondiente - Permiso SCT</p>
                      ) : <p className="card-title text-success">Archivo aceptado</p>
                    }
                </div>
            </div>
          </div>
          {
            idDocumento !== 0 ? ( <ViewDocuments id_Documento={idDocumento}/>) : void(0)
          }
          <div className="row mt-4">
              <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                  <div className="form-group">
                    {
                      !load ? (
                        <Button onClick={(idDocumento === 0 && id_Unidad === '' ) ? onSubmit : onSubmitEdit}  variant='contained' color='success' size='medium' type="button"> 
                          { (idDocumento === 0 && id_Unidad === '' ) ? " Alta Unidad" : " Guardar Unidad"} 
                        </Button>
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