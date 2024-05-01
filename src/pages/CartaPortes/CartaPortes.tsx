import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MenuBar from "../../components/shared/Menu";
import { ICartaPorte } from '../../models/cartaportes/cartaPorte.model';
import { RootStore } from '../../redux/store';
import { useSelector } from 'react-redux';
import { createXml, getCartaPorteByEmpresa, timbrarXmlCartaPorte } from '../../services/cartaPorte/cartaPorte.service';
import { DataGrid, esES, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import CodeIcon from '@mui/icons-material/Code';
function CartaPortes() {
    //todo: variables
    const userState = useSelector((store: RootStore) => store.user);
    const [ cartasPorte, setCartasPorte ] = useState<ICartaPorte[]>([])

    useEffect(() => {
        const _getCartasPorte =  () => {
            const loadCartasPorte = getCartaPorteByEmpresa(userState.user.id_Empresa);
                loadCartasPorte.call
            .then((result) => {
                let tempCartaPorte = result.data;
                setCartasPorte(tempCartaPorte.data);
            }).catch((error) => console.log(error));
        }
        _getCartasPorte();
    },[]);
    let navigate = useNavigate();

    //todo: FUNCIONES GLOBALES
    const createCartaPorte = () => navigate("crear");

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Acc',
            type: 'actions',
            width: 40,
            getActions: (params) => [
              <GridActionsCellItem
                icon={<CodeIcon />}
                label="Timbrar"
                onClick={() => generateXml(params.row)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<CodeIcon />}
                label="Editar"
                onClick={() => console.log(params.id)}
                showInMenu
              />,
            ],
        },
        { field: 'folio_int_cp', headerName: 'Folio interno', width: 200}
    ];

    //todo: funcion para timbrar
    const generateXml = (row: any) => {
        console.log(row);
        const loadXmlCP = createXml(row.id_CartaPorte);
        loadXmlCP.call
        .then((resp: any) => {
            console.log(resp);
            timbrarXml(row.id_CFDI);
        }).catch((error: any) => {
            console.log(error);
        });
    }

    const timbrarXml = (id_cfdi: number) => {
        const loadTimbrarXml = timbrarXmlCartaPorte(id_cfdi);
        loadTimbrarXml.call
        .then((resp: any) => {
            console.log(resp);
        }).catch((error: any) => {
            console.log(error);
        });

    }



    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Cartas Porte</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Cartas porte</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Cartas Porte generadas</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button onClick={createCartaPorte} className="btn btn-primary btn-rounded" type="button"><i className="fa fa-plus-circle"></i> Carta Porte</button>
                            </div>
                            <div className="col-12 mt-3">
                                <DataGrid
                                    autoHeight
                                    columns={columns}
                                    rows={cartasPorte}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    getRowId={(row: ICartaPorte) =>  row.id_CartaPorte}
                                    initialState={{
                                        pagination: {
                                        paginationModel: {
                                            pageSize: 25,
                                        },
                                        },
                                    }}
                                    pageSizeOptions={[25]}
                                    disableRowSelectionOnClick
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                </div>
            </div>
            <MenuBar />
        </Fragment>
    )
}

export default CartaPortes