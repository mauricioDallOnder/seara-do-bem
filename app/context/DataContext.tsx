//atualizado 
"use client";
import axios from "axios";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
export type Dependente = {
  nome: string;
  parentesco: string;
  nascimento: string;
  escolarização: string;
};

export type InputsProps = {
  data_ingresso: string;
  nome_beneficiario: string;
  telefone: string;
  rua: string;
  numero: string;
  bairro: string;
  referencia: string;
  tipo_habitacao: string;
  numero_nucleo_familiar: number;
  renda_familiar: string;
  Observações: string;
  estadoCivil: string;
  nascimento: string;
  rg: string;
  cpf: string;
  profissao: string;
  conjuge_nome: string;
  conjuge_telefone: string;
  conjuge_ocupacao: string;
  conjuge_profissao: string;
  parentes_dependentes: string;
  dependentes?: Dependente[];
  nome_dependente1?: string;
  parentesco_dependente1?: string;
  nascimento_dependente1?: string;
  escolarizacao_dependente1?: string;
  nome_dependente2?: string;
  parentesco_dependente2?: string;
  nascimento_dependente2?: string;
  escolarizacao_dependente2?: string;
  nome_dependente3?: string;
  parentesco_dependente3?: string;
  nascimento_dependente3?: string;
  escolarizacao_dependente3?: string;
  nome_dependente4?: string;
  parentesco_dependente4?: string;
  nascimento_dependente4?: string;
  escolarizacao_dependente4?: string;
  nome_dependente5?: string;
  parentesco_dependente5?: string;
  nascimento_dependente5?: string;
  escolarizacao_dependente5?: string;
  faltas?: string;
  assinatura?:string
};

export type StringKeyedInputsProps = {
  [key: string]: any;
};

export interface FormDataTable extends InputsProps {
  data_ingresso: string;
  nome_beneficiario: string;
  telefone: string;
  endereco: string;
  Observações: string;
}

interface ChildrenProps {
  children: ReactNode;
}

interface DataContextType {
  data: InputsProps[];
  loading: boolean; // <-- Adicionado
  sendDataToApi: (data: InputsProps) => Promise<void>;
  updateDataInApi: (data: InputsProps) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  data: [],
  loading: true, // <-- Valor inicial
  sendDataToApi: async () => {}, // Adicione esta linha
  updateDataInApi:async () => {},

});

const useData = () => {
  const context = useContext(DataContext);
  return context;
};

const DataProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [data, setData] = useState<InputsProps[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. CORRIJA O useEffect PARA RODAR APENAS UMA VEZ
  useEffect(() => {
    const getDataToApi = async () => {
      // Inicia o carregamento. Embora já comece como true, é uma boa prática.
      setLoading(true);
      try {
        const response = await axios.get("https://script.google.com/macros/s/AKfycbwPtusYugIept4aEoRqpGsSAW07rl6mbIctHo7J_TiAnAZyOexKExOBqF9sSr9NIaBrbQ/exec");
        setData(response.data);
      } catch (error) {
        console.error("Ocorreu um erro ao buscar dados da API:", error);
      } finally {
        // Finaliza o carregamento, independentemente de sucesso ou erro.
        setLoading(false);
      }
    };
    getDataToApi();
  }, []); // <-- ARRAY DE DEPENDÊNCIAS VAZIO PARA EVITAR O LOOP 
  

  const sendDataToApi = async (data: InputsProps) => {
    try {
      const response = await axios.post("/api/proxy?method=post", data); // Indicando que você deseja fazer uma requisição POST
      setData(response.data);
    } catch (error) {
      console.error("Ocorreu um erro ao enviar dados para a API:", error);
    }
  };
  const updateDataInApi = async (dataToUpdate: InputsProps) => {
    try {
      const response = await axios.post("/api/proxy?method=post", { ...dataToUpdate, method: "put" }); 
      setData(response.data);
    } catch (error) {
      console.error("Ocorreu um erro ao atualizar os dados na API:", error);
    }
  };

  return (
    // 4. FORNEÇA 'loading' NO VALUE DO PROVIDER
    <DataContext.Provider value={{ data, loading, sendDataToApi, updateDataInApi }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider, useData };
