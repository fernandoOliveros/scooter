import React, { Fragment, useEffect, useState } from 'react'
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { ICartaPorteMaterialPeligroso } from '../../../models/cartaportes/cartaPorte-MaterialPeligro.model';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { getMaterialesPeligrosos, getProductosServicio } from '../../../services/public.service';
import { Autocomplete, Button, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

  //todo: variable para seleccionar el producto servicio
  const [selectProServicio, setSelectProServicio] = useState(null);
  const [selecMatPeligroso, setSelectMatPeligroso] = useState(null);
  const [ selectUnidadPeso, setSelectUnidadPeso] = useState(null);

  //todo: Catálogo
  const [catProducServicio, setCatProducServicio] = useState<IAutoComplete[]>([]);
  const [carMatPeligroso, setCatMatPeligroso] = useState<IAutoComplete[]>([]);
  const [catUnidadPeso, setCatUnidadPeso] = useState<IAutoComplete[]>([]);

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

  return (
    <Fragment>
      <h4 className="card-title">Bienes Transportado (registrados: 0)</h4>
      <Button variant='contained' startIcon={<VisibilityIcon />} size='small'>Mostrar bienes transportados</Button>
      <hr></hr>
      <div className='row'>
        <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
            <Autocomplete
              value={selectProServicio}
              options={catProducServicio}   
              onChange={(_option, value) => onChangeProducto(value)}
              getOptionLabel={(option) => option.label ? option.label : ''}
              isOptionEqualToValue={(option: IAutoComplete, value: IAutoComplete) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Selecciona el bien transportado" variant="outlined" />}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ProductoServicioForm