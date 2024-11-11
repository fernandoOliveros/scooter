import { Fragment, useEffect, useState } from 'react';
import { UnidadModel } from '../../models/unidades/unidad.model';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUnidad, getUnidades } from '../../services/unidades/unidades.service';
import MenuBar from "../../components/shared/Menu"
import DeleteIcon from '@mui/icons-material/Delete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { DataGrid, esES, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { AxiosError } from 'axios';

function Unidades () {
    const [ unidades, setUnidades ] = useState<UnidadModel[]>([])
    const columns: GridColDef[] = 
    [
        {
            field: 'actions',
            headerName: 'ACC',
            type: 'actions',
            width: 40,
            getActions: (params) => [
              <GridActionsCellItem
                icon={<MiscellaneousServicesIcon />}
                label="Editar Unidad"
                onClick={() => editarUnidad(+params.id)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Eliminar Unidad"
                onClick={() => eliminarUnidad(+params.id)}
                showInMenu
              />,
            ],
        },
        { field: 'st_Economico', headerName: 'ECO', width: 200, sortable: true},
        { field: 'st_Placa', headerName: 'Placas', width: 200, sortable: false},
        { field: 'st_Marca', headerName: 'Marca', width: 200, sortable: false},
        { field: 'st_SubMarca', headerName: 'Sub - marca', width: 200, sortable: false},
        { field: 'st_PermisoSCT', headerName: 'Permiso SCT', width: 200, sortable: false},
        { field: 'st_NumPoliza', headerName: 'No. Poliza', width: 200, sortable: false},

    ];
    let navigate = useNavigate();

    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Service
    const loadUnidad = getUnidades();

    useEffect(() => {
        useGet();
        // Desmontamos componente
        return() => { loadUnidad.controller.abort() };
    },[]);

    const useGet = async() => {
        try{
            await loadUnidad.call
            .then( result => {
                setUnidades(result.data.data);
            }).catch((e: AxiosError) => console.log(e.message));
        }catch(e){ console.log(e); }
    };
    
    const crearUnidad = () => navigate("crear");

    const editarUnidad = (id: number) => navigate("editar/" + id);

    const eliminarUnidad = async (id: number) => {
        await callEndpoint(deleteUnidad(id));
        useGet();
    }

    return (
    <Fragment>
        <div className="container-fluid">
            <div className="row page-titles">
                <div className="col-md-5 col-sm-12 col-xs-12">
                    <h2 className="card-title">Unidades</h2>
                </div>
                <div className="col-md-7 col-sm-12 col-xs-12">
                    <div className="d-flex justify-content-end align-items-center">
                        <ol className="breadcrumb justify-content-end">
                            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                            <li className="breadcrumb-item active">Unidades</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-5 col-sm-12 col-xs-12'>
                            <h4 className="card-title">Unidades Registradas ({unidades.length})</h4>
                        </div>
                        <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                            <button className="btn btn-primary btn-rounded" type="button" onClick={crearUnidad}><i className="fa fa-plus-circle"></i> Unidad</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-12 mt-3">
                            <DataGrid
                                autoHeight
                                columns={columns}
                                rows={unidades}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                getRowId={(row: UnidadModel) =>  row.id_Unidad}
                                pageSizeOptions={[1,3,5,10]}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        }
                                    }
                                }}
                                disableRowSelectionOnClick                                
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <MenuBar />
    </Fragment>
    )
}

export default Unidades