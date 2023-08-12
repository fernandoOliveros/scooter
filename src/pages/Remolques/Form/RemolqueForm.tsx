import  { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { IRemolqueForm } from '../../../models/remolques/remolque-form.model';
import { IRemolqueDocumentos } from '../../../models/remolques/remolque-docs.model';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { getTipoRemolque } from '../../../services/public.service';
import { ITipoRemolque } from '../../../models/shared/tipo-remolque.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import { createRemolque, editRemolque, getIdRemolque, updateFilesRemolque, uploadFilesRemolque } from '../../../services/remolques/remolques.service';
import ViewDocumentsRemolque from '../Documents/ViewDocumentsRemolque';

//todo: interfaz de Props
export interface Props {
  id_Remolque?: string
}

// todo: VARIABLES GLOBALES
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
const MAX_FILE_SIZE = 5002400;
const nameDocuments = ["url_TarjetaCirculacion", "url_Factura", "url_PermisoSCT"];

const RemolqueForm = ({id_Remolque = ''}: Props) => {
  //todo: variables globales
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;
  const [idDocumento, setIdDocumento] = useState<number>(0);

  //todo: FORMULARIO
  const [remolqueForm, setRemolqueForm] = useState<IRemolqueForm>({ id_Empresa : id_Empresa, st_Anio : '', st_Economico : '', st_Marca : '', st_Placa : '', st_NumSerie : '', date_VigenciaFM : null, id_TipoRemolque : null,
  });
  const [documentos, setDocumentos] = useState<IRemolqueDocumentos>({url_TarjetaCirculacion: '', url_Factura: '', url_PermisoSCT: ''});

  //todo: select - catálogos
  const [selectTipoRemolque, setSelectTipoRemolque] = useState(null);

  //todo: variable - contiene los tipos remolques
  const [ tipoRemolques, setTipoRemolques] = useState<IAutoComplete[]>([]);

  //todo: Custom Hooks
  const { callEndpoint } = useFetchAndLoad();

  //todo: Servicio para el catálogo tipo de remolque
  const loadTipoRemolques = getTipoRemolque();

  //todo: INITIAL FUNCTION
  //Se ejecuta una vez, cuando el componente se renderiza
  useEffect(() => {
    const catTipoRemolques = async () => {
      console.log("CAT- TIPO REMOLQUES");
      try {
        const result = await loadTipoRemolques.call;
        let info = result.data.data;
        let dataOkey = info.map( (item: ITipoRemolque) => (
          {
            id: item.id_TipoRemolque,
            label: item.st_ClaveRemolque + " - " + item.st_Descripcion
          }
        ));
        setTipoRemolques(dataOkey);
      } catch (error) { console.log(error)}
    }
    catTipoRemolques();
    return () => loadTipoRemolques.controller.abort();
  },[]);


  //todo: Servicio para obtener la información del remolque por su ID 
  const loadSpecificRemolque = getIdRemolque(id_Remolque);

  //todo: Funcion para Obtener remolque con Id
  const getRemolqueWithId = async () => {
    try {
      console.log("GET id Remolque");
      const result = await loadSpecificRemolque.call;
      const response =  result.data;
      setIdDocumento(response.data[0].id_Documento);
      const tempRemolque ={
        st_Marca: response.data[0].st_Marca, 
        id_TipoRemolque: response.data[0].id_TipoRemolque, 
        st_Economico: response.data[0].st_Economico, 
        st_Placa: response.data[0].st_Placa, 
        st_Anio: response.data[0].st_Anio, 
        st_NumSerie: response.data[0].st_NumSerie, 
        date_VigenciaFM: response.data[0].date_VigenciaFM, 
        id_Empresa: response.data[0].id_Empresa
      }
      getSelectTipoRemolque(tempRemolque.id_TipoRemolque);
      setRemolqueForm({...remolqueForm, ...tempRemolque});
    } catch (error) { console.log(error); }
  }

  //todo: Función para seleccionar
  const getSelectTipoRemolque = async (id: number) => {
    try {
      const result = await loadTipoRemolques.call;
      const response = result.data.data;
      // todo:  Adaptamos al modelo de Autocomplete
      let dataOkey = response.map( (item: ITipoRemolque) => ({
        id: item.id_TipoRemolque,
        label: item.st_ClaveRemolque + " - " + item.st_Descripcion
      }));
      let findOption = dataOkey.filter( (x: any) => x.id === id);
      setSelectTipoRemolque(findOption[0]);
    } catch (error) { console.log(error) }
  }

  useEffect( () => {
    if(id_Remolque.trim() !== ""){  getRemolqueWithId(); }
    return() => {loadSpecificRemolque.controller.abort()}
  },[id_Remolque]); 

  //todo: FUNCIONES PARA LA LÓGICA DEL FORMULARIO
  const onChangeRemolqueForm = ({ target: { name, value } }: handleChangeForm) => {
    setRemolqueForm({...remolqueForm, [name]: value});
  }

  const onChangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
    let selector = nameDocuments.filter( x => x === e.target.id);
    let sizeFile: any = e.target.files?.[0].size;
    let typeFile = e.target.files?.[0].type;
    if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
      setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
    }else{
      setDocumentos({...documentos, [selector[0]]: ''});
      alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
    }
  }

  const onChangeTipoRemolque = (arreglo: any) => {
    if(arreglo !== null){
      setSelectTipoRemolque( arreglo );
      tipoRemolques.forEach((alias) => {
        if(alias.id === arreglo.id){
          setRemolqueForm({...remolqueForm, id_TipoRemolque: arreglo.id});
        }
      });
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let result = null;
    let createrDocuments = null;
    let updaterDocuments = null;
    try {
      //todo: Damos de alta el proveedor
      result = await callEndpoint(createRemolque(remolqueForm));
      //todo: creamos el registro de los documentos del remolque
      createrDocuments = await callEndpoint(uploadFilesRemolque(documentos,result.data.data.id_Remolque));
      //todo: Actualizamos el registro de los documentos del remolque
      updaterDocuments = await callEndpoint(updateFilesRemolque(documentos, createrDocuments.data.data.id_Documento, result.data.data.id_Remolque));      
    } catch (error) { console.log(error); alert("Error, al crear el remolque")}
  }

  const onSubmitEdit =  async(e: any) => {
    e.preventDefault();
    let edit = null;
    let updateDocuments = null;
    try {
      //* Editamos la unidad
      edit = await callEndpoint(editRemolque(id_Remolque, remolqueForm));
      //* Actualizamos los archivos
      updateDocuments = await callEndpoint(updateFilesRemolque(documentos, idDocumento.toString(), id_Remolque));
    } catch (error) {
      alert("Error, al actualizar la unidad");
      console.log(error);
    }
  }

  return (
    <form className='form-horizontal'>
        <div className="form-body">
            <h4 className="card-title">Información del Remolque</h4>
            <hr></hr>
            <div className='row'>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <TextField id='st_Economico' className="form-control" variant="outlined" label="Eco"  type="text" name="st_Economico" onChange={onChangeRemolqueForm} value={remolqueForm.st_Economico || ''} inputProps={{ autoComplete: "off" }} required/>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <TextField id='st_Marca' className="form-control" variant="outlined" label="Marca"  type="text" name="st_Marca" onChange={onChangeRemolqueForm} value={remolqueForm.st_Marca || ''} inputProps={{ autoComplete: "off" }} required/>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <TextField id='st_Placa' className="form-control" variant="outlined" label="Placas"  type="text" name="st_Placa" onChange={onChangeRemolqueForm} value={remolqueForm.st_Placa || ''} inputProps={{ autoComplete: "off" }} required/>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <TextField id='st_Anio' className="form-control" variant="outlined" label="Año"  type="text" name="st_Anio" onChange={onChangeRemolqueForm} value={remolqueForm.st_Anio || ''} inputProps={{ autoComplete: "off" }} required/>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <TextField id='st_NumSerie' className="form-control" variant="outlined" label="Número de Serie"  type="text" name="st_NumSerie" onChange={onChangeRemolqueForm} value={remolqueForm.st_NumSerie || ''} inputProps={{ autoComplete: "off" }} required/>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <Autocomplete
                      id="id_TipoRemolque"
                      value={selectTipoRemolque}
                      options={tipoRemolques}
                      onChange={(option, value) => onChangeTipoRemolque(value)}
                      getOptionLabel={(option) => option.id + " - " + option.label}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => <TextField {...params} label="Tipo Remolques" variant="outlined" />}
                  />
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <TextField fullWidth id="date_VigenciaFM" name="date_VigenciaFM" label="Fecha de Ventimiento F. Mécanico" InputLabelProps={{ shrink: true }} type="date"  onChange={onChangeRemolqueForm} value={remolqueForm.date_VigenciaFM || ''}  inputProps={{ autoComplete: "off" }} required/>
                  </div>
                </div>
            </div>
            <h4 className="card-title mt-4">Documentación del Remolque</h4>
            <hr></hr>
            <div className="row">
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                  <div className="form-group">
                      <Button variant="contained" component="label" >Tarjeta Circulacion
                          <input id='url_TarjetaCirculacion'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
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
                          <input id='url_Factura'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
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
                        <input id='url_PermisoSCT' accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
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
              idDocumento !== 0 ? ( <ViewDocumentsRemolque id_Documento={idDocumento}/>) : void(0)
            }
            <div className="row mt-4">
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                  <div className="form-group">
                    <button onClick={(idDocumento === 0 && id_Remolque === '' ) ? onSubmit : onSubmitEdit}  className="btn btn-success btn-rounded btn-lg" type="button"><i className="fa fa-save"></i> { (idDocumento === 0 && id_Remolque === '' ) ? " Guardar" : " Editar"}</button>
                  </div>
                </div>
            </div>
        </div>
    </form>
  )
}

export default RemolqueForm