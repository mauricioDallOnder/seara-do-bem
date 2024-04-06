// atualização
import { useData, InputsProps } from "@/app/context/DataContext";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TabelaNecessidades () {
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
    !Object.values(item).some(value => // Verifica se algum valor contém "DESLIGADO"
      typeof value === "string" && value.includes("DESLIGADO")
    ) &&
    Object.values(item).some(value => // Verifica se algum valor contém "precisa de:"
      typeof value === "string" && value.includes("precisa de:")
    )
  )
  .map((elt, index) => [
    index + 1,
    elt.nome_beneficiario || "",
    elt.telefone || "",
    elt.rua || "",
    elt.numero || "",
    elt.bairro || "",
    elt.Observações|| "",
  ]);


    doc.text(`Tabela de necessidades Seara do Bem(ativos no programa no mês de ${currentMonth}/2024)`, marginLeft, 30);

    autoTable(doc, {
      head: [
        [
          "N",
          "NOME",
          "TELEFONE",
          "RUA",
          "Nº",
          "BAIRRO",
          "OBSERVAÇÕES",
         
        
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
        3: { cellWidth: 150 },
        4: { cellWidth: 110 },
        5: { cellWidth: 110 },
        6: { cellWidth: 150 },
      },

      styles: {
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        lineColor: [44, 62, 80],
        lineWidth: 0.75,
      },
    });
    doc.save("tabela de necessidades.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={() => exportPDF(data)}
    >
      Tabela de necessidades
    </Button>
  );
};
