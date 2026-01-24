import {
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputsProps, useData } from "../app/context/DataContext";
import {
  BoxStyleCadastro,
  ListStyle,
  SubtituloDaPagina,
  TituloDaPagina,
  TituloSecaoStyle,
  fieldsSessao1,
  fieldsSessao2,
  fieldsSessao3,
  fieldsSessao4,
} from "../app/utils/constants";
import Layout from "../app/components/TopBarComponents/Layout";
import { useState } from "react";
import convertToDependentes, { generatePdf } from "@/app/utils/FichaCadastroPdf";

const DATE_FIELDS = [
  "data_ingresso",
  "nascimento",
  "nascimento_dependente1",
  "nascimento_dependente2",
  "nascimento_dependente3",
  "nascimento_dependente4",
  "nascimento_dependente5",
] as const satisfies readonly (keyof InputsProps)[];


function isValidBrDateString(s: string) {
  // DD/MM/AAAA
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false;
  const [dd, mm, yyyy] = s.split("/").map((n) => parseInt(n, 10));

  if (yyyy < 1900 || yyyy > 2100) return false;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;

  // valida overflow (ex.: 31/02)
  const d = new Date(yyyy, mm - 1, dd);
  return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd;
}

function yyyyMmDdToBr(s: string) {
  // YYYY-MM-DD -> DD/MM/YYYY
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return s;
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

function normalizeDateToBr(value: unknown) {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();
  if (!s) return "";

  // já está em DD/MM/AAAA
  if (isValidBrDateString(s)) return s;

  // veio de input type="date": YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const br = yyyyMmDdToBr(s);
    return isValidBrDateString(br) ? br : "";
  }

  // veio como ISO: YYYY-MM-DDTHH:mm:ss...
  const isoMatch = /^(\d{4}-\d{2}-\d{2})T/.exec(s);
  if (isoMatch) {
    const br = yyyyMmDdToBr(isoMatch[1]);
    return isValidBrDateString(br) ? br : "";
  }

  // Se o usuário digitou algo não reconhecido, devolve "" para evitar "Invalid Date"
  return "";
}

export default function CadastroBeneficiarios() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputsProps>({});

  const [isSending, setIsSending] = useState(false);
  const { sendDataToApi } = useData();

  const onSubmit: SubmitHandler<InputsProps> = async (formData) => {
    setIsSending(true);

    try {
      // Não mutate o objeto original do RHF; crie payload
      const payload: InputsProps = { ...formData };

      // Normaliza todas as datas para DD/MM/AAAA antes de enviar
            
      for (const key of DATE_FIELDS) {
        payload[key] = normalizeDateToBr(payload[key]);
      }

      await sendDataToApi(payload);

      payload.dependentes = convertToDependentes(payload);
      const doc = generatePdf(payload);
      doc.save(`Ficha Cadastral - ${payload.nome_beneficiario} - ${payload.data_ingresso}`);

      reset();
    } finally {
      setIsSending(false);
    }
  };

  // validação para campos de data (aceita vazio ou DD/MM/AAAA ou YYYY-MM-DD)
  const dateValidation = {
    validate: (v: any) => {
      const s = String(v || "").trim();
      if (!s) return true;

      if (isValidBrDateString(s)) return true;
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return true; // type="date"
      if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return true; // ISO

      return 'Data inválida. Use "DD/MM/AAAA".';
    },
  };

  const isDateField = (id: string) =>
  (DATE_FIELDS as readonly string[]).includes(id);

  return (
    <Layout>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={BoxStyleCadastro}>
            <Box sx={{ display: "table", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 -38px",
                  padding: "2.5em 52px",
                }}
              >
                <img
                  src="https://www.jotform.com/uploads/guest_9cef22d0f1ed2723/form_files/alunos.6466ab2a87c256.49461801.jpg"
                  alt=""
                />
                <Typography sx={TituloDaPagina}>Cadastro de Beneficiários</Typography>
                <Typography sx={SubtituloDaPagina}>Seara do Bem</Typography>
              </Box>
            </Box>

            <List sx={ListStyle}>
              <Typography sx={TituloSecaoStyle}>Seção 1 - Identificação do Beneficiário:</Typography>
              <Grid container spacing={2}>
                {fieldsSessao1.map(({ label, id, validation }) => (
                  <Grid item xs={12} sm={6} key={id}>
                    <TextField
                      fullWidth
                      id={id}
                      label={label}
                      variant="standard"
                      sx={{ borderRadius: "4px" }}
                      placeholder={isDateField(id) ? "DD/MM/AAAA" : undefined}
                      {...register(id as keyof InputsProps, {
                        ...(validation || {}),
                        ...(isDateField(id) ? dateValidation : {}),
                      })}
                      error={!!errors[id as keyof InputsProps]}
                      helperText={errors[id as keyof InputsProps]?.message as any}
                    />
                  </Grid>
                ))}
              </Grid>
            </List>

            <Box>
              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>Seção 2 - Informações Pessoais:</Typography>
                <Grid container spacing={2}>
                  {fieldsSessao2.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <TextField
                        fullWidth
                        id={id}
                        label={label}
                        variant="standard"
                        sx={{ borderRadius: "4px" }}
                        placeholder={isDateField(id) ? "DD/MM/AAAA" : undefined}
                        {...register(id as keyof InputsProps, isDateField(id) ? dateValidation : undefined)}
                        error={!!errors[id as keyof InputsProps]}
                        helperText={errors[id as keyof InputsProps]?.message as any}
                      />
                    </Grid>
                  ))}
                </Grid>
              </List>

              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>Seção 3 - Informações Familiares:</Typography>
                <Grid container spacing={2}>
                  {fieldsSessao3.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <TextField
                        fullWidth
                        id={id}
                        label={label}
                        variant="standard"
                        sx={{ borderRadius: "4px" }}
                        placeholder={isDateField(id) ? "DD/MM/AAAA" : undefined}
                        {...register(id as keyof InputsProps, isDateField(id) ? dateValidation : undefined)}
                        error={!!errors[id as keyof InputsProps]}
                        helperText={errors[id as keyof InputsProps]?.message as any}
                      />
                    </Grid>
                  ))}
                </Grid>
              </List>

              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>Seção 4 - Informações Conjuge:</Typography>
                <Grid container spacing={2}>
                  {fieldsSessao4.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <TextField
                        fullWidth
                        id={id}
                        label={label}
                        variant="standard"
                        sx={{ borderRadius: "4px" }}
                        placeholder={isDateField(id) ? "DD/MM/AAAA" : undefined}
                        {...register(id as keyof InputsProps, isDateField(id) ? dateValidation : undefined)}
                        error={!!errors[id as keyof InputsProps]}
                        helperText={errors[id as keyof InputsProps]?.message as any}
                      />
                    </Grid>
                  ))}
                </Grid>
              </List>

              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>Seção 5 - Dependentes:</Typography>

                {Array.from({ length: 5 }).map((_, dependentIndex) => (
                  <Grid container spacing={2} key={dependentIndex}>
                    {[
                      { label: "Nome", id: `nome_dependente${dependentIndex + 1}` },
                      { label: "Parentesco", id: `parentesco_dependente${dependentIndex + 1}` },
                      { label: "Nascimento", id: `nascimento_dependente${dependentIndex + 1}` },
                      { label: "Escolarização", id: `escolarizacao_dependente${dependentIndex + 1}` },
                    ].map((field) => (
                      <Grid item xs={12} sm={3} key={field.id}>
                        <TextField
                          fullWidth
                          id={field.id}
                          label={field.label}
                          variant="standard"
                          sx={{ marginBottom: "14px" }}
                          placeholder={field.id.startsWith("nascimento_") ? "DD/MM/AAAA" : undefined}
                          {...register(field.id as keyof InputsProps, field.id.startsWith("nascimento_") ? dateValidation : undefined)}
                          error={!!errors[field.id as keyof InputsProps]}
                          helperText={errors[field.id as keyof InputsProps]?.message as any}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </List>

              <List sx={ListStyle}>
                <InputLabel sx={TituloSecaoStyle}>Seção 6 - Observações:</InputLabel>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <textarea
                      style={{
                        minWidth: "100%",
                        maxWidth: "1140px",
                        height: "100px",
                      }}
                      {...register("Observações")}
                    />
                  </Grid>
                </Grid>
              </List>
            </Box>

            <Button variant="contained" type="submit" disabled={isSending}>
              {isSending ? "Cadastrando Dados..." : "Cadastrar"}
            </Button>
          </Box>
        </form>
      </Container>
    </Layout>
  );
}
