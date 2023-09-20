import { Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { Fragment } from 'react'

export interface Props {
  open: boolean,
  children?: JSX.Element | JSX.Element[] | any[],
  returnCloseDialog: (close: boolean) => void,
}

function DialogShared({open, returnCloseDialog, children}: Props) {

  return (
    <Fragment>
      <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <button className='btn btn-danger' onClick={() => returnCloseDialog(false)}>Salir sin guardar</button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogShared