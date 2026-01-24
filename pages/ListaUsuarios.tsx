import React, { useMemo, useState } from "react";
import { useData, InputsProps } from "../app/context/DataContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { generatePdf } from "@/app/utils/FichaCadastroPdf";
import Layout from "@/app/components/TopBarComponents/Layout";

export default function ListaBeneficiarios() {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAndSorted: InputsProps[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = (Array.isArray(data) ? data : []).filter((b) =>
      (b.nome_beneficiario || "").toLowerCase().includes(term)
    );

    filtered.sort((a, b) =>
      (a.nome_beneficiario || "").localeCompare(b.nome_beneficiario || "", "pt-BR", {
        sensitivity: "base",
      })
    );

    return filtered;
  }, [data, searchTerm]);

  const handleGeneratePdf = (beneficiario: InputsProps) => {
    const doc = generatePdf(beneficiario);
    doc.save(`Ficha Cadastral - ${beneficiario.nome_beneficiario}.pdf`);
  };

  const total = Array.isArray(data) ? data.length : 0;
  const count = filteredAndSorted.length;

  return (
    <>
    <Layout>
      <Box></Box>
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
          </Typography>
        </Box>

        <Chip
          label={searchTerm.trim() ? `Filtro: "${searchTerm.trim()}"` : "Sem filtro"}
          variant="outlined"
        />
      </Stack>

      {/* Search bar */}
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
      </Paper>

      {/* List container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            maxHeight: { xs: "62vh", sm: "68vh" },
            overflowY: "auto",
          }}
        >
          {count === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Nenhum beneficiário encontrado.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tente ajustar o termo de pesquisa.
              </Typography>
            </Box>
          ) : (
            filteredAndSorted.map((b, index) => {
              const telefone = (b.telefone || "").toString().trim();
              const bairro = (b.bairro || "").toString().trim();
              const enderecoResumo = [bairro].filter(Boolean).join(" • ");

              return (
                <React.Fragment key={`${b.nome_beneficiario}-${index}`}>
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: "100%", sm: 520 },
                        }}
                        title={b.nome_beneficiario}
                      >
                        {b.nome_beneficiario}
                      </Typography>

                      {(telefone || enderecoResumo) && (
                        <Typography variant="body2" color="text.secondary">
                          {telefone ? `Tel: ${telefone}` : ""}
                          {telefone && enderecoResumo ? " • " : ""}
                          {enderecoResumo}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() => handleGeneratePdf(b)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        alignSelf: { xs: "stretch", sm: "auto" },
                      }}
                    >
                      Gerar Ficha
                    </Button>
                  </Box>

                  {index < count - 1 && <Divider />}
                </React.Fragment>
              );
            })
          )}
        </Box>
      </Paper>
    </Box>
    
    </>
  );
}
