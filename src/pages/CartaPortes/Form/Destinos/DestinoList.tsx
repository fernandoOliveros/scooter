import { Button, IconButton } from '@mui/material';
import { ICartaPorteDirDestinoForm } from '../../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment } from 'react';

interface Props {
  destinos: ICartaPorteDirDestinoForm[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

function DestinoList({ destinos, onEdit, onRemove, onAdd }: Props) {
  return (
    <Fragment>
      <div className="row">
        <div className="col-12">
        <h3 className="card-title mt-4 mb-2">Destinos </h3>
        <Button className='mb-3' onClick={onAdd} variant='contained' size='small'>Agregar destino</Button>
        </div>
        <div className="col-12 table-responsive">
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <td>Nombre</td>
                        <td>RFC</td>
                        <td>Calle</td>
                        <td>CP</td>
                        <td>Salida</td>
                        <td>Acciones</td>
                    </tr>
                </thead>
                <tbody>
                {destinos.map((destino, index) => (
                    <tr key={index}>
                        <td>{destino.st_DestinatarioNombre}</td>
                        <td>{destino.st_DestinatarioRFC}</td>
                        <td>{destino.st_Calle}</td>
                        <td>{destino.c_codigoPostal}</td>
                        <td>
                            {destino.date_FechaLlegada
                            ? new Date(destino.date_FechaLlegada).toLocaleString()
                            : "-"}
                        </td>
                        <td align="right">
                            <IconButton onClick={() => onEdit(index)} color="primary">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => onRemove(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>
    </Fragment>
  )
}

export default DestinoList