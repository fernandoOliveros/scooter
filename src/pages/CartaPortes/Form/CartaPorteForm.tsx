import { Fragment, lazy, useEffect, useState } from 'react'
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';

//components forms
import DirOrigenForm from './DirOrigenForm';
import DirDestinoForm from './DirDestinoForm';
import ProductoServicioForm from './ProductoServicioForm';
import { ICartaPorteForm } from '../../../models/cartaportes/cartaPorte-form.model';
import { Button } from '@mui/material';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

//Lazy load Dialogs
const DialogOrigenes = lazy( () => import('../../../components/CartaPorte/DialogOrigenes'));
const DialogDestinos = lazy( () => import( '../../../components/CartaPorte/DialogDestinos'));
const DialogProductos = lazy( () => import( '../../../components/CartaPorte/DialogProductos'));

export interface Props {
  id_Viaje?: number,
  returnFormCartaPorte: (result: boolean) => void
}

//todo: Global
function CartaPorteForm({id_Viaje = 0, returnFormCartaPorte}: Props) {

  //todo: Peticiones http controladas
  const { callEndpoint } = useFetchAndLoad();

  //todo: Function Initial
  useEffect( () => {
    if(id_Viaje == 0) console.log(id_Viaje)
  },[]);

  //todo: Variable general carta porte
  const [cartaPorte, setCartaPorte] = useState<ICartaPorteForm>({
    id_Viaje: id_Viaje,
    id_CFDI: null,
    folio_int_cp: null,
    i_NumberTotalMercancias: null,
    st_LugarExpedicion: null,
    dec_TotalDistRec:  null,
    dec_PesoBrutoTotalMercancias: null,
    id_UnidadPeso: null,
    id_AseguraMedAmbiente: null,
    id_AseguraCarga: null,
    st_PolizaMedAmbiente: null,
    st_PolizaAseguraCarga: null
  });
  
  //todo: Variables para abrir el modal
  const [openOrigenes, SetOpenOrigenes] = useState<boolean>(false);
  const [openDestinos, SetOpenDestinos] = useState<boolean>(false);
  const [openProductos, SetOpenProductos] = useState<boolean>(false);

  //todo: Array con todos los origenes, destino y servicios y productos para la carta porte
  const [arrOrigenes, setArrOrigenes] = useState<ICartaPorteDirOrigenForm[]>([]);
  const [arrDestinos, setArrDestino] = useState<ICartaPorteDirDestinoForm[]>([]);
  const [productosServicios, setProductoServicios] = useState<ICartaPorteProductoServicioForm[]>([]);

  //todo: Funciones reciben respuesta de los respectivos componentes
  const guardarOrigen = (origen: ICartaPorteDirOrigenForm) => setArrOrigenes([...arrOrigenes, origen]);
  const guardarDestino = (destino: ICartaPorteDirDestinoForm) => setArrDestino([...arrDestinos, destino]);
  const guardarProductosServicios = (producto: ICartaPorteProductoServicioForm) => setProductoServicios([...productosServicios, producto]);

  //todo: Function execute if productoServicios changes.
  useEffect(() => {
    let distanciaRecorrida: number = 0;
    arrDestinos.forEach(element => {
      distanciaRecorrida = distanciaRecorrida +  element?.dec_DistRe;
    });
    setCartaPorte({...cartaPorte, i_NumberTotalMercancias: productosServicios.length, dec_TotalDistRec: distanciaRecorrida});
  },[productosServicios]);

  //todo: Abrimos el dialog correspondiente
  const viewOrigenes = (option: boolean) => SetOpenOrigenes(option);
  const viewDestinos = (option: boolean) => SetOpenDestinos(option);
  const viewProductos = (option: boolean) => SetOpenProductos(option);

  //todo: Funciones para eliminar un item de origen, destino o producto
  const eliminarOrigen = (position: number) => {
    console.log(position);
  }

  const eliminarDestino = (position: number) => {
    console.log(position);
  }

  const eliminarProducto = (position: number) => {
    console.log("Producto: " + position);
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    returnFormCartaPorte(true);
  }

  return (
      <Fragment>
        <DialogOrigenes open={openOrigenes} origenes={arrOrigenes} deleteOrigen={(position) => eliminarOrigen(position)} returnCloseDialog={(e) => viewOrigenes(e)} />
        <DialogDestinos open={openDestinos} destinos={arrDestinos} deleteDestino={(position) => eliminarDestino(position)} returnCloseDialog={(e) => viewDestinos(e)} />
        <DialogProductos open={openProductos} productos={productosServicios} deleteProducto={(position) => eliminarProducto(position)}  returnCloseDialog={(e) => viewProductos(e)}/>
        <div className="form-horizontal">
          <div className="form-body">
            {/* ORIGENES */}
            <DirOrigenForm retornaOrigen={(e) => guardarOrigen(e)} retornaVerOrigenes={(e) => viewOrigenes(e)} />
            {/* DESTINOS */}
            <DirDestinoForm retornaDestino={(e) => guardarDestino(e)} retornaVerDestinos={(e) => viewDestinos(e)} />
            {/* PRODUCTOS Y BIENES TRANSPORTADOS */}
            <ProductoServicioForm retornaProducto={(e) => guardarProductosServicios(e)} retornaVerProductos={(e) => viewProductos(e)} />
          </div>
          <div className="col-12 text-end">
            <Button variant='contained' color='success' size='medium' type="button" onClick={onSubmit}>Generar carta porte</Button>
          </div>
        </div>
      </Fragment>
  )
}
export default CartaPorteForm;

{/* <DynamicList open={open} items={ () => arrOrigenes} itemComponent={
            (data, index) => (
              <div className="table-responsive">
                <table className='table color-table dark-table'>
                  <thead>
                    <tr>
                      <th>Nombre Remitente</th>
                      <th>RFC</th>
                      <th>Calle</th>
                      <th>CP</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data?.st_RemitenteNombre}</td>
                      <td>{data?.st_RemitenteRFC}</td>
                      <td>{data?.st_Calle}</td>
                      <td>{data?.c_codigoPostal}</td>
                      <td><Button variant='contained' onClick={() => deleteOrigen(data.)} startIcon={<VisibilityIcon />} size='small'>Ver Origenes</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>  
            )
          }  returnCloseDialog={(close) => setOpen(close)}/> */}