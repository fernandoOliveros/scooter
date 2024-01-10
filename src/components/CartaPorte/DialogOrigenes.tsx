import { Fragment } from 'react'
import { ICartaPorteDirOrigenForm } from '../../models/cartaportes/cartaPorte-dirOrigen-form.model'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { GridDeleteForeverIcon } from '@mui/x-data-grid'

export interface Props {
  open: boolean,
  origenes: ICartaPorteDirOrigenForm[],
  deleteOrigen: (position: number) => void,
  returnCloseDialog: (close: boolean) => void,
}

function DialogOrigenes({open, origenes, deleteOrigen, returnCloseDialog}:Props) {
  return (
    <Fragment>
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
      <DialogTitle>Origenes</DialogTitle>
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
                  origenes.map((data, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{data?.st_RemitenteNombre}</td>
                      <td>{data?.st_RemitenteRFC}</td>
                      <td>{data?.st_Calle}</td>
                      <td>{data?.c_codigoPostal}</td>
                      <td><Button variant='contained' color='error' onClick={() => deleteOrigen(index)} endIcon={<GridDeleteForeverIcon />}>Eliminar </Button></td>
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

export default DialogOrigenes