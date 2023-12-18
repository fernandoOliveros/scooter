import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";


type Props<T> = {
    open: boolean,
    items: () => T[],
    itemComponent: (value: T) => JSX.Element,
    returnCloseDialog: (close: boolean) => void
}

const DynamicList = <T,>({open, returnCloseDialog, items, itemComponent: Item}: Props<T>) => {
  return (
    <div>
        <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"  maxWidth={"lg"}>
        <DialogContent>
            { items()?.map((item, index) => (
                <Item key={index} {...item} />
            ))}
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='warning' size='medium' type="button" onClick={() => returnCloseDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DynamicList;
