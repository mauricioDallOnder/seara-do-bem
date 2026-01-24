"use client";
import axios from "axios";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
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
  assinatura?: string;
};

interface ChildrenProps {
  children: ReactNode;
}

interface DataContextType {
  data: InputsProps[];
  loading: boolean;
  refreshData: () => Promise<void>;
  sendDataToApi: (data: InputsProps) => Promise<void>;
  updateDataInApi: (data: InputsProps) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  data: [],
  loading: true,
  refreshData: async () => {},
  sendDataToApi: async () => {},
  updateDataInApi: async () => {},
});

const useData = () => useContext(DataContext);

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwPtusYugIept4aEoRqpGsSAW07rl6mbIctHo7J_TiAnAZyOexKExOBqF9sSr9NIaBrbQ/exec";

const DataProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [data, setData] = useState<InputsProps[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(GAS_URL);
      const next = Array.isArray(response.data) ? response.data : [];
      setData(next);
    } catch (error) {
      console.error("Ocorreu um erro ao buscar dados da API:", error);
      setData([]); // garante array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const sendDataToApi = async (payload: InputsProps) => {
    try {
      // Apps Script normalmente escreve via POST
      await axios.post("/api/proxy?method=post", payload);
      await refreshData();
    } catch (error) {
      console.error("Ocorreu um erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  const updateDataInApi = async (dataToUpdate: InputsProps) => {
    try {
      // Mantém compatível com seu Apps Script: update via POST com method override
      await axios.post("/api/proxy?method=post", { ...dataToUpdate, method: "put" });
      await refreshData();
    } catch (error) {
      console.error("Ocorreu um erro ao atualizar os dados na API:", error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ data, loading, refreshData, sendDataToApi, updateDataInApi }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider, useData };
