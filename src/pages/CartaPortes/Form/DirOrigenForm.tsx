import { ChangeEvent, Fragment, useState } from 'react'
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { getColoniasByCodigoPostal } from '../../../services/public.service';
import { IColonia } from '../../../models/shared/colonias.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

//todo: interfaz de Props
export interface Props {
  retornaOrigen: (info: ICartaPorteDirOrigenForm) => void,
  retornaVerOrigenes: (info: boolean) => void,
}

//todo: Arreglo para variables globales
let ArrOrigenEmpty = { id_Estado: null, id_Localidad: null, id_Municipio:  null, id_Colonia: null, st_Calle : '', st_NoExterior : '', st_NoInterior : 'S/N', st_RefDomicilio : '', st_RemitenteNombre : '', date_FechaSalida: null, st_RemitenteRFC : '', c_codigoPostal : '', TipoUbicacion: 'Origen'};
let FormHtmlDireccion = {st_Colonia: '', st_Municipio: '', st_Localidad:'', st_Estado: ''};
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

function DirOrigenForm({retornaOrigen, retornaVerOrigenes}: Props) {
  //todo: variables para catálogos
  const [colonias, setColinas] = useState<IAutoComplete[]>([]);
  const [selectColonia, setSelectColonia] = useState<any>(null);
  const [formDireccion, setFormDireccion] = useState(FormHtmlDireccion);

  //todo: Variabls principales
  const [origen, setOrigen] = useState<ICartaPorteDirOrigenForm>(ArrOrigenEmpty);

  //todo: conteno de cuantos origenes, destinos y servicios producto habrán en la carta porte
  const [countOrigenes, setCountOrigenes] = useState<number>(0);

  //todo: FUNCIONES PARA ORIGENES
  const onChangeOrigen = ({ target: { name, value } }: handleChangeForm) => {
    if(name === "c_codigoPostal"){
        setOrigen({ ...origen, [name]: value});
        let codigo_postal = value;
        if(codigo_postal.length === 5) findColonias(codigo_postal);
      }else{
        setOrigen({ ...origen, [name]: value});
      } 
    setOrigen({...origen, [name] : value});
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
        setFormDireccion(dataDireccionNull);
        
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
        setSelectColonia( arreglo );
        colonias.forEach((alias) => {
          if(alias.id === arreglo.id){
            setOrigen({...origen, id_Colonia : arreglo.id});
            setFormDireccion({...formDireccion, st_Colonia : alias.label});
          }
        });
      }
  }

  const guardarOrigen = (e: any) => {
    e.preventDefault();
    retornaOrigen(origen);
    setFormDireccion(FormHtmlDireccion);
    setOrigen(ArrOrigenEmpty)
    setCountOrigenes(countOrigenes + 1);
  }

  return (
    <Fragment>
      <h4 className="card-title mt-5">Origenes (registrados: {countOrigenes})</h4>
      <Button variant='contained' onClick={() => retornaVerOrigenes(true)} startIcon={<VisibilityIcon />} size='small'>Ver Origenes</Button>
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
                  id="id_Colonia"
                  value={selectColonia}
                  options={colonias}
                  onChange={(_option, value) => onChangeColoniaOrigen(value)}
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
                  <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia"  type="text" name="st_RefDomicilio" onChange={onChangeOrigen} value={origen.st_RefDomicilio || ''} inputProps={{ autoComplete: "off"}} required/>
              </div>
          </div>
          <div className="col-12 text-end">
              <Button variant='contained' color='success' onClick={guardarOrigen}>Guardar Origen</Button>
          </div>
      </div>
    </Fragment>
  )
}

export default DirOrigenForm