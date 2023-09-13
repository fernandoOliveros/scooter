import { Fragment, useEffect, useState } from 'react'
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { ICartaPorteMaterialPeligroso } from '../../../models/cartaportes/cartaPorte-MaterialPeligro.model';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { getMaterialesPeligrosos, getProductosServicioCP, getUnidadPesoCP } from '../../../services/public.service';
import { Autocomplete, Button, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IEmbalaje, IMaterialPeligroso, IProductosServicios, IUnidadPeso } from '../../../models/cartaportes/cartaPorte.model';

export interface Props {}

//todo: json iniciales
let productoServicioEmpty: ICartaPorteProductoServicioForm = {
  id_ClaveProducto: null,
  PesoEnKg: 1,
  Cantidad: 1,
  id_ClaveUnidadPeso:null,
  deci_ValoeUnitario: 1,
  CantidadTransporta: { Cantidad: 1 },
  MaterialPeligroso: 'No'
}
let productoPeligroso: ICartaPorteMaterialPeligroso = {
  id_MaterialesPeligrosos: null,
  id_TipoEmbalaje: null
}

function ProductoServicioForm() {

  //todo: Variables globales
  const [opMatPeligrsos, setOpMatPeligroso] = useState<boolean>(false);
  const [productoServicio, setProductoServicio] = useState<ICartaPorteProductoServicioForm>(productoServicioEmpty);
  const [matPeligroso, setMatPeligroso] = useState<ICartaPorteMaterialPeligroso>(productoPeligroso);
  const [optionPeligroso, setOptionPeligroso] = useState<boolean>(false);

  //todo: Catálogo
  const [catProducServicio, setCatProducServicio] = useState<IProductosServicios[]>([]);
  const [catMatPeligroso, setCatMatPeligroso] = useState<IMaterialPeligroso[]>([]);
  const [catUnidadPeso, setCatUnidadPeso] = useState<IUnidadPeso[]>([]);
  const [catEmbalajes, setCatEmbalajes] = useState<IEmbalaje[]>([]);

  //todo: INITIAL FUNCTION
  useEffect(() => {
    //services
    const loadProductoServicio = getProductosServicioCP();
    const loadMatPeligroso = getMaterialesPeligrosos();
    const loadUnidadPeso = getUnidadPesoCP();

    //functions
    const _ProductosServicio = async () => {
      let result = await loadProductoServicio.call;
      if(result.data.success){
        let response = result.data;
        setCatProducServicio( response.data);
      }
    }

    const _MaterialesPeligrosos = async () => {
      let result = await loadMatPeligroso.call;
      if(result.data.success){
        let response = result.data;
        setCatMatPeligroso( response.data);
      }
    }

    const _Embalajes = async() => {
      let result = await loadMatPeligroso.call;
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

    //Call functions
    _ProductosServicio();
    _MaterialesPeligrosos();
    _UnidadPeso();
    _Embalajes();

    //destruimos la peticion si cambia de pantalla
    return () => {
      loadProductoServicio.controller.abort();
    }
  },[]);

  //todo: funciones para seleccionar productos servicio y (si existe) material peligroso
  const onChangeProducto = (item: any) => {
    console.log(item);
    if(item !== null){
      catProducServicio.forEach((element) => {
        if(element.id_ClaveProducto === item.id_ClaveProducto){
          setProductoServicio({...productoServicio, id_ClaveProducto: element.id_ClaveProducto});
        }
      });
      let posiblePeligroso = item.st_MaterialPeligroso.search(",");
      let posiblePeligroso2 = item.st_MaterialPeligroso.search("1");
      if(posiblePeligroso !== -1 || posiblePeligroso2 !== -1){
        setOptionPeligroso(true);
      }
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

  return (
    <Fragment>
      <h4 className="card-title">Bienes Transportado (registrados: 0)</h4>
      <Button variant='contained' startIcon={<VisibilityIcon />} size='small'>Mostrar bienes transportados</Button>
      <hr></hr>
      <div className='row'>
        <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
            <Autocomplete
              options={catProducServicio}   
              onChange={(_option, value) => onChangeProducto(value)}
              getOptionLabel={(option) => option.st_ClaveProducto + " - " + option.st_DescripcionProducto}
              isOptionEqualToValue={(option, value) => option.id_ClaveProducto === value.id_ClaveProducto}
              renderInput={(params) => <TextField {...params} label="Selecciona el bien transportado" variant="outlined" />}
            />
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
          <TextField id='PesoEnKg' className="form-control" variant="outlined" label="Peso en KG"  type="text" name="PesoEnKg" value={productoServicio.PesoEnKg || ''} inputProps={{ autoComplete: "off" }} required/>
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
          <TextField id='deci_ValoeUnitario' className="form-control" variant="outlined" label="Valor de la mercancia"  type="text" name="deci_ValoeUnitario" value={productoServicio.deci_ValoeUnitario || ''} inputProps={{ autoComplete: "off" }} required/>
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
        {
          optionPeligroso ? (
          <>
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
          </>
          ) : void(0)
        }
      </div>
    </Fragment>
  )
}

export default ProductoServicioForm