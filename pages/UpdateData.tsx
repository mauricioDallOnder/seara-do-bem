/* eslint-disable @typescript-eslint/no-explicit-any */
//https://seara-do-bem.vercel.app/api/proxy?method=update
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { useEffect, useState } from "react";
import Layout from "../app/components/TopBarComponents/Layout";
import { useTheme } from "@mui/material/styles";
import convertToDependentes, {
  generatePdf,
} from "@/app/utils/FichaCadastroPdf";

export default function ConsultaBeneficiarios() {
  const theme = useTheme();
  const [sending, setisSending] = useState(false);
  const [searchName, setSearchName] = useState<string>("");
  const { data, updateDataInApi } = useData();
  const { register, setValue, handleSubmit, reset } = useForm<InputsProps>({});
//atualizando update
  // Chamando fillFormWithbeneficiarioData quando searchName mudar
  useEffect(() => {
    if (searchName) {
      fillFormWithbeneficiarioData(searchName);
    }
  }, [searchName]);

  const fillFormWithbeneficiarioData = (name: string) => {
    const beneficiario = data.find((item) => item.nome_beneficiario === name);
    if (beneficiario) {
      Object.entries(beneficiario).forEach(([key, value]) => {
        return setValue(key as keyof InputsProps, value);
      });
    } else {
      console.log(`Could not find beneficiario with name "${name}"`);
    }
  };

  const handleSearchNameChange = (event: SelectChangeEvent<string>) => {
    setSearchName(event.target.value);
  };

  const onSubmit: SubmitHandler<InputsProps> = async (formData) => {
    setisSending(true); // Defina isSending como true antes de enviar os dados
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
      setisSending(false); // Defina isSending como false depois que a solicitação terminar
    }
  };
console.log(data)
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
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  className="form-input"
                  value={searchName}
                  onChange={handleSearchNameChange}
                >
                  <MenuItem value="-">-</MenuItem>
                  {Array.isArray(data) &&
                    data.map((item, key) => (
                      <MenuItem key={key} value={item.nome_beneficiario}>
                        {item.nome_beneficiario}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: theme.spacing(2),
                }}
              >
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => fillFormWithbeneficiarioData(searchName)}
                >
                  Pesquisar
                </Button>
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => reset()}
                >
                  Limpar
                </Button>
              </Box>
            </Box>

            <List sx={ListStyle}>
              <Typography sx={TituloSecaoStyle}>
                Seção 1 - Identificação do Beneficiário:
              </Typography>
              <Grid container spacing={2}>
                {fieldsSessao1.map(({ label, id }) => (
                  <Grid item xs={12} sm={6} key={id}>
                    <InputLabel>{label}</InputLabel>
                    <TextField
                      fullWidth
                      id={id}
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

            <Box>
              <List sx={ListStyle}>
                <Typography sx={TituloSecaoStyle}>
                  Seção 2 - Informações Pessoais:
                </Typography>
                <Grid container spacing={2}>
                  {fieldsSessao2.map(({ label, id }) => (
                    <Grid item xs={12} sm={6} key={id}>
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
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
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
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
                      <InputLabel>{label}</InputLabel>
                      <TextField
                        fullWidth
                        id={id}
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
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <textarea
                      placeholder='Em caso de desligamento a observação deve conter, em caixa alta,a seguinte palavra: "DESLIGADO"'
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
