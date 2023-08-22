import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { Fragment, lazy } from 'react';

const UnidadesForm = lazy(() => import('../../pages/Unidades/Form/UnidadForm'));
const RemolquesForm = lazy(() => import('../../pages/Remolques/Form/RemolqueForm'));
const OperadoresForm = lazy(() => import('../../pages/Operadores/Form/OperadorForm'));

export interface Props {
    open: boolean,
    returnCloseDialog: (close: boolean) => void,
    optionForm: number
}

export const formsOptions: any = {
    1: <UnidadesForm />,
    2: <RemolquesForm />,
    3: <OperadoresForm />
}

const DialogForms = ({open, returnCloseDialog, optionForm}: Props) => {

    console.log(optionForm);
    const selectForm = (option: number) => {
        console.log("FIND FORM");
        return formsOptions[option];
    }
    return (
        <Fragment>
            <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
                <DialogContent>
                    {selectForm(optionForm)}
                </DialogContent>
                <DialogActions>
                    <button className='btn btn-danger' onClick={() => returnCloseDialog(false)}>Salir sin guardar</button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default DialogForms