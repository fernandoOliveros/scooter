import { Fragment } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { ICartaPorteProductoServicioForm } from '../../models/cartaportes/cartaPorte-produtoServicio-form.model'
import { GridDeleteForeverIcon } from '@mui/x-data-grid'

export interface Props {
  open: boolean,
  productos: ICartaPorteProductoServicioForm[],
  deleteProducto: (position: number) => void,
  returnCloseDialog: (close: boolean) => void,
}

function DialogProductos({open, productos, deleteProducto, returnCloseDialog}:Props) {
  return (
    <Fragment>
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={"lg"}>
      <DialogTitle>Productos</DialogTitle>
      <DialogContent>
        <div className='row'>
          <div className="table-responsive">
            <table className='table color-table dark-table'>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Id_producto</th>
                  <th>Cantidad</th>
                  <th>Peso en Kg</th>
                  <th>Acc</th>
                </tr>
              </thead>
              <tbody>
                {
                  productos.map((data, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{data?.id_ClaveProducto}</td>
                      <td>{data?.Cantidad}</td>
                      <td>{data?.PesoEnKg}</td>
                      <td><Button variant='contained' color='error' onClick={() => deleteProducto(index)} endIcon={<GridDeleteForeverIcon />}>Eliminar </Button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='warning' size='medium' type="button" onClick={() => returnCloseDialog(false)}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
  )
}

export default DialogProductos