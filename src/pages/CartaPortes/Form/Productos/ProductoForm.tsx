import { useEffect, useState, KeyboardEvent, Fragment} from 'react';
import { ICartaPorteProductoServicioForm } from '../../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { Controller, useForm } from 'react-hook-form';
import { getEmbalajesCP, getMaterialesPeligrosos, getProductoCPById, getProductoCPLike, getUnidadPesoCP } from '../../../../services/public.service';
import { IEmbalaje, IMaterialPeligroso, IProductosServicios, IUnidadPesoCartaPorte } from '../../../../models/cartaportes/cartaPorte.model';
import { IAutoComplete } from '../../../../models/shared/autocomplete.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import { AutocompleteField } from '../../../../components/shared/AutoCompleteField';


interface Props {
  defaultValues?: Partial<ICartaPorteProductoServicioForm>;
  onSubmit: (data: ICartaPorteProductoServicioForm) => void;
  onCancel: () => void;
}

type enterKey = KeyboardEvent<HTMLInputElement>;

function ProductoForm({ defaultValues, onSubmit, onCancel} : Props) {

  //todo: Catálogo
  const [catProducServicio, setCatProducServicio] = useState<IProductosServicios[]>([]);
  const [catMatPeligroso, setCatMatPeligroso] = useState<IAutoComplete[]>([]);
  const [catUnidadPeso, setCatUnidadPeso] = useState<IAutoComplete[]>([]);
  const [catEmbalajes, setCatEmbalajes] = useState<IAutoComplete[]>([]);

  const { callEndpoint } = useFetchAndLoad();

  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    const loadMatPeligroso = getMaterialesPeligrosos();
    const loadUnidadPeso = getUnidadPesoCP();
    const loadEmbalaje = getEmbalajesCP();

    const _MaterialesPeligrosos = async () => {
      let result = await loadMatPeligroso.call;
      if(result.data.success){
        let response = result.data;
        let dataParse = response.data.
        map( (item: IMaterialPeligroso) => ({
            id: item.id_MaterialesPeligrosos,
            label: item.c_MaterialesPeligrosos + " - " + item.st_descripcion
        }));
        setCatMatPeligroso( dataParse );
      }
    }

    const _Embalajes = async() => {
      let result = await loadEmbalaje.call;
      if(result.data.success){
        let response = result.data;
        let dataParse = response.data.
        map( (item: IEmbalaje) => ({
            id: item.id_TipoEmbalaje,
            label: item.c_tipoEmbalaje + " - " + item.st_descripcion
        }));
        setCatEmbalajes(dataParse);
      }
    } 

    const _UnidadPeso = async () => {
      let result = await loadUnidadPeso.call;
      if(result.data.success){
        let response = result.data;
        let dataParse = response.data.
        map( (item: IUnidadPesoCartaPorte) => ({
            id: item.id_ClaveUnidadPesoCFDI,
            label: item.c_ClaveUnidad + " - " + item.st_Nombre
        }));
        setCatUnidadPeso( dataParse );
      }
    }

    //Call Functions
    _MaterialesPeligrosos();
    _UnidadPeso();
    _Embalajes();

    return () => {
      loadMatPeligroso.controller.abort();
      loadUnidadPeso.controller.abort();
      loadEmbalaje.controller.abort();
    }
  },[]);

  const { control, handleSubmit, register, getValues: getProducto, setValue: setProducto, formState: { errors }, watch} = useForm<ICartaPorteProductoServicioForm>({ defaultValues});

  const wSelectProducto = watch("id_ClaveProducto");
  const wMaterialPeligroso = watch("i_MaterialPeligroso");

  const findProductoApi = async (event: enterKey) => {
    if(event.key === "Enter"){
      event.preventDefault();
      const result = await callEndpoint(  getProductoCPLike(inputValue) );
      setCatProducServicio( result.data.data );
    }
  }

  // Se ejecuta cada vez que se marca/ desmarca un producto
  useEffect(() => {
    const fetchProducto = async () => {
      if (wSelectProducto) {
        try {
          const findProducto =  getProductoCPById(wSelectProducto);
          const {data} = await findProducto.call;
          const isPeligroso = clasificarMaterialPeligroso(data.data[0].st_MaterialPeligroso);
          setProducto("i_MaterialPeligroso", isPeligroso);
          console.log(isPeligroso);
        } catch (err) {
          console.error("Error al obtener el producto:", err);
        }
      }
    }
    fetchProducto();
  },[wSelectProducto]);

  // Se ejecuta cada vez que se hace set de i_MaterialPeligroso
  useEffect(() => {
    if (wMaterialPeligroso == 0) {
      setProducto("id_MaterialesPeligrosos", null);
      setProducto("id_TipoEmbalaje", null);
    }
  },[wMaterialPeligroso]);

  const clasificarMaterialPeligroso = (valor: string): number => {
    const partes = valor.split(',').map(v => v.trim());
    const tiene0 = partes.includes("0");
    const tiene1 = partes.includes("1");
    if (tiene0 && tiene1) return 0
    if (tiene1) return 1;
    return 0;
  }

  return (
    <form className='form-horizontal mt-2' onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
          <div className="form-group">
            <Controller
              name="id_ClaveProducto"
              control={control}
              defaultValue={null}
              rules={{ required: "Este campo es requerido" }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  value={ catProducServicio.find(option => option.id_ClaveProducto === value) || null }
                  onChange={(_event, newValue) => onChange(newValue?.id_ClaveProducto ?? null)}
                  inputValue={inputValue}
                  onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
                  options={catProducServicio}
                  getOptionLabel={(option) =>
                    option.st_ClaveProducto + ' - ' + option.st_DescripcionProducto
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id_ClaveProducto === value?.id_ClaveProducto
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Selecciona el Producto"
                      variant="outlined"
                      onKeyDown={findProductoApi}
                      helperText='Para buscar un producto da "Enter"'
                    />
                  )}
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
          <div className="form-group">
            <AutocompleteField 
              options={catUnidadPeso}
              control={control}
              name='id_ClaveUnidadPeso'
              placeholder='Selecciona Unidad Peso'
            />
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField id='i_Cantidad' className="form-control" variant="outlined" label="Cantidad"  
            type="number" 
            {...register("i_Cantidad", {
              required: "Campo Requerido",
            })}
            error={errors.i_Cantidad ? true : false}
            helperText={errors.i_Cantidad && errors.i_Cantidad.message?.toString()}
            inputProps={{ autoComplete: "off", min: 1,  defaultValue: 1}}/>
          </div>
        </div>
        <div className="col-md-3 col-lg-3 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField id='dec_PesoEnKg' className="form-control" variant="outlined" label="Peso en KG"  type="number" 
            {...register("dec_PesoEnKg", {
              required: "Campo Requerido",
            })}
            error={errors.dec_PesoEnKg ? true : false}
            helperText={errors.dec_PesoEnKg && errors.dec_PesoEnKg.message?.toString()}
            inputProps={{ autoComplete: "off", min: 1, defaultValue: 1000}}/>
          </div>
        </div>
        <div className="col-md-8 col-lg-8 col-sm-12 col-xs-12">
          <div className="form-group">
            <TextField multiline rows={3} id='st_Descripcion' className="form-control" variant="outlined" label="Descripcion"  type="text"
            {...register("st_Descripcion")}
            error={errors.st_Descripcion ? true : false}
            helperText={errors.st_Descripcion && errors.st_Descripcion.message?.toString()}
            inputProps={{ autoComplete: "off"}}/>
          </div>
        </div>
      </div>
      {
        ( wMaterialPeligroso == 1  )? (
          <Fragment>
            <h4 className="card-title">Configura el Material Peligroso</h4>
            <div className="row">
              <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <AutocompleteField 
                    options={catMatPeligroso}
                    control={control}
                    name='id_MaterialesPeligrosos'
                    placeholder='Selecciona el Material Peligroso'
                  />
                </div>
              </div>
              <div className="col-md-4 col-lg-3 col-sm-12 col-xs-12">
                <div className="form-group">
                  <AutocompleteField 
                    options={catEmbalajes}
                    control={control}
                    name='id_TipoEmbalaje'
                    placeholder='Selecciona el Embalaje'
                  />
                </div>
              </div>
            </div>
          </Fragment>
        ) : void(0)
      }
      <div className="row">
        <div className="col-md-2 col-lg-2 col-sm-12 col-xs-12">
            <div className="mt-3">
                <Button type="submit" variant="contained">
                    Guardar
                </Button>
            </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12 col-xs-12">
        <div className="mt-3">
                <Button variant="outlined" onClick={onCancel}>
                    Cancelar
                </Button>
            </div>
        </div>
      </div>
    </form>
  )
}

export default ProductoForm