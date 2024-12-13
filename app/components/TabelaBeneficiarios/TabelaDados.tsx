import { useData, InputsProps } from "@/app/context/DataContext";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TabelaDados() {
  const { data } = useData();
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
  const currentMonth = formatter.format(date);

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
      .map((elt, index) => {
        const dataIngresso = elt.data_ingresso
          ? new Date(elt.data_ingresso).toLocaleDateString('pt-BR')
          : "";

        const endereco = `${elt.rua || ""}, ${elt.numero || ""}, ${elt.bairro || ""}`;

        let observacaoFinal = elt.Observações || "";
        let lastMonth = false;
        let invalidDate = false;

        // Verifica se contém a frase-chave para 3 meses
        const pattern = /fica por 3 meses a partir de\s+(\d{2}\/\d{2}\/\d{4})/;
        const match = observacaoFinal.match(pattern);

        if (match) {
          const dateStr = match[1]; // "dd/mm/yyyy"
          const [day, month, year] = dateStr.split("/").map(Number);

          // Valida a data
          const validDate = !isNaN(day) && !isNaN(month) && !isNaN(year) &&
            day > 0 && day <= 31 && month > 0 && month <= 12 && year > 0;

          if (!validDate) {
            // Data inválida
            observacaoFinal = 'Data invalida verificar o formato que a data foi escrita deve ser "DD/MM/YYYY"!';
            invalidDate = true;
          } else {
            // Data válida, verificar se estamos no último mês
            const startDate = new Date(year, month - 1, day); // mês base 0
            const now = new Date();

            // O último mês seria após completar 2 meses do startDate.
            // Exemplo: startDate = 10/02/2024. 3 meses: 
            // 1º mês: até 10/03/2024
            // 2º mês: até 10/04/2024
            // 3º mês: até 10/05/2024
            // Se agora >= (startDate + 2 meses) e < (startDate + 3 meses), é o último mês.

            const startPlusTwoMonths = new Date(startDate);
            startPlusTwoMonths.setMonth(startPlusTwoMonths.getMonth() + 2);

            const startPlusThreeMonths = new Date(startDate);
            startPlusThreeMonths.setMonth(startPlusThreeMonths.getMonth() + 3);

            if (now >= startPlusTwoMonths && now < startPlusThreeMonths) {
              // Estamos no último mês
              observacaoFinal = "ultimo mes que pega a cesta basica!";
              lastMonth = true;
            }
          }
        }

        return {
          numero: index + 1,
          nome: elt.nome_beneficiario || "",
          dataIngresso,
          telefone: elt.telefone || "",
          endereco,
          observacao: observacaoFinal,
          assinatura: elt.assinatura || "",
          lastMonth,
          invalidDate
        };
      })
      .sort((a, b) => {
        const nameA = a.nome;
        const nameB = b.nome;
        return nameA.localeCompare(nameB);
      });

    doc.text(`Tabela de beneficiarios Seara do Bem(ativos no programa no mês de ${currentMonth}/2024)`, marginLeft, 30);

    autoTable(doc, {
      head: [
        [
          "N",
          "NOME",
          "DATA DE INGRESSO",
          "TELEFONE",
          "ENDEREÇO",
          "OBSERVAÇÕES",
          "ASSINATURA",
        ],
      ],
      body: filteredData.map((row) => [
        row.numero,
        row.nome,
        row.dataIngresso,
        row.telefone,
        row.endereco,
        row.observacao,
        row.assinatura
      ]),
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
      didParseCell: function (data) {
        if (data.section === 'body') {
          const rowData = filteredData[data.row.index];

          // Se estiver no último mês, o nome (coluna 1) fica vermelho
          // Se a data for inválida ou for o último mês, a observação (coluna 5) fica vermelha
          if (data.column.index === 1 && rowData.lastMonth) {
            data.cell.styles.textColor = [255, 0, 0];
          }
          if (data.column.index === 5 && (rowData.lastMonth || rowData.invalidDate)) {
            data.cell.styles.textColor = [255, 0, 0];
          }
        }
      },
      rowPageBreak: 'avoid',
      pageBreak: 'auto',
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
}
