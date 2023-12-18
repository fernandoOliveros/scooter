import { Fragment, useState } from 'react'
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
//components forms
import DirOrigenForm from './DirOrigenForm';
import DirDestinoForm from './DirDestinoForm';
import ProductoServicioForm from './ProductoServicioForm';
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import DynamicList from '../../../components/shared/DynamicList';
import DateFormatFix from '../../../utils/DateFormatFix';

//todo: Global
function CartaPorteForm() {
    //todo: Variables para abrir el modal
    const [open, setOpen] = useState<boolean>(false);

    //todo: Array con todos los origenes, destino y servicios y productos para la carta porte
    const [arrOrigenes, setArrOrigenes] = useState<ICartaPorteDirOrigenForm[]>([]);
    const [arrDestinos, setArrDestino] = useState<ICartaPorteDirDestinoForm[]>([]);
    const [productosServicios, setProductoServicios] = useState<ICartaPorteProductoServicioForm[]>([]);

    //todo: Funciones reciben respuesta de los respectivos componentes
    const guardarOrigen = (origen: ICartaPorteDirOrigenForm) => {
      setArrOrigenes([...arrOrigenes, origen]);
    }

    const guardarDestino = (destino: ICartaPorteDirDestinoForm) => {      
      setArrDestino([...arrDestinos, destino]);
    }

    const guardarProductosServicios = (producto: ICartaPorteProductoServicioForm) => {
      setProductoServicios([...productosServicios, producto]);
    }

    //todo: Abrimos modal para origenes, destinos
    const viewOrigenes = () => setOpen(true);

    const viewDestinos = () => setOpen(true);

    return (
        <Fragment>
          <DynamicList open={open} items={ () => arrOrigenes} itemComponent={
            (data) => (
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
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          }  returnCloseDialog={(close) => setOpen(close)}/>
          <DynamicList open={open} items={ () => arrDestinos} itemComponent={
            (data) => (
              <div className="table-responsive">
                <table className='table color-table dark-table'>
                  <thead>
                    <tr>
                      <th>Nombre Destinatario</th>
                      <th>RFC</th>
                      <th>Calle</th>
                      <th>CP</th>
                      <th>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data?.st_DestinatarioNombre}</td>
                      <td>{data?.st_DestinatarioRFC}</td>
                      <td>{data?.st_Calle}</td>
                      <td>{data?.c_codigoPostal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          }  returnCloseDialog={(close) => setOpen(close)}/>
         
          <div className="form-horizontal">
            <div className="form-body">
              {/* ORIGENES */}
              <DirOrigenForm retornaOrigen={(e) => guardarOrigen(e)} retornaVerOrigenes={viewOrigenes} />
              {/* DESTINOS */}
              <DirDestinoForm retornaDestino={(e) => guardarDestino(e)} retornaVerDestinos={viewDestinos} />
              {/* PRODUCTOS Y BIENES TRANSPORTADOS */}
              <ProductoServicioForm retornaProducto={(e) => guardarProductosServicios(e)} />
            </div>
          </div>
        </Fragment>
    )
}
export default CartaPorteForm;


/* ========================= Mostramos origenes, destinos, productos en Dialog  =======================*/
