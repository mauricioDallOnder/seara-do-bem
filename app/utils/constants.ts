//novo arquivo
export const fieldsSessao1 = [
  { label: "Nome do Beneficiário", id: "nome_beneficiario" },
  { label: "Data de Ingresso", id: "data_ingresso" },
  { label: "Telefone", id: "telefone" },
  { label: "Rua", id: "rua" },
  { label: "Nº", id: "numero" },
  { label: "Bairro", id: "bairro" },

];
export const fieldsSessao2 = [
  { label: "Estado Civil", id: "estadoCivil" },
  { label: "Data de Nascimento", id: "nascimento" },
  { label: "RG", id: "rg" },
  { label: "CPF", id: "cpf" },
  { label: "Profissão", id: "profissao" },
];

export const fieldsSessao3 = [
  { label: "Número do Núcleo Familiar", id: "numero_nucleo_familiar" },
  { label: "Tipo de Habitação", id: "tipo_habitacao" },
  { label: "Renda Familiar", id: "renda_familiar" },
  { label: "Referências", id: "referencia" },
];

export const fieldsSessao4 = [
  { label: "Nome do Cônjuge", id: "conjuge_nome" },
  { label: "Telefone do Cônjuge", id: "conjuge_telefone" },
  { label: "Ocupação do Cônjuge", id: "conjuge_ocupacao" },
  { label: "Profissão do Cônjuge", id: "conjuge_profissao" },
];


export const sectionsPDF = [
  {
    title: "Seção 1 - Identificação do Beneficiário",
    fields: ["data_ingresso", "nome_beneficiario", "telefone", "rua","numero","bairro"],
  },
  {
    title: "Seção 2 - Informações Pessoais",
    fields: ["estadoCivil", "nascimento", "rg", "cpf", "profissao"],
  },
  {
    title: "Seção 3 - Informações Familiares",
    fields: [
      "numero_nucleo_familiar",
      "tipo_habitacao",
      "renda_familiar",
      "referencia",
    ],
  },
  {
    title: "Seção 4 - Informações Conjuge",
    fields: [
      "conjuge_nome",
      "conjuge_telefone",
      "conjuge_ocupacao",
      "conjuge_profissao",
    ],
  },
  { title: "Seção 5 - Dependentes", fields: ["dependentes"] },
  { title: "Seção 6 - Observações", fields: ["Observações"] },
];

export const BoxStyleCadastro = {
  backgroundColor: "#ffffff",
  border: "10px solid",
  borderImageSlice: "1",
  borderWidth: "9px",
  borderImageSource: "linear-gradient(to left, #FDA188, #FDA188)",
  borderRadius: "3px",
  boxShadow: "0 9px 40px rgba(42, 42, 42)",
  fontSize: "16px",
  maxWidth: "752px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  margin: "72px auto",
  padding: "2.5em 52px",
};

export const TituloDaPagina = {
  marginTop: "1.125rem",
  width: "100%",
  marginBottom: "auto",
  textAlign: "center",
  color: "#000000",
  fontSize: "2em",
  fontWeight: "600",
  lineHeight: "1.45",
};

export const SubtituloDaPagina = {
  color: "#264B67",
  fontSize: "1em",
  fontWeight: "500",
  lineHeight: "1.6",
};

export const ListStyle = {
  borderColor: "#83D0E4",
  borderBottom: "1px solid #83D0E4",
  padding: "14px",
  marginTop: "1.125em",
  marginBottom: "auto",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};
export const TituloSecaoStyle = {
  color: "#000000",
  fontSize: "1.25rem",
  marginBottom: "20px",
  fontWeight: "600",
  lineHeight: "1.45",
};
