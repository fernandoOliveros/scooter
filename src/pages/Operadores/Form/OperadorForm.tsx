import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { IOperadorForm } from '../../../models/operadores/operador-form.model';
import { IOperadorDocumentos } from '../../../models/operadores/operador-docs.model';
import { IOperadorDireccion } from '../../../models/operadores/operador-direccion.model';
import { IOperadorTelefono } from '../../../models/operadores/operador-telefono.model';
import { IOperadorContactos } from '../../../models/operadores/operador-contactos.model';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { getColoniasByCodigoPostal } from '../../../services/public.service';
import { IColonia } from '../../../models/shared/colonias.model';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { createOperador, getContactoOperador, getDireccionOperador, getIdOperador, getTelefonoOperador, insertContacto, insertDireccion, insertTelefono, updateContactoOperador, updateDireccionOperador, updateFilesOperador, updateOperador, updateTelefonoOperador, uploadFilesOperador } from '../../../services/operadores/operadores.service';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import ViewDocumentsOperador from '../Documents/ViewDocumentsOperador';

// todo: VARIABLES GLOBALES
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
const MAX_FILE_SIZE = 5002400;
const DocumentosOeprador = ["url_CURP", "url_RFC", "url_ComprobanteDom"];

//todo: interfaz de Props
export interface Props {
  id_Operador?: string,
  returnFormUnidad?: (success: boolean) => void
}

const OperadorForm = ({id_Operador = ''}) =>{
  console.log("render operador form");
  //todo: Store
  const userState = useSelector((store: RootStore) => store.user);
  const id_Empresa = userState.user.id_Empresa;

  //todo: Custom Hooks
  const { callEndpoint } = useFetchAndLoad();
  
  //todo: Variables Globales
  const [operadorForm, setOperadorForm] = useState<IOperadorForm>({id_Empresa: id_Empresa, st_Nombre: '', st_ApellidoP: '', st_ApellidoM: '', st_NumIMSS: '', st_CURP: '', st_RFC: '', st_NumLicencia: '', date_Nacimiento: null, date_LicenciaVigencia: null, id_TipoPuesto: null, i_Status: 1});
  const [documentos, setDocumentos] = useState<IOperadorDocumentos>({url_RFC: '', url_CURP: '', url_ComprobanteDom: ''});
  const [direccion, setDireccion]= useState<IOperadorDireccion>({id_Operador: null, st_Calle:'', st_NoExterior: '', st_NoInterior:'S/N', st_RefDomicilio:'', c_codigoPostal: '', id_Estado: null, id_Localidad: null, id_Municipio: null, id_Colonia: null});
  const [telefono, setTelefono] = useState<IOperadorTelefono>({id_Operador: null, id_Categoria: 2, st_NumTelefono: ''});
  const [contacto, setContacto] = useState<IOperadorContactos>({id_Operador: null, st_Nombre:'', st_NumTelefono:'', st_Parentesco:''});
  const [colonias, setColinas] = useState<IAutoComplete[]>([]);
  const [selectColonia, setSelectColonia] = useState<any>(null);
  const [formDireccion, setFormDireccion] = useState({st_Colonia: '', st_Municipio: '', st_Localidad:'', st_Estado: ''});

  //todo: VARIABLES GLOBALES PARA 
  const [idDocumento, setIdDocumento] = useState<number>(0);
  const [id_Dir_Operador, setId_Dir_Operador] = useState<number>(0);
  const [id_ContactoEm, setId_ContactoEm] = useState<number>(0);
  const [id_NumTelefono, setId_NumTelefono] = useState<number>(0);

  //todo: INITIAL FUNCTION
  useEffect( () => {
    console.log("useffect with operador");

    const loadEspecificOperador = getIdOperador(id_Operador);
    const getOperadorWithId = async () => {
      console.log("Obtener Info de un Operador Especifico");
      try {
        const result = await loadEspecificOperador.call;
        let response = result.data;
        const dataOperador = response.data[0];
        const validate = validateSameEmpresa(dataOperador.id_Empresa);
        if(validate){
          setIdDocumento(dataOperador.id_Documento);
          let tempOperadorForm = {
            id_Empresa: dataOperador.id_Empresa , 
            st_Nombre: dataOperador.st_Nombre, 
            st_ApellidoP: dataOperador.st_ApellidoP, 
            st_ApellidoM: dataOperador.st_ApellidoM, 
            st_NumIMSS: dataOperador.st_NumIMSS, 
            st_CURP: dataOperador.st_CURP, 
            st_RFC: dataOperador.st_RFC, 
            st_NumLicencia: dataOperador.st_NumLicencia, 
            date_Nacimiento: dataOperador.date_Nacimiento, 
            date_LicenciaVigencia: dataOperador.date_LicenciaVigencia, 
            id_TipoPuesto: dataOperador.id_TipoPuesto,
            i_Status: dataOperador.i_Status
          };
          setOperadorForm({...operadorForm, ...tempOperadorForm});
        }else{
          alert("El operador no pertenece a su empresa.");
          console.log("Error, no pertenece el operador a la empresa");
        }
      } catch (error) {
        alert("Error- al obtener información del operador");
        console.log(error);
      }
    }

    //todo: SERVICE LOAD DIRECCION OPERADOR WIDTH ID
    const loadDireccion = getDireccionOperador(id_Operador);
    const getDireccionOperadorId = async() => {
      console.log("OBTENER LA DIRECCIÓN DEL OPERADOR");
      try {
        let result = await loadDireccion.call;
        let response = result.data;
        
        //* Asignamos el id dirección del operador
        setId_Dir_Operador(response.data.id_Dir_Operador);
        let tempDirec = {
          id_Operador: response.data.id_Operador,
          st_Calle: response.data.st_Calle, 
          st_NoExterior: response.data.st_NoExterior, 
          st_NoInterior: response.data.st_NoInterior, 
          st_RefDomicilio: response.data.st_RefDomicilio, 
          c_codigoPostal: response.data.c_codigoPostal, 
          id_Estado: response.data.id_Estado, 
          id_Localidad: response.data.id_Localidad, 
          id_Municipio: response.data.id_Municipio, 
          id_Colonia: response.data.id_Colonia
        }
        setDireccion({...direccion, ...tempDirec});

        //* llenamos los campos del formulario de dirección
        let FormDire = {
          st_Colonia:  '', 
          st_Municipio:  response.data.st_Municipio, 
          st_Localidad: response.data.st_Localidad, 
          st_Estado:  response.data.st_Estado
        }
        setFormDireccion({...formDireccion, ...FormDire});

        //* Seleccionamos la colonia
        let tempColonia: IAutoComplete = {
          id: response.data.id_Colonia, 
          label: response.data.st_Colonia
        };
        setSelectColonia(tempColonia);      
      } catch (error) {
        alert("Error, al obtener la dirección del operador");
        console.log(error);
      }
    }

    //todo: SERVICE TO LOAD TELEFONOS WITH ID OPERADOR
    const loadSpecificTelefono = getTelefonoOperador(id_Operador);
    const getOperadorTelefono = async () => {
      console.log("Obtener el telefono del operador");
      try {
        const result = await loadSpecificTelefono.call;
        const response = result.data;
        setId_NumTelefono(response.data.id_NumTelefono);
        let TelefonoTemp = {
          id_Operador: response.data.id_Operador, 
          id_Categoria:response.data.id_Categoria, 
          st_NumTelefono: response.data.st_NumTelefono
        }
        setTelefono({...telefono, ...TelefonoTemp});
      } catch (error) {
        alert("Error, al obtener el telefono del operador");
        console.log(error);
      }
    }

    //todo: SERVICE TO LOAD CONTACTO DE EMERGENCIA WITH ID OPERADOR
    const loadContactEmergency = getContactoOperador(id_Operador);
    const getContactoOperadorId = async() => {
      console.log("Obtener contacto del operador");
      try {
        let result = await loadContactEmergency.call;
        let response = result.data;
        setId_ContactoEm( response.data.id_ContactoEm);
        let ContactosEmer = {
          id_Operador: response.data.id_Operador, 
          st_Nombre: response.data.st_Nombre, 
          st_NumTelefono: response.data.st_NumTelefono, 
          st_Parentesco: response.data.st_Parentesco
        }
        setContacto({...contacto, ...ContactosEmer});
      } catch (error) {
        alert("Error, no se pudo obtener el contacto del operador");
        console.log(error);
      }

    }

    if(id_Operador !== ''){
      getOperadorWithId();
      getDireccionOperadorId();
      getOperadorTelefono();
      getContactoOperadorId();
    }
    return() => {
      if(id_Operador !== ''){ 
        loadEspecificOperador.controller.abort(); 
        loadDireccion.controller.abort();
        loadSpecificTelefono.controller.abort();
        loadContactEmergency.controller.abort();
      } 
    }
  },[id_Operador]);

  const validateSameEmpresa = (idEmpresa : number) => {
    if(id_Empresa === idEmpresa)
      return true;
    else
      return false;
  }

  //todo: fORM FUNCTIONS
  const onChangeOperador = ({ target: { name, value } }: handleChangeForm) => {
    setOperadorForm({...operadorForm, [name] : value});
  }

  const onChangeTelefono = ({ target: { name, value } }: handleChangeForm) => {
    setTelefono({...telefono, [name] : value});
  }

  const onChangeContacto = ({ target: { name, value } }: handleChangeForm) => { 
    setContacto({...contacto, [name] : value}); 
  }

  const onChangePuesto = (e: any) => {
    setOperadorForm({...operadorForm, id_TipoPuesto : e.target.value});
  }

  const onChangeDireccion = ({ target: { name, value } }: handleChangeForm) => {
    if(name === "c_codigoPostal"){
      setDireccion({ ...direccion, [name]: value});
      let codigo_postal = value;
      if(codigo_postal.length === 5)
        findColonias(codigo_postal);
    }else{
      setDireccion({ ...direccion, [name]: value});
    } 
  }

  const findColonias = async (codigoPostal : string) => {
    const serviceColonias = getColoniasByCodigoPostal(codigoPostal);
    try {
      const result = await serviceColonias.call;
      const response = result.data;
      setSelectColonia(null); //Seteamos el valor de la colonia
      let dataOkey = response.data.dataColonias.map( (item: IColonia) => ({
        id: item.id_colonia,
        label: item.st_Colonia
      }));
      setColinas(dataOkey);

      //TODO: llenamos el formulario del usuario
      let formDireccion = {
        st_Localidad : response.data.st_Localidad,
        st_Municipio : response.data.st_Municipio,
        st_Estado : response.data.c_Estado,
        st_Colonia: ''
      }
      setFormDireccion(formDireccion);

      //TODO: llenamos el form del backend
      let Direccion = {
        c_codigoPostal: response.data.c_codigoPostal,
        id_Municipio: response.data.id_Municipio,
        id_Localidad: response.data.id_Localidad,
        id_Estado: response.data.id_Estado,
        st_Calle: direccion.st_Calle,
        st_NoExterior: direccion.st_NoExterior,
        st_NoInterior: direccion.st_NoInterior,
        st_RefDomicilio: direccion.st_RefDomicilio
      }
      setDireccion({ ...direccion, ...Direccion});
    } catch(error) {
      let dataDireccionNull = {
        st_Localidad : '',
        st_Municipio : '',
        st_Estado : '',
        st_Colonia: ''
      }
      setFormDireccion(dataDireccionNull);
      
      let Direccion = {
        c_codigoPostal: '',
        id_Municipio: null,
        id_Localidad: null,
        id_Estado: null,
        id_Colonia: null,
        st_Calle: direccion.st_Calle,
        st_NoExterior: direccion.st_NoExterior,
        st_NoInterior: direccion.st_NoInterior,
        st_RefDomicilio: direccion.st_RefDomicilio
      }
      setDireccion({...direccion, ...Direccion});
      alert("Ocurrio un error al obtener la información del código postal");
    }
  }

  const onChangeColonia = (arreglo: any) => {
    if(arreglo !== null){
      setSelectColonia( arreglo );
      colonias.forEach((alias) => {
        if(alias.id === arreglo.id){
          setDireccion({...direccion, id_Colonia : arreglo.id});
          setFormDireccion({...formDireccion, st_Colonia : alias.label});
        }
      });
    }
  }

  const onChangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
    let selector = DocumentosOeprador.filter( x => x === e.target.id);
    let sizeFile: any = e.target.files?.[0].size;
    let typeFile = e.target.files?.[0].type;
    if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
      setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
    }else{
      setDocumentos({...documentos, [selector[0]]: ''});
      alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
    }
  }

  const HandleSubmit = async (e: any) => {
    e.preventDefault();
    let createrOperador = null;
    let createrDocuments = null;
    let updaterDocuments = null;
    let createrTelefono = null;
    let createrDireccion = null;
    let createrContacto = null;
    try {
      //todo: Creamos el registro del operador
      createrOperador = await callEndpoint(createOperador(operadorForm));
      console.log(createrOperador.data);
      let id_OperadorTemp = createrOperador.data.data.id_Operador;

      //todo: ID DLE OPERADOR CORRECTO?
      if(id_OperadorTemp !== '' || id_OperadorTemp !== null || id_OperadorTemp !== undefined){
        //todo: LLENAMOS TODOS LOS ARREGLO CON EL ID_OPERADOR DEL API
        setDireccion({...direccion, id_Operador: id_OperadorTemp});
        setTelefono({...telefono, id_Operador: id_OperadorTemp});
        setContacto({...contacto, id_Operador: id_OperadorTemp});

        //todo: INSERT DE DIRECCION, TELEFONO, CONTACTO DE EMERGENCIA
        createrDireccion = await callEndpoint(insertDireccion(direccion));
        createrTelefono = await callEndpoint(insertTelefono(telefono));
        createrContacto = await callEndpoint(insertContacto(contacto));
        console.log(createrDireccion.data);
        console.log(createrTelefono.data);
        console.log(createrContacto.data);

        //todo: CREAMOS EL REGISTRO DE LOS DOCUMENTOS
        createrDocuments = await callEndpoint(uploadFilesOperador(documentos, id_OperadorTemp));
        console.log(createrDocuments.data);

        //todo: ACTUALIZAMOS EL REGISTRO DE LOS DOCUMENTOS
        let DocumentoId = createrDocuments.data.data.id_Documento;
        updaterDocuments = await callEndpoint(updateFilesOperador(documentos, DocumentoId, id_OperadorTemp));
        console.log(updaterDocuments.data);
      }else{
        alert("No se pudo crear el operador (Falta el id retorno del API)");
      }
    } catch (error) {
      alert("Error - al crear el operador");
      console.log(error);
    }
  }

  const HandleEditSubmit = async (e: any) => {
    e.preventDefault();
    let updaterOperador = null;
    let updaterDocuments = null;
    let updaterTelefono = null;
    let updaterDireccion = null;
    let updaterContacto = null;

    try {
      //todo: ACTUALIZAMOS DATOS GENERALES DEL OPERADOR
      updaterOperador = await callEndpoint(updateOperador(operadorForm, id_Operador));
      console.log(updaterOperador);

      //todo: ACTUALIZAMOS TELEFONO
      updaterTelefono = await callEndpoint(updateTelefonoOperador(telefono, id_NumTelefono.toString()));
      console.log(updaterTelefono);

      //todo: ACTUALIZAMOS CONTACTOS
      updaterContacto = await callEndpoint(updateContactoOperador(contacto, id_ContactoEm.toString()));
      console.log(updaterContacto);

      //todo: ACTULIZAMOS DIRECIÓN
      updaterDireccion = await callEndpoint(updateDireccionOperador(direccion, id_Dir_Operador.toString()));
      console.log(updaterDireccion);

      //todo: ACTUALIZAMOS DOCUMENTOACIÓN
      if(documentos.url_CURP !== '' || documentos.url_ComprobanteDom !== '' || documentos.url_RFC !== ''){
        updaterDocuments = await callEndpoint(updateFilesOperador(documentos, idDocumento.toString(), id_Operador));
        console.log(updaterDocuments);
      }
    } catch (error) {
      alert("Error, al actualizar los datos del operador")
      console.log(error);
    }
  }

  return (
    <Fragment>
      <form className='form-horizontal'>
        <div className="form-body">
            <h4 className="card-title">Información del Operador</h4>
            <hr></hr>
            <div className='row'>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Nombre' className="form-control" variant="outlined" label="Nombre"  type="text" name="st_Nombre" onChange={onChangeOperador} value={operadorForm.st_Nombre || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_ApellidoP' className="form-control" variant="outlined" label="Apellido Paterno"  type="text" name="st_ApellidoP" onChange={onChangeOperador} value={operadorForm.st_ApellidoP || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_ApellidoM' className="form-control" variant="outlined" label="Apellido Materno"  type="text" name="st_ApellidoM" onChange={onChangeOperador} value={operadorForm.st_ApellidoM || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumIMSS' className="form-control" variant="outlined" label="Número de seguro social"  type="text" name="st_NumIMSS" onChange={onChangeOperador} value={operadorForm.st_NumIMSS || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_CURP' className="form-control" variant="outlined" label="CURP"  type="text" name="st_CURP" onChange={onChangeOperador} value={operadorForm.st_CURP || ''} inputProps={{ autoComplete: "off", maxLength:"18" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RFC' className="form-control" variant="outlined" label="RFC"  type="text" name="st_RFC" onChange={onChangeOperador} value={operadorForm.st_RFC || ''} inputProps={{ autoComplete: "off", maxLength:"13" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumLicencia' className="form-control" variant="outlined" label="Número de Licencia"  type="text" name="st_NumLicencia" onChange={onChangeOperador} value={operadorForm.st_NumLicencia || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumTelefono' className="form-control" variant="outlined" label="Celular"  type="text" name="st_NumTelefono" onChange={onChangeTelefono} value={telefono.st_NumTelefono || ''} inputProps={{ autoComplete: "off", maxLength:"10" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                    <FormControl fullWidth>
                        <InputLabel id="seleccionPuesto">Tipo de Puesto</InputLabel>
                        <Select labelId="seleccionPuesto" id="id_TipoPuesto" value={operadorForm.id_TipoPuesto || ''} label="Tipo de Puesto" onChange={onChangePuesto}>
                            <MenuItem value={1}>Auxiliar</MenuItem>
                            <MenuItem value={2}>Operador de Camión</MenuItem>
                        </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id="date_LicenciaVigencia" name="date_LicenciaVigencia" label="Vigencia de la Licencia" InputLabelProps={{ shrink: true }} type="date" onChange={onChangeOperador} value={operadorForm.date_LicenciaVigencia || ''}  inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id="date_Nacimiento" name="date_Nacimiento" label="Fecha de Nacimiento" InputLabelProps={{ shrink: true }} type="date" onChange={onChangeOperador} value={operadorForm.date_Nacimiento || ''}  inputProps={{ autoComplete: "off"}} required/>
                    </div>
                </div>
            </div>
            <h4 className="card-title mt-4">Dirección del Operador</h4>
            <hr></hr>
            <div className='row'>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Calle' className="form-control" variant="outlined" label="Calle"  type="text" name="st_Calle" onChange={onChangeDireccion} value={direccion.st_Calle || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NoExterior' className="form-control" variant="outlined" label="Número Exterior"  type="text" name="st_NoExterior" onChange={onChangeDireccion} value={direccion.st_NoExterior || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NoInterior' className="form-control" variant="outlined" label="Número Interior"  type="text" name="st_NoInterior" onChange={onChangeDireccion} value={direccion.st_NoInterior || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='c_codigoPostal' className="form-control" variant="outlined" label="Código Postal"  type="text" name="c_codigoPostal" onChange={onChangeDireccion} value={direccion.c_codigoPostal || ''} inputProps={{ autoComplete: "off", maxLength:"5" }} required InputLabelProps={{ shrink: true }}/>
                    </div>
                </div>
                <div className="col-md-3 col-lg-4 col-sm-12 col-xs-12">
                    <Autocomplete
                        id="id_Colonia"
                        value={selectColonia}
                        options={colonias}
                        onChange={(_option, value) => onChangeColonia(value)}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Colonia" variant="outlined" />}
                    />
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Municipio' className="form-control" variant="outlined" label="Municipio"  type="text" name="st_Municipio" InputLabelProps={{ shrink: true }} value={formDireccion.st_Municipio || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad"  type="text" name="st_Localidad" InputLabelProps={{ shrink: true }} value={formDireccion.st_Localidad || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado"  type="text" name="st_Estado" value={formDireccion.st_Estado || ''} inputProps={{ autoComplete: "off", readOnly:true }} required InputLabelProps={{ shrink: true }}/>
                    </div>
                </div>
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia"  type="text" name="st_RefDomicilio" onChange={onChangeDireccion} value={direccion.st_RefDomicilio || ''} inputProps={{ autoComplete: "off"}} required/>
                    </div>
                </div>
            </div>
            <h4 className='card-title mt-4'>Contacto de Emergencia</h4>
            <hr></hr>
            <div className='row'>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Nombre' className="form-control" variant="outlined" label="Nombre completo"  type="text" name="st_Nombre" onChange={onChangeContacto} value={contacto.st_Nombre || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumTelefono' className="form-control" variant="outlined" label="Celular"  type="text" name="st_NumTelefono" onChange={onChangeContacto} value={contacto.st_NumTelefono || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Parentesco' className="form-control" variant="outlined" label="Parentesco"  type="text" name="st_Parentesco" onChange={onChangeContacto} value={contacto.st_Parentesco || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
            </div>
            <h4 className="card-title mt-4">Documentación del Operador</h4>
            <hr></hr>
            <div className="row">
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                    <div className="form-group">
                        <Button variant="contained" component="label" >RFC
                            <input id='url_RFC'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                        </Button>
                        {
                          documentos.url_RFC === '' ? 
                          (
                            <p className="card-title" >Sube el archivo correspondiente - al RFC</p>
                          ) : <p className="card-title text-success">Archivo aceptado</p>
                        }
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                    <div className="form-group">
                        <Button variant="contained" component="label" >CURP
                            <input id='url_CURP'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                        </Button>
                        {
                          documentos.url_CURP === '' ? 
                          (
                            <p className="card-title" >Sube el archivo correspondiente - CURP</p>
                          ) : <p className="card-title text-success">Archivo aceptado</p>
                        }
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                    <div className="form-group">
                        <Button variant="contained" component="label" >Comprobante Domicilio
                            <input id='url_ComprobanteDom' accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                        </Button>
                        {
                          documentos.url_ComprobanteDom === '' ? 
                          (
                            <p className="card-title" >Sube el archivo correspondiente - Comprobante de domicilio</p>
                          ) : <p className="card-title text-success">Archivo aceptado</p>
                        }
                    </div>
                </div>
            </div>
            {
              idDocumento !== 0 ? ( <ViewDocumentsOperador id_Documento={idDocumento}/>) : void(0)
            }
            <div className="row mt-4">
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="form-group">
                      <button onClick={(idDocumento === 0 && id_Operador === '' ) ? HandleSubmit : HandleEditSubmit} className="btn btn-success" type="button"><i className="fa fa-save">  </i> 
                          { (idDocumento === 0 && id_Operador === '' ) ? " Guardar" : " Editar"}
                      </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    </Fragment>
  )
}

export default OperadorForm