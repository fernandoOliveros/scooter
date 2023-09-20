import { ChangeEvent, Fragment, useState } from 'react'
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { getColoniasByCodigoPostal } from '../../../services/public.service';
import { IColonia } from '../../../models/shared/colonias.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

//todo: interfaz de Props
export interface Props {
  retornaDestino: (info: ICartaPorteDirDestinoForm) => void,
  retornaVerDestinos: (info: boolean) => void,
}

//TODO: variables globales
let ArrDestinoEmpty = { id_Estado: null, id_Localidad: null, id_Municipio: null, id_Colonia: null, c_codigoPostal: '', st_Calle: '', st_NoExterior: '', st_NoInterior: 'S/N', st_RefDomicilio: '', st_DestinatarioNombre: '', date_FechaLlegada: null, st_DestinatarioRFC: '', dec_DistRe: '', TipoUbicacion: 'Destino', DistanciaRecorrida: '', DistanciaRecorridaSpecified: false};
let FormHtmlDireccion = {st_Colonia: '', st_Municipio: '', st_Localidad:'', st_Estado: ''};
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

function DirDestinoForm({retornaDestino, retornaVerDestinos}: Props) {
//todo: variables para catálogos
  const [colonias, setColinas] = useState<IAutoComplete[]>([]);
  const [selectColonia, setSelectColonia] = useState<any>(null);
  const [formDireccion, setFormDireccion] = useState(FormHtmlDireccion);

  //todo: vairables fijas para llebnar los arreglos
  const [destino, setDestino] = useState<ICartaPorteDirDestinoForm>(ArrDestinoEmpty);

  //todo: conteno de cuantos origenes, destinos y servicios producto habrán en la carta porte
  const [countDestinos, setCountDestinos] = useState<number>(0);

  //todo: FUNCIONES PARA ORIGENES
  const onChangeDestino = ({ target: { name, value } }: handleChangeForm) => {
    if(name === "c_codigoPostal"){
      setDestino({ ...destino, [name]: value});
      let codigo_postal = value;
      if(codigo_postal.length === 5) findColonias(codigo_postal);
    }else{
      setDestino({ ...destino, [name]: value});
    }
    setDestino({...destino, [name] : value});
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
        st_Calle: destino.st_Calle,
        st_NoExterior: destino.st_NoExterior,
        st_NoInterior: destino.st_NoInterior,
        st_RefDomicilio: destino.st_RefDomicilio
      }
      setDestino({ ...destino, ...Direccion});
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
        st_Calle: destino.st_Calle,
        st_NoExterior: destino.st_NoExterior,
        st_NoInterior: destino.st_NoInterior,
        st_RefDomicilio: destino.st_RefDomicilio
      }
      setDestino({...destino, ...Direccion});
      alert("Ocurrio un error al obtener la información del código postal");
    }
  }

  const onChangeColonia = (arreglo: any) => {
      if(arreglo !== null){
        setSelectColonia( arreglo );
        colonias.forEach((alias) => {
          if(alias.id === arreglo.id){
            setDestino({...destino, id_Colonia : arreglo.id});
            setFormDireccion({...formDireccion, st_Colonia : alias.label});
          }
        });
      }
  }

  const guardarDireccion = (e: any) => {
    e.preventDefault();
    retornaDestino(destino);
    setDestino(ArrDestinoEmpty)
    setSelectColonia(null);
    setCountDestinos(countDestinos + 1);
  }

  return (
    <Fragment>
      <h4 className="card-title mt-5">Destinos (registrados: {countDestinos})</h4>
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
                  id="id_Colonia"
                  value={selectColonia}
                  options={colonias}
                  onChange={(_option, value) => onChangeColonia(value)}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} label="Colonia" variant="outlined" />}
              />
          </div>
          <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Municipio' className="form-control" variant="outlined" label="Municipio"  type="text" name="st_Municipio" InputLabelProps={{ shrink: true }} value={formDireccion.st_Municipio || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
              </div>
          </div>
          <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad"  type="text" name="st_Localidad" InputLabelProps={{ shrink: true }} value={formDireccion.st_Localidad || ''} inputProps={{ autoComplete: "off", readOnly:true }} required/>
              </div>
          </div>
          <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado"  type="text" name="st_Estado" value={formDireccion.st_Estado || ''} inputProps={{ autoComplete: "off", readOnly:true }} required InputLabelProps={{ shrink: true }}/>
              </div>
          </div>
          <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
              <div className="form-group">
                  <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia"  type="text" name="st_RefDomicilio" onChange={onChangeDestino} value={destino.st_RefDomicilio || ''} inputProps={{ autoComplete: "off"}} required/>
              </div>
          </div>
          <div className="col-12 text-end">
              <Button variant='contained' color='success' onClick={guardarDireccion}>Guardar Destino</Button>
          </div>
      </div>
    </Fragment>
  )
}

export default DirDestinoForm