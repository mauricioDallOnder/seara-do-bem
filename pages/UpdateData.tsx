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
import { useEffect, useState } from "react";
import Layout from "../app/components/TopBarComponents/Layout";
import { useTheme } from "@mui/material/styles";
import convertToDependentes, {
  generatePdf,
} from "@/app/utils/FichaCadastroPdf";

export default function ConsultaBeneficiarios() {
  const theme = useTheme();
  const [sending, setisSending] = useState(false);
  const [searchName, setSearchName] = useState<string | null>(null);
  const { data, updateDataInApi } = useData();
  const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<InputsProps>({});

  useEffect(() => {
    if (searchName) {
      fillFormWithbeneficiarioData(searchName);
    }
  }, [searchName]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const fillFormWithbeneficiarioData = (name: string) => {
    const beneficiario = data.find((item) => item.nome_beneficiario === name);
    if (beneficiario) {
      Object.entries(beneficiario).forEach(([key, value]) => {
        const formattedValue =
          key === "data_ingresso" || key.startsWith("nascimento")
            ? formatDate(value as string)
            : value;
        setValue(key as keyof InputsProps, formattedValue);
      });
    } else {
      console.log(`Could not find beneficiario with name "${name}"`);
    }
  };

  const onSubmit: SubmitHandler<InputsProps> = async (formData) => {
    setisSending(true);
    try {
      await updateDataInApi(formData);
      formData.dependentes = convertToDependentes(formData);
      const doc = generatePdf(formData);
      doc.save(
        `Ficha Cadastral de atualização - ${formData.nome_beneficiario} - ${formData.data_ingresso}`
      );
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setisSending(false);
    }
  };

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
                  m: 0,
                  p: 2.5,
                }}
              >
                <img
                  src="https://www.jotform.com/uploads/guest_9cef22d0f1ed2723/form_files/alunos.6466ab2a87c256.49461801.jpg"
                  alt=""
                />
                <Typography sx={TituloDaPagina}>
                  Consulta / Atualização de dados
                </Typography>
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
                <Autocomplete
                  options={
                    Array.isArray(data)
                      ? data.map((item, index) => ({
                          id: `${item.nome_beneficiario}-${index}`,
                          label: item.nome_beneficiario,
                        }))
                      : []
                  }
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.label
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" fullWidth />
                  )}
                  onChange={(event, newValue) =>
                    setSearchName(
                      typeof newValue === "string"
                        ? newValue
                        : newValue?.label || ""
                    )
                  }
                  freeSolo
                  autoSelect
                  autoHighlight
                  sx={{ width: 300 }}
                />
              </FormControl>
            </Box>

            <List sx={ListStyle}>
              <Typography sx={TituloSecaoStyle}>
                Seção 1 - Identificação do Beneficiário:
              </Typography>
              <Grid container spacing={2}>
                {fieldsSessao1.map(({ label, id, validation }) => (
                  <Grid item xs={12} sm={6} key={id}>
                    <InputLabel>{label}</InputLabel>
                    <TextField
                      fullWidth
                      id={id}
                      variant="standard"
                      sx={{
                        borderRadius: "4px",
                      }}
                      {...register(id as keyof InputsProps, validation)}
                      error={!!errors[id as keyof InputsProps]}
                      helperText={errors[id as keyof InputsProps]?.message}
                    />
                  </Grid>
                ))}
              </Grid>
            </List>

            <Box>
              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>
                  Seção 2 - Informações Pessoais:
                </Typography>
                <Grid container spacing={2}>
                  {fieldsSessao2.map(({ label, id}) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
                        variant="standard"
                        sx={{
                          borderRadius: "4px",
                        }}
                        {...register(id as keyof InputsProps)}
                        error={!!errors[id as keyof InputsProps]}
                        helperText={errors[id as keyof InputsProps]?.message}
                      />
                    </Grid>
                  ))}
                </Grid>
              </List>
              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>
                  Seção 3 - Informações Familiares:
                </Typography>
                <Grid container spacing={2}>
                  {fieldsSessao3.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
                        variant="standard"
                        sx={{
                          borderRadius: "4px",
                        }}
                        {...register(id as keyof InputsProps)}
                        error={!!errors[id as keyof InputsProps]}
                        helperText={errors[id as keyof InputsProps]?.message}
                      />
                    </Grid>
                  ))}
                </Grid>
              </List>
              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>
                  Seção 4 - Informações Conjuge:
                </Typography>
                <Grid container spacing={2}>
                  {fieldsSessao4.map(({ label, id}) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
                        variant="standard"
                        sx={{
                          borderRadius: "4px",
                        }}
                        {...register(id as keyof InputsProps)}
                        error={!!errors[id as keyof InputsProps]}
                        helperText={errors[id as keyof InputsProps]?.message}
                      />
                    </Grid>
                  ))}
                </Grid>
              </List>
              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>
                  Seção 5 - Dependentes:
                </Typography>

                {Array.from({ length: 5 }).map((_, dependentIndex) => (
                  <Grid container spacing={2} key={dependentIndex}>
                    {[
                      {
                        id: `nome_dependente${dependentIndex + 1}`,
                        label: "Nome",
                      },
                      {
                        id: `parentesco_dependente${dependentIndex + 1}`,
                        label: "Parentesco",
                      },
                      {
                        id: `nascimento_dependente${dependentIndex + 1}`,
                        label: "Nascimento",
                      },
                      {
                        id: `escolarizacao_dependente${dependentIndex + 1}`,
                        label: "Escolarização",
                      },
                    ].map((field) => (
                      <Grid item xs={12} sm={3} key={field.id}>
                        <InputLabel>{field.label}</InputLabel>
                        <TextField
                          fullWidth
                          id={field.id}
                          variant="standard"
                          sx={{
                            marginBottom: "14px",
                          }}
                          {...register(field.id as keyof InputsProps)}
                          error={!!errors[field.id as keyof InputsProps]}
                          helperText={errors[field.id as keyof InputsProps]?.message}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </List>
              <List sx={ListStyle}>
                {/* Instruções acima do campo de observações */}
                <Typography 
                  sx={{ 
                    color: 'red', 
                    fontWeight: 'bold', 
                    marginBottom: '10px' 
                  }}
                >
                  Instruções para preenchimento das observações:
                </Typography>
                <Typography 
                  component="div" 
                  sx={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}
                >
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>Ao escrever <strong>"DESLIGADO"</strong> em caixa alta nas observações, o beneficiário será removido do programa.</li>
                    <li>Ao escrever <strong>"fica por 3 meses a partir de DD/MM/AAAA"</strong>, o beneficiário ficará ativo por 3 meses a partir dessa data, e no último mês ele será destacado o relatório.</li>
                    <p style={{color:'red'}}>A data deve estar sempre no formato <strong>DD/MM/AAAA</strong>.</p> 
                  </ul>
                </Typography>

                <InputLabel sx={TituloSecaoStyle}>
                  Seção 6 - Observações:
                </InputLabel>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <textarea
                      placeholder='Exemplo: "DESLIGADO" ou "fica por 3 meses a partir de 10/02/2024"'
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
            <Button variant="contained" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Atualizar Dados"}
            </Button>
          </Box>
        </form>
      </Container>
    </Layout>
  );
}
