import { styled, TableCell, tableCellClasses } from "@mui/material";

export  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0d6efd',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        maxWidth:'40px',
    }
}));