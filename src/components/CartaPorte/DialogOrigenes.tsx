import { Fragment, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useFormContext, useWatch } from 'react-hook-form';
import { ICartaPorteFormData } from '../../models/cartaportes/cartaporte-formData';
import FormOrigen from '../../pages/CartaPortes/Modal/FormOrigen';

export interface Props {
  open: boolean,
  returnCloseDialog: (close: boolean) => void,
}

function DialogOrigenes({open, returnCloseDialog}:Props) {
  
  const { control } = useFormContext<ICartaPorteFormData>();
  const arrOrigenes = useWatch({ control, name: 'arrOrigenes' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <Fragment>
    <Dialog open={open} onClose={returnCloseDialog}  aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
      <DialogTitle>Origenes</DialogTitle>
      <DialogContent>
      { arrOrigenes && arrOrigenes.length > 0 && (
        <div className="row">
            <div className="col-12">
                <table className='table table-responsive table-bordered'>
                    <thead>
                        <tr>
                            <td>RFC</td>
                            <td>Nombre</td>
                            <td>Acciones</td>
                        </tr>
                    </thead>
                    <tbody>
                        {arrOrigenes.map((origen, index) => (
                            <Fragment key={index}>
                                <tr>
                                    <td>{origen.st_RemitenteNombre}</td>
                                    <td>{origen.st_RemitenteRFC}</td>
                                    <td>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setEditingIndex(index)}
                                    >
                                        Editar
                                    </Button>
                                    </td>
                                </tr>

                                {editingIndex === index && (
                                    <tr>
                                    <td colSpan={3}>
                                        <FormOrigen key={index} baseName={`arrOrigenes.${index}`} />
                                        <div style={{ marginTop: '0.5rem' }}>
                                        <Button
                                            variant="text"
                                            size="small"
                                            color="secondary"
                                            onClick={() => setEditingIndex(null)}
                                        >
                                            Cerrar edición
                                        </Button>
                                        </div>
                                    </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>  
      )}
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='warning' size='medium' type="button" onClick={() => returnCloseDialog(false)}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
  )
}

export default DialogOrigenes