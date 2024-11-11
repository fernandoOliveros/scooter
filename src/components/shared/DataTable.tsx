// components/DataTable.tsx
import React, { useState } from 'react';
import { DataGrid, esES, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Definir los tipos para las propiedades del componente
interface DataTableProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  filters?: any; // Puede ser extendido para tipos de filtros más específicos
}

// Componente DataTable
const DataTable: React.FC<DataTableProps> = ({ columns, rows, filters }) => {
  const [searchText, setSearchText] = useState<string>('');

  // Función para aplicar los filtros
  const applyFilters = (rows: GridRowsProp) => {
    if (!searchText) return rows;
    return rows.filter(row => {
      return columns.some(col => {
        const cellValue = row[col.field as string]?.toString().toLowerCase();
        return cellValue && cellValue.includes(searchText.toLowerCase());
      });
    });
  };

  // Filtrar filas según el texto de búsqueda
  const filteredRows = applyFilters(rows);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {/* Filtro de búsqueda */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Buscar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <DataGrid
        autoHeight
        columns={columns}
        rows={filteredRows}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
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
    </Box>
  );
};

export default DataTable;