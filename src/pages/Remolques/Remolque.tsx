import { Fragment, useEffect, useState } from 'react'
import { IRemolqueModel } from '../../models/remolques/remolque.model';
import { deleteRemolque, getRemolques } from '../../services/remolques/remolques.service';
import { Link, useNavigate } from 'react-router-dom';
import MenuBar from "../../components/shared/Menu"
import DeleteIcon from '@mui/icons-material/Delete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { DataGrid, esES, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
const Remolque = () => {
    let navigate = useNavigate();
    
    //todo: Variables
    const [remolques, setRemolques] = useState<IRemolqueModel[]>([]);
    const loadRemolques = getRemolques();
    const [isChangeRemolque, setIsChangeRemolque] = useState<boolean>(false);

    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();
    const columns: GridColDef[] = [
    {
        field: 'actions',
        headerName: 'ACC',
        type: 'actions',
        width: 40,
        getActions: (params) => [
            <GridActionsCellItem
            icon={<MiscellaneousServicesIcon />}
            label="Editar Remolque"
            onClick={() => editarRemolque(+params.id)}
            showInMenu
            />,
            <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar Remolque"
            onClick={() => eliminarRemolque(+params.id)}
            showInMenu
            />,
        ],
    },
    { field: 'st_Economico', headerName: 'ECO', width: 200, sortable: true},
    { field: 'st_Placa', headerName: 'Placas', width: 200, sortable: false},
    { field: 'st_Marca', headerName: 'Marca', width: 200, sortable: false},
    { field: 'st_NumSerie', headerName: 'No. Serie', width: 200, sortable: false}];

    useEffect(() => {
        useGet();
        // Desmontamos componente
        return() => {loadRemolques.controller.abort()};
    },[isChangeRemolque]);

    const useGet = async() => {
        try{
            const result = await loadRemolques.call;    
            setRemolques(result.data.data);  
        }catch(error){
            console.log(error);
        }
    };

    const crearRemolque = () => navigate("crear");

    const editarRemolque = (id: number) => navigate("editar/" + id);

    const eliminarRemolque = async (id: number) => {
        try {
            await callEndpoint(deleteRemolque(id));
            //await useGet(); 
            setIsChangeRemolque(!isChangeRemolque); 
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Remolques</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Remolques</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Remolques Registrados ({remolques.length})</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button className="btn btn-primary btn-rounded" type="button" onClick={crearRemolque}><i className="fa fa-plus-circle"></i> Remolque</button>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-12 mt-3">
                                <DataGrid
                                    autoHeight
                                    columns={columns}
                                    rows={remolques}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    getRowId={(row: IRemolqueModel) =>  row.id_Remolque}
                                    pageSizeOptions={[1,3,5,10]}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 3,
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

export default Remolque
