import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { Fragment } from 'react'

export interface Props {
  open: boolean,
  children: React.ReactNode,
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
          <Button variant='contained' color='warning' size='medium' type="button" onClick={() => returnCloseDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogShared