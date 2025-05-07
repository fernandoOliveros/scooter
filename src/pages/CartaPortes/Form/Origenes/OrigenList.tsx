import { Fragment } from 'react'
import { ICartaPorteDirOrigenForm } from '../../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { Button, IconButton } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
    origenes: ICartaPorteDirOrigenForm[];
    onEdit: (index: number) => void;
    onRemove: (index: number) => void;
    onAdd: () => void;
}

function OrigenList({ origenes, onEdit, onRemove, onAdd }: Props) {
    return (
      <Fragment>
        <div className="row">
          <div className="col-12">
          <h3 className="card-title mt-4 mb-2">Origenes </h3>
          <Button className='mb-3' onClick={onAdd} variant='contained'  size='small'>Agregar origen</Button>
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
                {origenes.map((origen, index) => (
                  <tr key={index}>
                    <td>{origen.st_RemitenteNombre}</td>
                    <td>{origen.st_RemitenteRFC}</td>
                    <td>{origen.st_Calle}</td>
                    <td>{origen.c_codigoPostal}</td>
                    <td>
                        {origen.date_FechaSalida
                        ? new Date(origen.date_FechaSalida).toLocaleString()
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

export default OrigenList