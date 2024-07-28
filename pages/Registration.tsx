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

export default function CadastroBeneficiarios() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InputsProps>({});
  const [isSending, setIsSending] = useState(false);
  const { sendDataToApi } = useData();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const onSubmit: SubmitHandler<InputsProps> = async (data) => {
    setIsSending(true);
    if (data.data_ingresso) {
      data.data_ingresso = formatDate(data.data_ingresso);
    }
    // Formatar outras datas se necessário

    await sendDataToApi(data);
    data.dependentes = convertToDependentes(data);
    const doc = generatePdf(data);
    doc.save(`Ficha Cadastral - ${data.nome_beneficiario} - ${data.data_ingresso}`);
    reset();
    setIsSending(false);
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
                  margin: "0 -38px",
                  padding: "2.5em 52px",
                }}
              >
                <img
                  src="https://www.jotform.com/uploads/guest_9cef22d0f1ed2723/form_files/alunos.6466ab2a87c256.49461801.jpg"
                  alt=""
                />
                <Typography sx={TituloDaPagina}>
                  Cadastro de Beneficiários
                </Typography>
                <Typography sx={SubtituloDaPagina}>Seara do Bem</Typography>
              </Box>
            </Box>
            <List sx={ListStyle}>
              <Typography sx={TituloSecaoStyle}>
                Seção 1 - Identificação do Beneficiário:
              </Typography>
              <Grid container spacing={2}>
                {fieldsSessao1.map(({ label, id, validation }) => (
                  <Grid item xs={12} sm={6} key={id}>
                    <TextField
                      fullWidth
                      id={id}
                      label={label}
                      variant="standard"
                      sx={{
                        borderRadius: "4px",
                      }}
                      {...register(id as keyof InputsProps, validation)} // aplicação da validação
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
                  {fieldsSessao2.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <TextField
                        fullWidth
                        id={id}
                        label={label}
                        variant="standard"
                        sx={{
                          borderRadius: "4px",
                        }}
                        {...register(id as keyof InputsProps)} // asserção de tipo aqui
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
                      <TextField
                        fullWidth
                        id={id}
                        label={label}
                        variant="standard"
                        sx={{
                          borderRadius: "4px",
                        }}
                        {...register(id as keyof InputsProps)} // asserção de tipo aqui
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
                  {fieldsSessao4.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <TextField
                        fullWidth
                        id={id}
                        label={label}
                        variant="standard"
                        sx={{
                          borderRadius: "4px",
                        }}
                        {...register(id as keyof InputsProps)} // asserção de tipo aqui
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
                        label: "Nome",
                        id: `nome_dependente${dependentIndex + 1}`,
                      },
                      {
                        label: "Parentesco",
                        id: `parentesco_dependente${dependentIndex + 1}`,
                      },
                      {
                        label: "Nascimento",
                        id: `nascimento_dependente${dependentIndex + 1}`,
                      },
                      {
                        label: "Escolarização",
                        id: `escolarizacao_dependente${dependentIndex + 1}`,
                      },
                    ].map((field) => (
                      <Grid item xs={12} sm={3} key={field.id}>
                        <TextField
                          fullWidth
                          id={field.id}
                          label={field.label}
                          variant="standard"
                          sx={{
                            marginBottom: "14px",
                          }}
                          {...register(field.id as keyof InputsProps)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </List>
              <List sx={ListStyle}>
                <InputLabel sx={TituloSecaoStyle}>
                  Seção 6 - Observações:
                </InputLabel>
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
              {isSending ? 'Cadastrando Dados...' : 'Cadastrar'}
            </Button>
          </Box>
        </form>
      </Container>
    </Layout>
  );
}
