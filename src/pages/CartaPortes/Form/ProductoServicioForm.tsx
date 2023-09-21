import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { ICartaPorteMaterialPeligroso } from '../../../models/cartaportes/cartaPorte-MaterialPeligro.model';
import { getEmbalajesCP, getMaterialesPeligrosos, getProductoCPLike, getUnidadPesoCP } from '../../../services/public.service';
import { Autocomplete, Button, FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IEmbalaje, IMaterialPeligroso, IProductosServicios, IUnidadPeso } from '../../../models/cartaportes/cartaPorte.model';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import Swal from 'sweetalert2';

export interface Props {
  retornaProducto: (producto: ICartaPorteProductoServicioForm) => void
}

//todo: json iniciales
let productoServicioEmpty: ICartaPorteProductoServicioForm = {
  id_ClaveProducto: null,
  PesoEnKg: 1,
  Cantidad: 1,
  id_ClaveUnidadPeso:null,
  deci_ValoeUnitario: 1,
  MaterialPeligroso: 'No',
  id_MaterialesPeligrosos: null,
  id_TipoEmbalaje: null
}
let productoPeligrosoEmpty: ICartaPorteMaterialPeligroso = {
  id_MaterialesPeligrosos: null,
  id_TipoEmbalaje: null
}

type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

function ProductoServicioForm({retornaProducto}: Props) {
  const { callEndpoint } = useFetchAndLoad(); //Custom Hooks to control http request

  //todo: Variables globales
  const [productoServicio, setProductoServicio] = useState<ICartaPorteProductoServicioForm>(productoServicioEmpty);
  const [matPeligroso, setMatPeligroso] = useState<ICartaPorteMaterialPeligroso>(productoPeligrosoEmpty);

  //todo: Catálogo
  const [catProducServicio, setCatProducServicio] = useState<IProductosServicios[]>([]);
  const [catMatPeligroso, setCatMatPeligroso] = useState<IMaterialPeligroso[]>([]);
  const [catUnidadPeso, setCatUnidadPeso] = useState<IUnidadPeso[]>([]);
  const [catEmbalajes, setCatEmbalajes] = useState<IEmbalaje[]>([]);

  //todo: Variables para funcionalidad de materialPeligrsos HTML
  const [selectProducto, setSelectProducto] = useState<IProductosServicios | null>(null);
  const [isPeligroso, setIsPeligroso] = useState<boolean>(false);

  const onChangeFormProducto = ({ target: { name, value } }: handleChangeForm) => {
    setProductoServicio({...productoServicio, [name]: value});
  }

  //todo: INITIAL FUNCTION
  useEffect(() => {
    //services
    const loadMatPeligroso = getMaterialesPeligrosos();
    const loadUnidadPeso = getUnidadPesoCP();
    const loadEmbalaje = getEmbalajesCP();
    /*
      const loadProductoServicio = getProductosServicioCP();
      const _ProductosServicio = async () => {
        let result = await loadProductoServicio.call;
        if(result.data.success){
          let response = result.data;
          setCatProducServicio( response.data);
        }
      }
      //Call functions
      _ProductosServicio();
      loadProductoServicio.controller.abort();
    */
    //todo: functions
    const _MaterialesPeligrosos = async () => {
      let result = await loadMatPeligroso.call;
      if(result.data.success){
        let response = result.data;
        setCatMatPeligroso( response.data);
      }
    }

    const _Embalajes = async() => {
      let result = await loadEmbalaje.call;
      if(result.data.success){
        let response = result.data;
        setCatEmbalajes(response.data);
      }
    } 

    const _UnidadPeso = async () => {
      let result = await loadUnidadPeso.call;
      if(result.data.success){
        let response = result.data;
        setCatUnidadPeso( response.data);
      }
    }

    //Call Functions
    _MaterialesPeligrosos();
    _UnidadPeso();
    _Embalajes();

    //destruimos la peticion si cambia de pantalla
    return () => {
      loadMatPeligroso.controller.abort();
      loadUnidadPeso.controller.abort();
      loadEmbalaje.controller.abort();
    }
  },[]);

  //todo: funciones para seleccionar productos servicio y (si existe) material peligroso
  const onChangeProducto = (item: any) => {
    if(item !== null){
      catProducServicio.forEach((element) => {
        if(element.id_ClaveProducto === item.id_ClaveProducto){
          setProductoServicio({...productoServicio, id_ClaveProducto: element.id_ClaveProducto});
          setSelectProducto(item);
        }
      });
    }else{
      setCatProducServicio( [] );
      setSelectProducto(null);
    }
  }

  const onChangeUnidadPeso = (item: any) => {
    if(item !== null){
      catUnidadPeso.forEach((element) => {
        if(element.id_ClaveUnidadPeso === item.id_ClaveUnidadPeso){
          setProductoServicio({...productoServicio, id_ClaveUnidadPeso: element.id_ClaveUnidadPeso});
        }
      });
    }
  }

  const onChangeMaterialPeligroso = (item: any) => {
    if(item !== null){
      catMatPeligroso.forEach(element => {
        if(element.id_MaterialesPeligrosos === item.id_MaterialesPeligrosos){
          setMatPeligroso({...matPeligroso, id_MaterialesPeligrosos: element.id_MaterialesPeligrosos});
        }
      });
    }
  }

  const onChangeEmbalaje = (item: any) => {
    if(item !== null){
      catEmbalajes.forEach((element) => {
        if(element.id_TipoEmbalaje === item.id_TipoEmbalaje){
          setMatPeligroso({...matPeligroso, id_TipoEmbalaje: element.id_TipoEmbalaje});
        }
      });
    }
  }

  const changeTextField = async ({ target: { value } }: handleChangeForm) => {
    let findProductos = value;
    const result = await callEndpoint(  getProductoCPLike(findProductos) );
    setCatProducServicio( result.data.data);
  }

  const chooseProductoPeligroso = () => {
    let tempIsPeligroso = isPeligroso;
    console.log("temp: " + tempIsPeligroso);
    if(!tempIsPeligroso){
      setProductoServicio({...productoServicio, MaterialPeligroso: 'Si'});
    }else{
      setProductoServicio({...productoServicio, MaterialPeligroso: 'No'});
      setMatPeligroso(productoPeligrosoEmpty);
    }
    setIsPeligroso(!isPeligroso);
  }

  const handleSabeProductoServicio = (e: any) => {
    e.preventDefault();
    if(productoServicio.MaterialPeligroso === 'Si' && 
      ( matPeligroso.id_MaterialesPeligrosos === null || matPeligroso.id_TipoEmbalaje === null )
    ){
      Swal.fire({ title: 'Error', text: 'Si el material es peligroso selecciona el embalaje y el producto peligroso', icon: 'error', showConfirmButton: true});
      return false;
    }
    // ? validación de material peligros al array principal de producto
    if(productoServicio.MaterialPeligroso === 'Si' && 
      ( matPeligroso.id_MaterialesPeligrosos !== null && matPeligroso.id_TipoEmbalaje !== null )
    ){
      console.log("Entro al if");
      console.log(matPeligroso);
      setProductoServicio({...productoServicio, 
        id_MaterialesPeligrosos: matPeligroso.id_MaterialesPeligrosos,
        id_TipoEmbalaje: matPeligroso.id_TipoEmbalaje
      });
    }
    //todo: array para retornar
    let arrayReturn = productoServicio;

    //todo: setear el formulario
    setProductoServicio(productoServicioEmpty);
    setMatPeligroso(productoPeligrosoEmpty);
    setSelectProducto(null);

    //todo: Retorna el productos
    retornaProducto(arrayReturn);
  }

  return (
    <Fragment>
      <h4 className="card-title mt-5">Bienes Transportado (registrados: 0)</h4>
      <Button variant='contained' startIcon={<VisibilityIcon />} size='small'>Mostrar bienes transportados</Button>
      <hr></hr>
      <div className='row'>
        <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
            <Autocomplete
              onChange={(_option, value) => onChangeProducto(value)}
              options={catProducServicio}   
              getOptionLabel={(option) => option.st_ClaveProducto + " - " + option.st_DescripcionProducto}
              isOptionEqualToValue={(option, value) => option.id_ClaveProducto === value.id_ClaveProducto}
              renderInput={(params) => <TextField {...params} name='searchProducto' label="Selecciona el bien transportado" onChange={changeTextField} variant="outlined" />}
            />
          </div>
        </div>
        {
          // todo: "0,1", "1"
          selectProducto !== null && 
          ( 
            selectProducto.st_MaterialPeligroso.search(",") !== -1 ||  selectProducto.st_MaterialPeligroso.search("1") !== -1 
          ) ? (
            <div className="col-md-2 col-lg-2 col-sm-12 col-xs-12">
              <div className="form-group">
              <FormControlLabel control={<Switch value={isPeligroso} onChange={chooseProductoPeligroso} />} label="Material Peligroso" />
              </div>
            </div>
          ) : void(0)
        }
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
          <TextField id='PesoEnKg' onChange={onChangeFormProducto} className="form-control" variant="outlined" label="Peso en KG"  type="number" inputProps={{ autoComplete: "off", min: 1}} name="PesoEnKg" value={productoServicio.PesoEnKg || ''} required/>
          </div>
        </div>
        <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
            <Autocomplete
              options={catUnidadPeso}
              onChange={(_option, value) => onChangeUnidadPeso(value)}
              getOptionLabel={(option) => option.st_ClaveUnidad + " - " + option.st_NombreClave}
              isOptionEqualToValue={(option, value) => option.id_ClaveUnidadPeso === value.id_ClaveUnidadPeso}
              renderInput={(params) => <TextField {...params} label="Selecciona unidad peso" variant="outlined" />} />
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
          <TextField id='Cantidad' onChange={onChangeFormProducto} className="form-control" variant="outlined" label="Cantidad"  type="number" name="Cantidad" value={productoServicio.Cantidad || ''} inputProps={{ autoComplete: "off", min: 1 }} required/>
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
          <TextField id='deci_ValoeUnitario' onChange={onChangeFormProducto} className="form-control" variant="outlined" label="Valor de la mercancia"  type="number" name="deci_ValoeUnitario" value={productoServicio.deci_ValoeUnitario || ''} inputProps={{ autoComplete: "off", min: 1}} required/>
          </div>
        </div>
      </div>
      {
          isPeligroso ? (
          <Fragment>
            <h4 className="card-title">Configura tu material peligroso</h4>
            <div className="row">
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    options={catMatPeligroso}
                    onChange={(_option, value) => onChangeMaterialPeligroso(value)}
                    getOptionLabel={(option) => option.c_MaterialesPeligrosos + " - " + option.st_descripcion}
                    isOptionEqualToValue={(option, value) => option.id_MaterialesPeligrosos === value.id_MaterialesPeligrosos}
                    renderInput={(params) => <TextField {...params} label="Selecciona el material peligroso" variant="outlined" />} />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <Autocomplete
                    options={catEmbalajes}
                    onChange={(_option, value) => onChangeEmbalaje(value)}
                    getOptionLabel={(option) => option.c_tipoEmbalaje + " - " + option.st_descripcion}
                    isOptionEqualToValue={(option, value) => option.id_TipoEmbalaje === value.id_TipoEmbalaje}
                    renderInput={(params) => <TextField {...params} label="Selecciona el embalaje" variant="outlined" />} />
                </div>
              </div>
            </div>
          </Fragment>
          ) : void(0)
        }
        <div className="col-12 text-end">
          <Button variant='contained' onClick={handleSabeProductoServicio} color='success'>Guardar producto</Button>
        </div>
    </Fragment>
  )
}

export default ProductoServicioForm