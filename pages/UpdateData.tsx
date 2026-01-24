import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
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
import { useEffect, useMemo, useState } from "react";
import Layout from "../app/components/TopBarComponents/Layout";
import { useTheme } from "@mui/material/styles";
import convertToDependentes, { generatePdf } from "@/app/utils/FichaCadastroPdf";

type BenefOption = { id: string; label: string };
type BenefStatus = "ativo" | "desligado";

const DATE_FIELD_IDS = [
  "data_ingresso",
  "nascimento",
  "nascimento_dependente1",
  "nascimento_dependente2",
  "nascimento_dependente3",
  "nascimento_dependente4",
  "nascimento_dependente5",
] as const;

function isBRDateString(v: string) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(v.trim());
}

function yyyyMmDdToBr(v: string) {
  // "2026-01-24" -> "24/01/2026"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return v;
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

function isoToBrSafely(v: string) {
  // "2022-07-31T03:00:00.000Z" -> pega só YYYY-MM-DD e converte sem timezone-shift
  const m = /^(\d{4}-\d{2}-\d{2})T/.exec(v.trim());
  if (!m) return v;
  return yyyyMmDdToBr(m[1]);
}

function toBrDateString(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();
  if (!s) return "";
  if (isBRDateString(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return isoToBrSafely(s);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return yyyyMmDdToBr(s);

  // fallback: tenta Date()
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    // cuidado com timezone: se veio em formato não-ISO, essa é a melhor tentativa
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  return s;
}

function hasDesligadoToken(text: string) {
  return /\bDESLIGADO\b/i.test(text || "");
}

function stripDesligado(text: string) {
  // remove o token "DESLIGADO" preservando o resto
  return (text || "")
    .replace(/\bDESLIGADO\b/gi, "")
    .replace(/^[\s\-–—:;,]+/g, "")
    .replace(/[\s\-–—:;,]+$/g, "")
    .trim();
}

function composeObservacoes(base: string, status: BenefStatus) {
  const cleaned = stripDesligado(base || "");
  if (status === "desligado") {
    if (!cleaned) return "DESLIGADO";
    return `DESLIGADO - ${cleaned}`;
  }
  return cleaned;
}

function normalizeForSend(formData: InputsProps, status: BenefStatus): InputsProps {
  const payload: any = { ...formData };

  // datas -> DD/MM/AAAA
  for (const k of DATE_FIELD_IDS) {
    payload[k] = toBrDateString(payload[k]);
  }

  // Observações com/sem DESLIGADO, preservando texto do usuário
  payload["Observações"] = composeObservacoes(payload["Observações"] || "", status);

  // evitar tipos inconsistentes que atrapalham planilha / script
  if (payload.telefone !== undefined && payload.telefone !== null) payload.telefone = String(payload.telefone);
  if (payload.cpf !== undefined && payload.cpf !== null) payload.cpf = String(payload.cpf);
  if (payload.rg !== undefined && payload.rg !== null) payload.rg = String(payload.rg);

  // numero_nucleo_familiar vem frequentemente como string no form
  if (typeof payload.numero_nucleo_familiar === "string") {
    const n = parseInt(payload.numero_nucleo_familiar, 10);
    payload.numero_nucleo_familiar = Number.isFinite(n) ? n : 0;
  }

  return payload as InputsProps;
}

export default function ConsultaBeneficiarios() {
  const theme = useTheme();
  const { data, loading, updateDataInApi, refreshData } = useData();

  const [sending, setIsSending] = useState(false);

  // Autocomplete controlado: evita “travadas” e permite limpar após update
  const options: BenefOption[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => ({
      id: `${item.nome_beneficiario}-${index}`,
      label: item.nome_beneficiario,
    }));
  }, [data]);

  const [selectedValue, setSelectedValue] = useState<BenefOption | string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [status, setStatus] = useState<BenefStatus>("ativo");
  const [snack, setSnack] = useState<{ open: boolean; type: "success" | "error"; msg: string }>({
    open: false,
    type: "success",
    msg: "",
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<InputsProps>({});

  // Preenche formulário ao escolher beneficiário
  const fillFormWithBeneficiarioData = (name: string) => {
    const beneficiario = Array.isArray(data) ? data.find((item) => item.nome_beneficiario === name) : undefined;

    if (!beneficiario) {
      setSnack({ open: true, type: "error", msg: `Não encontrei beneficiário com nome "${name}".` });
      return;
    }

    const mapped: any = {};
    Object.entries(beneficiario).forEach(([key, value]) => {
      if (DATE_FIELD_IDS.includes(key as any)) {
        mapped[key] = toBrDateString(value);
      } else {
        mapped[key] = value === null || value === undefined ? "" : String(value);
      }
    });

    // reset com valores mapeados (mais consistente do que setValue em loop)
    reset(mapped);

    const obs = String((beneficiario as any)["Observações"] || "");
    setStatus(hasDesligadoToken(obs) ? "desligado" : "ativo");
  };

  // Se o usuário troca entre Ativo/Desligado, ajusta automaticamente o textarea,
  // preservando o texto (só adiciona/remove o token DESLIGADO).
  const handleStatusChange = (_: any, newStatus: BenefStatus | null) => {
    if (!newStatus) return;
    const currentObs = String(getValues("Observações") || "");
    const nextObs = composeObservacoes(currentObs, newStatus);
    setStatus(newStatus);
    setValue("Observações", nextObs, { shouldDirty: true, shouldTouch: true });
  };

  const clearSelectionAndForm = () => {
    setSelectedValue(null);
    setInputValue("");
    setStatus("ativo");
    reset({});
  };


  const onSubmit: SubmitHandler<InputsProps> = async (rawFormData) => {
    setIsSending(true);

    try {
      const payload = normalizeForSend(rawFormData, status);

      // 1) Atualiza na planilha (via API)
      await updateDataInApi(payload);

      // 2) Recarrega lista (sem reload de página)
      await refreshData();

      // 3) PDF (com dados normalizados)
      payload.dependentes = convertToDependentes(payload);
      const doc = generatePdf(payload);
      doc.save(`Ficha Cadastral de atualização - ${payload.nome_beneficiario} - ${payload.data_ingresso}`);

      setSnack({ open: true, type: "success", msg: "Dados atualizados com sucesso." });

      // opcional: limpa para escolher outro rapidamente
      clearSelectionAndForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnack({ open: true, type: "error", msg: "Erro ao atualizar. Verifique o console e a API." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={BoxStyleCadastro}>
            <Box sx={{ display: "table", width: "100%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 0, p: 2.5 }}>
                <img
                  src="https://www.jotform.com/uploads/guest_9cef22d0f1ed2723/form_files/alunos.6466ab2a87c256.49461801.jpg"
                  alt=""
                />
                <Typography sx={TituloDaPagina}>Consulta / Atualização de dados</Typography>
                <Typography sx={SubtituloDaPagina}>Seara do Bem</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: theme.spacing(2),
              }}
            >
              <Typography variant="h6" component="label" htmlFor="name">
                NOME
              </Typography>

              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <Autocomplete<BenefOption, false, false, true>
                  options={options}
                  loading={loading}
                  value={selectedValue}
                  inputValue={inputValue}
                  onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                  getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
                  isOptionEqualToValue={(opt, val) =>
                    typeof val === "string" ? opt.label === val : opt.id === val.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      placeholder="Digite ou selecione..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setSelectedValue(newValue);
                    const name = typeof newValue === "string" ? newValue : newValue?.label || "";
                    setInputValue(name);

                    if (name) fillFormWithBeneficiarioData(name);
                  }}
                  freeSolo
                  autoSelect
                  autoHighlight
                  sx={{ width: 320 }}
                />
              </FormControl>

              <Button
                variant="outlined"
                onClick={clearSelectionAndForm}
                disabled={sending}
                sx={{ height: 40 }}
              >
                Limpar
              </Button>
            </Box>

            <List sx={ListStyle}>
              <Typography sx={TituloSecaoStyle}>Seção 1 - Identificação do Beneficiário:</Typography>
              <Grid container spacing={2}>
                {fieldsSessao1.map(({ label, id, validation }) => (
                  <Grid item xs={12} sm={6} key={id}>
                    <InputLabel>{label}</InputLabel>
                    <TextField
                      fullWidth
                      id={id}
                      variant="standard"
                      sx={{ borderRadius: "4px" }}
                      {...register(id as keyof InputsProps, validation)}
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
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
                        variant="standard"
                        sx={{ borderRadius: "4px" }}
                        {...register(id as keyof InputsProps)}
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
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
                        variant="standard"
                        sx={{ borderRadius: "4px" }}
                        {...register(id as keyof InputsProps)}
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
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
                        variant="standard"
                        sx={{ borderRadius: "4px" }}
                        {...register(id as keyof InputsProps)}
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
                      { id: `nome_dependente${dependentIndex + 1}`, label: "Nome" },
                      { id: `parentesco_dependente${dependentIndex + 1}`, label: "Parentesco" },
                      { id: `nascimento_dependente${dependentIndex + 1}`, label: "Nascimento (DD/MM/AAAA)" },
                      { id: `escolarizacao_dependente${dependentIndex + 1}`, label: "Escolarização" },
                    ].map((field) => (
                      <Grid item xs={12} sm={3} key={field.id}>
                        <InputLabel>{field.label}</InputLabel>
                        <TextField
                          fullWidth
                          id={field.id}
                          variant="standard"
                          sx={{ marginBottom: "14px" }}
                          placeholder={field.id.startsWith("nascimento_") ? "DD/MM/AAAA" : undefined}
                          {...register(field.id as keyof InputsProps, {
                            ...(field.id.startsWith("nascimento_")
                              ? {
                                  validate: (v) => {
                                    const s = String(v || "").trim();
                                    if (!s) return true;
                                    return isBRDateString(s) || "Use DD/MM/AAAA";
                                  },
                                }
                              : {}),
                          })}
                          error={!!errors[field.id as keyof InputsProps]}
                          helperText={errors[field.id as keyof InputsProps]?.message as any}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </List>

              <List sx={ListStyle}>
                <InputLabel sx={TituloSecaoStyle}>Seção 6 - Status e Observações:</InputLabel>
                 <Typography variant="body1" sx={{color:"red", fontWeight:"bolder",fontSize:"20px"}}>
                   Instruções para preenchimento das observações:
                  </Typography>
                  <br/>
                 <Typography variant="body2" sx={{color:"red"}}>
                    1) Ao clicar no botão desligado, o benéficiário será “DESLIGADO” do programa.
                  </Typography>
                  
                  <Typography variant="body2" sx={{color:"red"}}>
                     2)Ao clicar no botão "ATIVO" o usuário será reintegrado ao programa(caso ele tenha sido desligado)
                  </Typography>
                
                   <Typography variant="body2" sx={{color:"red"}}>
                     3)Ao escrever nas observações "fica por 3 meses a partir de DD/MM/AAAA", o beneficiário ficará ativo por 3 meses a partir dessa data, e no último mês ele será destacado o relatório.
                  </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Status do beneficiário</Typography>

                  <ToggleButtonGroup
                    exclusive
                    value={status}
                    onChange={(e, newStatus) => {
                      // evita ficar null quando clicar no mesmo botão (exclusive permite "desselecionar")
                      if (newStatus !== null) handleStatusChange(e, newStatus);
                    }}
                    aria-label="status beneficiario"
                    size="small"
                  >
                    <ToggleButton
                      value="ativo"
                      aria-label="ativo"
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "success.main",
                          color: "success.contrastText",
                          "&:hover": { bgcolor: "success.dark" },
                        },
                      }}
                    >
                      Beneficiário ativo no programa
                    </ToggleButton>

                    <ToggleButton
                      value="desligado"
                      aria-label="desligado"
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "error.main",
                          color: "error.contrastText",
                          "&:hover": { bgcolor: "error.dark" },
                        },
                      }}
                    >
                      Beneficiário desligado do programa
                    </ToggleButton>
                  </ToggleButtonGroup>

                 
                </Box>


                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <textarea
                      placeholder='Escreva observações adicionais (ex.: "precisa de guarda-roupa de solteiro")'
                      style={{
                        minWidth: "100%",
                        maxWidth: "1140px",
                        height: "110px",
                      }}
                      {...register("Observações")}
                    />
                  </Grid>
                </Grid>
              </List>
            </Box>

            <Button variant="contained" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Atualizar Dados"}
            </Button>
          </Box>
        </form>

        <Snackbar
          open={snack.open}
          autoHideDuration={4000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snack.type} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
            {snack.msg}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
