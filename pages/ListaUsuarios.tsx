import React, { useState } from "react";
import { useData, InputsProps } from "../app/context/DataContext";
import { TextField, Button, Typography, Box } from "@mui/material";
import { generatePdf } from "@/app/utils/FichaCadastroPdf"; 

export default function ListaBeneficiarios() {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filtra os beneficiários pelo nome
  const filteredData: InputsProps[] = data.filter((beneficiario: InputsProps) =>
    beneficiario.nome_beneficiario
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleGeneratePdf = (beneficiario: InputsProps) => {
    const doc = generatePdf(beneficiario);
    doc.save(`Ficha Cadastral - ${beneficiario.nome_beneficiario}.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Beneficiários
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Pesquisar por nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
      </Box>

      {filteredData.length === 0 ? (
        <Typography>Nenhum beneficiário encontrado.</Typography>
      ) : (
        filteredData.map((beneficiario, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              pb: 1,
            }}
          >
            <Typography variant="body1">
              {beneficiario.nome_beneficiario}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGeneratePdf(beneficiario)}
            >
              Gerar Ficha
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
}
