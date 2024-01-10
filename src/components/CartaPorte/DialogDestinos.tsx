import { Fragment } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { GridDeleteForeverIcon } from '@mui/x-data-grid'
import { ICartaPorteDirDestinoForm } from '../../models/cartaportes/cartaPorte-dirDestino-form.model'

export interface Props {
  open: boolean,
  destinos: ICartaPorteDirDestinoForm[],
  deleteDestino: (position: number) => void,
  returnCloseDialog: (close: boolean) => void,
}

function DialogDestinos({open, destinos, deleteDestino, returnCloseDialog}:Props) {
  return (
  <Fragment>
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={"lg"}>
      <DialogTitle>Destinos</DialogTitle>
      <DialogContent>
        <div className='row'>
          <div className="table-responsive">
            <table className='table color-table dark-table'>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Nombre Remitente</th>
                  <th>RFC</th>
                  <th>Calle</th>
                  <th>CP</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {
                  destinos.map((data, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{data?.st_DestinatarioNombre}</td>
                      <td>{data?.st_DestinatarioRFC}</td>
                      <td>{data?.st_Calle}</td>
                      <td>{data?.c_codigoPostal}</td>
                      <td><Button variant='contained' color='error' onClick={() => deleteDestino(index)} endIcon={<GridDeleteForeverIcon />}>Eliminar </Button></td>
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

export default DialogDestinos