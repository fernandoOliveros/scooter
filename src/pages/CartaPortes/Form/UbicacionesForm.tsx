import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { IColonia } from '../../../models/shared/colonias.model';
import { getColoniasByCodigoPostal, getMaterialesPeligrosos, getProductosServicio } from '../../../services/public.service';
import { Autocomplete, Button, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { ICartaPorteMaterialPeligroso } from '../../../models/cartaportes/cartaPorte-MaterialPeligro.model';

export interface Props{
    retornaUbicacion: (origen: ICartaPorteDirOrigenForm, destino: ICartaPorteDirDestinoForm) => void
}

//TODO: variables globales
let ArrDestinoEmpty = { id_Estado: null, id_Localidad: null, id_Municipio: null, id_Colonia: null, c_codigoPostal: '', st_Calle: '', st_NoExterior: '', st_NoInterior: 'S/N', st_RefDomicilio: '', st_DestinatarioNombre: '', date_FechaLlegada: null, st_DestinatarioRFC: '', dec_DistRe: '', TipoUbicacion: 'Destino', DistanciaRecorrida: '', DistanciaRecorridaSpecified: false};
let ArrOrigenEmpty = { id_Estado: null, id_Localidad: null, id_Municipio:  null, id_Colonia: null, st_Calle : '', st_NoExterior : '', st_NoInterior : 'S/N', st_RefDomicilio : '', st_RemitenteNombre : '', date_FechaSalida: null, st_RemitenteRFC : '', c_codigoPostal : '', TipoUbicacion: 'Origen'};
let FormHtmlDireccion = {st_Colonia: '', st_Municipio: '', st_Localidad:'', st_Estado: ''};
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
let productoServicioEmpty: ICartaPorteProductoServicioForm = {
    id_ClaveProducto: null,
    PesoEnKg: 1,
    Cantidad: 1,
    id_ClaveUnidadPeso:null,
    deci_ValoeUnitario: 1,
    MaterialPeligroso: 'No'
  }
  let productoPeligroso: ICartaPorteMaterialPeligroso = {
    id_MaterialesPeligrosos: null,
    id_TipoEmbalaje: null
  }


function UbicacionesForm({ retornaUbicacion }: Props) {
    //todo: variables para catálogos
    const [colonias, setColinas] = useState<IAutoComplete[]>([]);
    const [selectColoniaOr, setSelectColoniaOr] = useState<any>(null);
    const [formDireccionOr, setformDireccionOr] = useState(FormHtmlDireccion);
    const [selectColoniaDes, setselectColoniaDes] = useState<any>(null);
    const [formDireccionDes, setformDireccionDes] = useState(FormHtmlDireccion);

    //todo: vairables fijas para llebnar los arreglos
    const [destino, setDestino] = useState<ICartaPorteDirDestinoForm>(ArrDestinoEmpty);
    const [origen, setOrigen] = useState<ICartaPorteDirOrigenForm>(ArrOrigenEmpty);

    //todo: conteno de cuantos origenes, destinos y servicios producto habrán en la carta porte
    const [countDestinos, setCountDestinos] = useState<number>(0);
    const [countOrigenes, setCountOrigenes] = useState<number>(0);

    //todo: Variables globales
    const [opMatPeligroso, setOpMatPeligroso] = useState<boolean>(false);
    const [productoServicio, setProductoServicio] = useState<ICartaPorteProductoServicioForm>(productoServicioEmpty);
    const [matPeligroso, setMatPeligroso] = useState<ICartaPorteMaterialPeligroso>(productoPeligroso);

    //todo: variable para seleccionar el producto servicio
    const [selectProServicio, setSelectProServicio] = useState(null);
    const [selecMatPeligroso, setSelectMatPeligroso] = useState(null);

    //todo: Catálogos
    const [catProducServicio, setCatProducServicio] = useState<IAutoComplete[]>([]);
    const [carMatPeligroso, setCatMatPeligroso] = useState<IAutoComplete[]>([]);

    //todo: INITIAL FUNCTION
    useEffect(() => {

    //services
    const loadProductoServicio = getProductosServicio();
    const loadMatPeligroso = getMaterialesPeligrosos();

    //functions
    const _ProductosServicio = async () => {
        let result = await loadProductoServicio.call;
        if(result.data.success){
            let info = result.data.data;
            let cleanData = info.map( (item: any) => ({
                id: item.id_ClaveProdServCFDI,
                label: item.c_ClaveProdServ + " - " + item.Descripcion
            }));
            setCatProducServicio(cleanData);
        }
    }

    const _MaterialesPeligrosos = async () => {
        let result = await loadMatPeligroso.call;
        if(result.data.success){
        let info = result.data.data;
        let cleanData = info.map( (item: any) => ({
            id: item.id_MaterialesPeligrosos,
            label: item.c_MaterialesPeligrosos + " - " + item.st_descripcion
        }));
        setCatMatPeligroso(cleanData);
        }
    }

    //Call functions
    _ProductosServicio();
    _MaterialesPeligrosos();

    //destruimos la peticion si cambia de pantalla
    return () => {
        loadProductoServicio.controller.abort();
    }
    },[]);

    //todo: FUNCIONES PARA ORIGENES
    const onChangeOrigen = ({ target: { name, value } }: handleChangeForm) => {
        if(name === "c_codigoPostal"){
            setOrigen({ ...origen, [name]: value});
            let codigo_postal = value;
            if(codigo_postal.length === 5) findColoniasOrigen(codigo_postal);
        }else{
            setOrigen({ ...origen, [name]: value});
        } 
        setOrigen({...origen, [name] : value});
    }
    const findColoniasOrigen = async (codigoPostal : string) => {
        const serviceColonias = getColoniasByCodigoPostal(codigoPostal);
        try {
          const result = await serviceColonias.call;
          const response = result.data;
          setSelectColoniaOr(null); //Seteamos el valor de la colonia
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
          setformDireccionOr(formDireccion);
  
          //TODO: llenamos el form del backend
          let Direccion = {
            c_codigoPostal: response.data.c_codigoPostal,
            id_Municipio: response.data.id_Municipio,
            id_Localidad: response.data.id_Localidad,
            id_Estado: response.data.id_Estado,
            st_Calle: origen.st_Calle,
            st_NoExterior: origen.st_NoExterior,
            st_NoInterior: origen.st_NoInterior,
            st_RefDomicilio: origen.st_RefDomicilio
          }
          setOrigen({ ...origen, ...Direccion});
        } catch(error) {
          let dataDireccionNull = {
            st_Localidad : '',
            st_Municipio : '',
            st_Estado : '',
            st_Colonia: ''
          }
          setformDireccionOr(dataDireccionNull);
          
          let Direccion = {
            c_codigoPostal: '',
            id_Municipio: null,
            id_Localidad: null,
            id_Estado: null,
            id_Colonia: null,
            st_Calle: origen.st_Calle,
            st_NoExterior: origen.st_NoExterior,
            st_NoInterior: origen.st_NoInterior,
            st_RefDomicilio: origen.st_RefDomicilio
          }
          setOrigen({...origen, ...Direccion});
          alert("Ocurrio un error al obtener la información del código postal");
        }
    }
    const onChangeColoniaOrigen = (arreglo: any) => {
        if(arreglo !== null){
          setSelectColoniaOr( arreglo );
          colonias.forEach((alias) => {
            if(alias.id === arreglo.id){
              setOrigen({...origen, id_Colonia : arreglo.id});
              setformDireccionOr({...formDireccionOr, st_Colonia : alias.label});
            }
          });
        }
    }
  
    //todo: FUNCIONES PARA DESTINOS
    const onChangeDestino = ({ target: { name, value } }: handleChangeForm) => {
        if(name === "c_codigoPostal"){
        setDestino({ ...destino, [name]: value});
        let codigo_postal = value;
        if(codigo_postal.length === 5) findColoniasDestino(codigo_postal);
        }else{
        setDestino({ ...destino, [name]: value});
        }
        setDestino({...destino, [name] : value});
    }
    const findColoniasDestino = async (codigoPostal : string) => {
        const serviceColonias = getColoniasByCodigoPostal(codigoPostal);
        try {
        const result = await serviceColonias.call;
            const response = result.data;
            setselectColoniaDes(null); //Seteamos el valor de la colonia
            let dataOkey = response.data.dataColonias.map( (item: IColonia) => ({
                id: item.id_colonia,
                label: item.st_Colonia
            }));
            setColinas(dataOkey);
            let formDireccionDes = {
                st_Localidad : response.data.st_Localidad,
                st_Municipio : response.data.st_Municipio,
                st_Estado : response.data.c_Estado,
                st_Colonia: ''
            }
            setformDireccionDes(formDireccionDes);

            //TODO: llenamos el form del backend
            let Direccion = {
                c_codigoPostal: response.data.c_codigoPostal,
                id_Municipio: response.data.id_Municipio,
                id_Localidad: response.data.id_Localidad,
                id_Estado: response.data.id_Estado,
                st_Calle: destino.st_Calle,
                st_NoExterior: destino.st_NoExterior,
                st_NoInterior: destino.st_NoInterior,
                st_RefDomicilio: destino.st_RefDomicilio
            }
            setDestino({ ...destino, ...Direccion});
        } catch(error) {
            // vaciamos los campos readonly
            let dataDireccionNull = {
                st_Localidad : '',
                st_Municipio : '',
                st_Estado : '',
                st_Colonia: ''
            }
            setformDireccionDes(dataDireccionNull);
            let Direccion = {
            c_codigoPostal: '',
            id_Municipio: null,
            id_Localidad: null,
            id_Estado: null,
            id_Colonia: null,
            st_Calle: destino.st_Calle,
            st_NoExterior: destino.st_NoExterior,
            st_NoInterior: destino.st_NoInterior,
            st_RefDomicilio: destino.st_RefDomicilio
            }
            setDestino({...destino, ...Direccion});
            alert("Ocurrio un error al obtener la información del código postal");
        }
    }
    const onChangeColoniaDestino = (arreglo: any) => {
        if(arreglo !== null){
          setselectColoniaDes( arreglo );
          colonias.forEach((alias) => {
            if(alias.id === arreglo.id){
              setDestino({...destino, id_Colonia : arreglo.id});
              setformDireccionDes({...formDireccionDes, st_Colonia : alias.label});
            }
          });
        }else{
            setselectColoniaDes( null );
        }
    }


    //todo: funciones para seleccionar productos servicio y (si existe) material peligroso
    const onChangeProducto = (item: any) => {
        if(item !== null){
            setSelectProServicio( item );
            catProducServicio.forEach(element => {
                if(element.id === item.id){
                    setProductoServicio({...productoServicio, id_ClaveProducto: element.id});
                }
            });
        }
    }


    const validateOrigenDestino = () => {
        console.log("validamos el origen y el destino");
        retornaUbicacion(origen, destino);
    }

    return (
        <Fragment>
            {/* ORIGENES */}
            <h4 className="card-title">Origenes (registrados: {countOrigenes})</h4>
            <Button variant='contained' startIcon={<VisibilityIcon />} size='small'>Ver Origenes</Button>
            <hr></hr>
            <div className='row'>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RemitenteNombre' className="form-control" variant="outlined" label="Nombre remitente"  type="text" name="st_RemitenteNombre" onChange={onChangeOrigen} value={origen.st_RemitenteNombre || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RemitenteRFC' className="form-control" variant="outlined" label="RFC remitente"  type="text" name="st_RemitenteRFC" onChange={onChangeOrigen} value={origen.st_RemitenteRFC || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id='date_FechaSalida' className="form-control" variant="outlined" label="Fecha de salida" InputLabelProps={{ shrink: true }}  type="datetime-local" name="date_FechaSalida" onChange={onChangeOrigen} value={origen.date_FechaSalida || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Calle' className="form-control" variant="outlined" label="Calle"  type="text" name="st_Calle" onChange={onChangeOrigen} value={origen.st_Calle || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NoExterior' className="form-control" variant="outlined" label="Número Exterior"  type="text" name="st_NoExterior" onChange={onChangeOrigen} value={origen.st_NoExterior || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NoInterior' className="form-control" variant="outlined" label="Número Interior"  type="text" name="st_NoInterior" onChange={onChangeOrigen} value={origen.st_NoInterior || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='c_codigoPostal' className="form-control" variant="outlined" label="Código Postal"  type="text" name="c_codigoPostal" onChange={onChangeOrigen} value={origen.c_codigoPostal || ''} inputProps={{ autoComplete: "off", maxLength:"5" }} required InputLabelProps={{ shrink: true }}/>
                    </div>
                </div>
                <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
                    <Autocomplete
                        id="idColoniaOrigen"
                        value={selectColoniaOr}
                        options={colonias}
                        onChange={(_option, value) => onChangeColoniaOrigen(value)}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Colonia" variant="outlined" />}
                    />
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Municipio' className="form-control" variant="outlined" label="Municipio"  type="text" name="st_Municipio" InputLabelProps={{ shrink: true }} value={formDireccionOr.st_Municipio || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad"  type="text" name="st_Localidad" InputLabelProps={{ shrink: true }} value={formDireccionOr.st_Localidad || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado"  type="text" name="st_Estado" value={formDireccionOr.st_Estado || ''} inputProps={{ autoComplete: "off", readOnly:true }} required InputLabelProps={{ shrink: true }}/>
                    </div>
                </div>
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia"  type="text" name="st_RefDomicilio" onChange={onChangeOrigen} value={origen.st_RefDomicilio || ''} inputProps={{ autoComplete: "off"}} required/>
                    </div>
                </div>
            </div>

            {/* DESTINOS */}
            <h4 className="card-title">Destinos (registrados: {countDestinos})</h4>
            <Button variant='contained' startIcon={<VisibilityIcon />} size='small'>Mostrar destinos</Button>
            <hr></hr>
            <div className='row'>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Remitenst_DestinatarioNombreteNombre' className="form-control" variant="outlined" label="Nombre Destinatario"  type="text" name="st_DestinatarioNombre" onChange={onChangeDestino} value={destino.st_DestinatarioNombre || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_DestinatarioRFC' className="form-control" variant="outlined" label="RFC destinatario"  type="text" name="st_DestinatarioRFC" onChange={onChangeDestino} value={destino.st_DestinatarioRFC || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                    <TextField fullWidth id='dec_DistRe' className="form-control" variant="outlined" label="Distancia Recorrida" type="text" name="dec_DistRe" onChange={onChangeDestino} value={destino.dec_DistRe || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id='date_FechaLlegada' className="form-control" variant="outlined" label="Fecha de llegada" InputLabelProps={{ shrink: true }}  type="datetime-local" name="date_FechaLlegada" onChange={onChangeDestino} value={destino.date_FechaLlegada || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Calle' className="form-control" variant="outlined" label="Calle"  type="text" name="st_Calle" onChange={onChangeDestino} value={destino.st_Calle || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NoExterior' className="form-control" variant="outlined" label="Número Exterior"  type="text" name="st_NoExterior" onChange={onChangeDestino} value={destino.st_NoExterior || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NoInterior' className="form-control" variant="outlined" label="Número Interior"  type="text" name="st_NoInterior" onChange={onChangeDestino} value={destino.st_NoInterior || ''} inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='c_codigoPostal' className="form-control" variant="outlined" label="Código Postal"  type="text" name="c_codigoPostal" onChange={onChangeDestino} value={destino.c_codigoPostal || ''} inputProps={{ autoComplete: "off", maxLength:"5" }} required InputLabelProps={{ shrink: true }}/>
                    </div>
                </div>
                <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
                    <Autocomplete
                        id="idColoniaDestino"
                        value={selectColoniaDes}
                        options={colonias}
                        onChange={(_option, value) => onChangeColoniaDestino(value)}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Colonia" variant="outlined" />}
                    />
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Municipio' className="form-control" variant="outlined" label="Municipio"  type="text" name="st_Municipio" InputLabelProps={{ shrink: true }} value={formDireccionDes.st_Municipio || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad"  type="text" name="st_Localidad" InputLabelProps={{ shrink: true }} value={formDireccionDes.st_Localidad || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado"  type="text" name="st_Estado" value={formDireccionDes.st_Estado || ''} inputProps={{ autoComplete: "off", readOnly:true }} required InputLabelProps={{ shrink: true }}/>
                    </div>
                </div>
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia"  type="text" name="st_RefDomicilio" onChange={onChangeDestino} value={destino.st_RefDomicilio || ''} inputProps={{ autoComplete: "off"}} required/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 text-end">
                    <Button variant='contained' color='success' onClick={validateOrigenDestino}>Guardar</Button>
                </div>
            </div>
        </Fragment>
    )
}

export default UbicacionesForm