import { useData, InputsProps } from "@/app/context/DataContext";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TabelaDados() {
  // 1. PEGUE O ESTADO 'loading' DO CONTEXTO
  const { data, loading } = useData();
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
            const startDate = new Date(year, month - 1, day);
            const now = new Date();

            const startPlusTwoMonths = new Date(startDate);
            startPlusTwoMonths.setMonth(startPlusTwoMonths.getMonth() + 2);

            const startPlusThreeMonths = new Date(startDate);
            startPlusThreeMonths.setMonth(startPlusThreeMonths.getMonth() + 3);

            if (now >= startPlusTwoMonths && now < startPlusThreeMonths) {
              // Estamos no último mês
              observacaoFinal = `ultimo mes que pega a cesta basica! (início: ${dateStr})`;
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

          // Índices das colunas:
          // 0: N
          // 1: NOME
          // 2: DATA DE INGRESSO
          // 3: TELEFONE
          // 4: ENDEREÇO
          // 5: OBSERVAÇÕES
          // 6: ASSINATURA

          // Caso seja o último mês: deixar NOME (1), DATA DE INGRESSO (2), TELEFONE (3), ENDEREÇO (4) e OBSERVAÇÕES (5) em vermelho e bold
          if (rowData.lastMonth) {
            if ([1, 2, 3, 4, 5].includes(data.column.index)) {
              data.cell.styles.textColor = [255, 0, 0];
              data.cell.styles.fontStyle = 'bold';
            }
          }

          // Caso seja data inválida: apenas OBSERVAÇÕES (5) em vermelho e bold
          if (rowData.invalidDate && data.column.index === 5) {
            data.cell.styles.textColor = [255, 0, 0];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      rowPageBreak: 'avoid',
      pageBreak: 'auto',
    });

    doc.save("tabela de beneficiarios ativos.pdf");
  };

  return (
    // 2. ATUALIZE O BOTÃO PARA USAR O ESTADO 'loading'
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={() => exportPDF(data)}
      disabled={loading} // <-- Desabilita o botão enquanto 'loading' for true
    >
      {/* Muda o texto do botão para dar feedback ao usuário */}
      {loading ? "Carregando..." : "Tabela de ativos do programa"}
    </Button>
  );
}
