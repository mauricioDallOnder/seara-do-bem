// atualização
import { useData, InputsProps } from "@/app/context/DataContext";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TabelaDados () {
  const { data } = useData();
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
  const currentMonth = formatter.format(date);
  console.log(currentMonth)
  const exportPDF = (items: InputsProps[]) => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";

    const marginLeft = 10;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const filteredData = items
      .filter((item) =>
        !Object.values(item).some(value =>
          typeof value === "string" && value.includes("DESLIGADO")
        )
      )
      .map((elt, index) => [ // Adicionando o index para a coluna Ordem
        index + 1,
        elt.nome_beneficiario || "",
        elt.data_ingresso || "",
        elt.telefone || "",
        elt.rua || "",
        elt.Observações|| "",
        elt.assinatura || "",
      ]);

    doc.text(`Tabela de beneficiarios Seara do Bem(ativos no programa no mês de ${currentMonth}/2024)`, marginLeft, 30);

    autoTable(doc, {
      head: [
        [
          "N",
          "NOME",
          "DATA DE INGRESSO",
          "TELEFONE",
          "RUA",
          "OBSERVAÇÕES",
          "ASSINATURA",
        
        ],
      ],
      body: filteredData,

      bodyStyles: {
        valign: "middle",
        halign: "center",
        cellWidth: "wrap",
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 130 },
        2: { cellWidth: 70 },
        3: { cellWidth: 70 },
        4: { cellWidth: 150 },
        5: { cellWidth: 110 },
        
      },

      styles: {
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        lineColor: [44, 62, 80],
        lineWidth: 0.75,
      },
    });
    doc.save("tabela de beneficiarios ativos.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={() => exportPDF(data)}
    >
      Tabela de ativos do programa  
    </Button>
  );
};
