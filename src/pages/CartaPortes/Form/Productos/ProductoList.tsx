import { Fragment, memo } from 'react';
import { ICartaPorteProductoServicioForm } from '../../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import { Button, IconButton } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  productos: ICartaPorteProductoServicioForm[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

function ProductoList({ productos, onEdit, onRemove, onAdd }: Props) {
  console.log("ProductoList renderizado");
  return (
    <Fragment>
      <div className="row">
        <div className="col-12">
        <h3 className="card-title mt-4 mb-2">Productos</h3>
        <Button className='mb-3' onClick={onAdd} variant='contained' size='small'>Agregar Producto</Button>
        </div>
        <div className="col-12 table-responsive">
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <td>Producto</td>
                        <td>Cantidad</td>
                        <td>Peso KG</td>
                        <td>Unidad de Servicio</td>
                        <td>Material Peligroso</td>
                        <td>Acciones</td>
                    </tr>
                </thead>
                <tbody>
                {
                  productos.length == 0 ? 
                  (
                    <tr>
                      <td colSpan={6} align='center'>No hay productos registrados</td>
                    </tr>
                  ) : (
                    productos.map((producto, index) => (
                      <tr key={index}>
                          <td>{producto.id_ClaveProducto}</td>
                          <td>{producto.i_Cantidad}</td>
                          <td>{producto.dec_PesoEnKg}</td>
                          <td>{producto.id_ClaveUnidadPeso}</td>
                          <td>{producto.i_MaterialPeligroso == 1 ? "SI" : "NO"}</td>
                          <td align="right">
                              <IconButton onClick={() => onEdit(index)} color="primary">
                                  <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => onRemove(index)} color="error">
                                  <DeleteIcon />
                              </IconButton>
                          </td>
                      </tr>
                    ))
                  )
                }
                </tbody>
            </table>
        </div>
      </div>
    </Fragment>
  )
}

export default memo( ProductoList );