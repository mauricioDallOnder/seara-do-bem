import React, { useMemo, useState, useCallback } from "react";
import { useData, InputsProps } from "../app/context/DataContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Layout from "@/app/components/TopBarComponents/Layout";
import { generatePdf } from "@/app/utils/FichaCadastroPdf";

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";

// ---- helpers ----
function parseDateAny(value: unknown): Date | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;

  // ISO / RFC-like
  const isoTry = new Date(s);
  if (!Number.isNaN(isoTry.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(s)) return isoTry;

  // dd/mm/yyyy | dd-mm-yyyy
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]) - 1;
    let y = Number(m[3]);
    if (y < 100) y += 2000;
    const dt = new Date(y, mo, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // fallback: try Date constructor
  const dt = new Date(s);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatPtBrDate(value: unknown): string {
  const dt = parseDateAny(value);
  if (!dt) return String(value ?? "").trim();
  return dt.toLocaleDateString("pt-BR");
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export default function ListaBeneficiarios() {
  const { data, loading } = useData();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>(""); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState<string>(""); // YYYY-MM-DD

  const handleGeneratePdf = useCallback((beneficiario: InputsProps) => {
    const doc = generatePdf(beneficiario);
    doc.save(`Ficha Cadastral - ${beneficiario.nome_beneficiario}.pdf`);
  }, []);

  const filteredAndSorted: InputsProps[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const arr = Array.isArray(data) ? data : [];

    const fromDt = dateFrom ? parseDateAny(dateFrom) : null; // dateFrom vem como YYYY-MM-DD
    const toDt = dateTo ? parseDateAny(dateTo) : null;

    const fromBound = fromDt ? startOfDay(fromDt) : null;
    const toBound = toDt ? endOfDay(toDt) : null;

    const filtered = arr.filter((b) => {
      const nomeOk = (b.nome_beneficiario || "").toLowerCase().includes(term);

      if (!nomeOk) return false;

      if (!fromBound && !toBound) return true;

      const ingressoDt = parseDateAny(b.data_ingresso);
      if (!ingressoDt) return false;

      if (fromBound && ingressoDt < fromBound) return false;
      if (toBound && ingressoDt > toBound) return false;

      return true;
    });

    filtered.sort((a, b) =>
      (a.nome_beneficiario || "").localeCompare(b.nome_beneficiario || "", "pt-BR", {
        sensitivity: "base",
      })
    );

    return filtered;
  }, [data, searchTerm, dateFrom, dateTo]);

  const total = Array.isArray(data) ? data.length : 0;
  const count = filteredAndSorted.length;

  const rows: GridRowsProp = useMemo(() => {
    return filteredAndSorted.map((b, index) => {
      // id estável: tenta cpf/rg; fallback com nome + data + index
      const id =
        (b.cpf && String(b.cpf).trim()) ||
        (b.rg && String(b.rg).trim()) ||
        `${b.nome_beneficiario || "sem_nome"}-${b.data_ingresso || "sem_data"}-${index}`;

      return { id, ...b };
    });
  }, [filteredAndSorted]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "nome_beneficiario",
        headerName: "Beneficiário",
        flex: 1,
        minWidth: 260,
        sortable: true,
      },
      {
        field: "data_ingresso",
        headerName: "Ingresso",
        width: 140,
        sortable: true,
        // para ordenar corretamente por data
        valueGetter: (params) => {
          const dt = parseDateAny(params.row?.data_ingresso);
          return dt ? dt.getTime() : null;
        },
        valueFormatter: (params) => {
          // params.value aqui é timestamp (ou null)
          if (params.value == null) return "";
          const dt = new Date(Number(params.value));
          return dt.toLocaleDateString("pt-BR");
        },
      },
      {
        field: "telefone",
        headerName: "Telefone",
        width: 160,
        sortable: false,
        valueGetter: (params) => String(params.row?.telefone ?? "").trim(),
      },
      {
        field: "bairro",
        headerName: "Bairro",
        width: 180,
        sortable: false,
        valueGetter: (params) => String(params.row?.bairro ?? "").trim(),
      },
      {
        field: "acoes",
        headerName: "Ações",
        width: 170,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<any>) => (
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => handleGeneratePdf(params.row as InputsProps)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Gerar Ficha
          </Button>
        ),
      },
    ],
    [handleGeneratePdf]
  );

  const chipLabel = useMemo(() => {
    const parts: string[] = [];
    const t = searchTerm.trim();
    if (t) parts.push(`Nome: "${t}"`);
    if (dateFrom) parts.push(`De: ${formatPtBrDate(dateFrom)}`);
    if (dateTo) parts.push(`Até: ${formatPtBrDate(dateTo)}`);
    return parts.length ? parts.join(" • ") : "Sem filtro";
  }, [searchTerm, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <>
      <Layout>
        <Box />
      </Layout>

      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Lista de Beneficiários
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {count} de {total} exibidos
              {loading ? " • carregando..." : ""}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={chipLabel} variant="outlined" />
            {(searchTerm.trim() || dateFrom || dateTo) && (
              <IconButton aria-label="limpar filtros" onClick={clearFilters}>
                <ClearIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            mb: 2,
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Pesquisar por nome"
              placeholder="Digite para filtrar..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm.trim() ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="limpar pesquisa"
                      onClick={() => setSearchTerm("")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <TextField
              label="Ingresso (De)"
              type="date"
              size="small"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", sm: 190 } }}
            />

            <TextField
              label="Ingresso (Até)"
              type="date"
              size="small"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", sm: 190 } }}
            />
          </Stack>
        </Paper>

        {/* DataTable */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box sx={{ height: { xs: "62vh", sm: "68vh" } }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25, page: 0 } },
                sorting: {
                  sortModel: [{ field: "nome_beneficiario", sort: "asc" }],
                },
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
}