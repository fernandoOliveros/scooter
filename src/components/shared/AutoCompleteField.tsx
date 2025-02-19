import { Controller, Control, Path, FieldValues } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { IAutoComplete } from "../../models/shared/autocomplete.model";
import { Fragment } from "react";

interface AutocompleteFieldProps<O extends IAutoComplete, TField extends FieldValues> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  placeholder?: string;
}

export const AutocompleteField = <O extends IAutoComplete, TField extends FieldValues>(
  props: AutocompleteFieldProps<O, TField>
) => {
  const { control, options, name } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "this field is requried"
      }}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <Fragment>
            <Autocomplete
              value={
                value
                  ? options.find((option) => {
                      return value === option.id;
                    }) ?? null
                  : null
              }
              getOptionLabel={(option) => {
                return option.label;
              }}
              onChange={(_event: any, newValue) => {
                onChange(newValue ? newValue.id : null);
              }}
              id="controllable-states-demo"
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={props.placeholder}
                  inputRef={ref}
                />
              )}
            />
            {error ? (
              <span style={{ color: "red" }}>{error.message}</span>
            ) : null}
          </Fragment>
        );
      }}
    />
  );
};
