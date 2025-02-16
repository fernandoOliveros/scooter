import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { deleteOperador, getOperadoresByEmpresa } from '../../services/operadores/operadores.service';
import { IOperadorModel } from '../../models/operadores/operador.model';
import MenuBar from "../../components/shared/Menu"
import DeleteIcon from '@mui/icons-material/Delete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { DataGrid, esES, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';

function Operadores() {
    //todo: VARIABLES
    const navigate = useNavigate();
    const [operadores, setOperadores] = useState<IOperadorModel[]>([]);
    const [isChangeOperador, setIsChangeOperador] = useState<boolean>(false);
    const { callEndpoint } = useFetchAndLoad();

    //todo: SERVICES
    const loadOperadores = getOperadoresByEmpresa();
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
                onClick={() => editarOperador(+params.id)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Eliminar Unidad"
                onClick={() => eliminarOperador(+params.id)}
                showInMenu
              />,
            ],
        },
        { field: 'st_Nombre', headerName: 'Nombre', width: 200, sortable: true},
        { field: 'st_ApellidoP', headerName: 'Apellido Pa.', width: 200, sortable: true},
        { field: 'st_ApellidoM', headerName: 'Apellido Ma.', width: 200, sortable: true},
        { field: 'st_NumLicencia', headerName: 'No. Licencia', width: 200, sortable: false},
        { field: 'st_NumIMSS', headerName: 'No. IMSS', width: 200, sortable: false},
        { field: 'st_CURP', headerName: 'CRUP', width: 200, sortable: false},

    ];
    
    //todo: INITIAL
    useEffect( () => {
        const getInitial = async () => {
            try {
                const result = await loadOperadores.call;
                setOperadores(result.data.data);
            } catch (error) {
                alert("Error, al obtener los operadores de la empresa y/o empresa aún no tiene operadores cargados en el sistema");
                console.log(error);
            }
        }
        getInitial();
        return () => { loadOperadores.controller.abort(); }
    },[isChangeOperador]);

    const crearOeprador = () => navigate("crear");

    const editarOperador = (id:number) => {
        navigate("editar/" + id, { replace: true });
    }

    const eliminarOperador = async(id: number) => {
        await callEndpoint(deleteOperador(id));
        setIsChangeOperador(!isChangeOperador);
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Operadores</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Operadores</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Operadores registrados ({operadores.length})</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button className="btn btn-primary btn-rounded" type="button" onClick={crearOeprador}><i className="fa fa-plus-circle"></i> Operador</button>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-12 mt-3">
                                <DataGrid
                                    autoHeight
                                    columns={columns}
                                    rows={operadores}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    getRowId={(row: IOperadorModel) =>  row.id_Operador}
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

export default Operadores;