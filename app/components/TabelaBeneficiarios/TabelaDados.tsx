import { useData, InputsProps } from "@/app/context/DataContext";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ThreeMonthState = "none" | "active" | "last_month" | "exceeded" | "invalid_date";

type RowPdf = {
  numero: number;
  nome: string;
  dataIngresso: string;
  telefone: string;
  endereco: string;
  observacao: string;
  assinatura: string;
  threeMonthState: ThreeMonthState;
  invalidDate: boolean;
};

function normalizeText(text: string) {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function parseDdMmYyyy(dateStr: string) {
  const [day, month, year] = dateStr.split("/").map((n) => parseInt(n, 10));
  const valid =
    Number.isFinite(day) &&
    Number.isFinite(month) &&
    Number.isFinite(year) &&
    day >= 1 &&
    day <= 31 &&
    month >= 1 &&
    month <= 12 &&
    year >= 1900;

  if (!valid) return { valid: false as const, date: null as Date | null };

  const d = new Date(year, month - 1, day);

  // valida overflow (ex: 31/02 vira março)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return { valid: false as const, date: null as Date | null };
  }

  return { valid: true as const, date: d };
}

function addMonthsSafe(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function prependTag(tag: string, original: string) {
  const t = (original || "").trim();
  if (!t) return tag;
  // evita duplicar tag se já existir
  if (t.toLowerCase().includes(tag.toLowerCase())) return t;
  return `${tag}\n${t}`;
}

function detectThreeMonthsState(observacoesRaw: string) {
  const raw = observacoesRaw || "";
  const normalized = normalizeText(raw);

  // Se o texto indicar explicitamente que não deve permanecer após 3 meses,
  // isso é um sinal de "limite excedido/controle" (mesmo se a data não estiver presente).
  const exceededByText =
    /nao\s+permanec(?:er|e)\s+mais/.test(normalized) ||
    /nao\s+permanecer\s+mais\s+depois\s+dos?\s+3\s+mes/.test(normalized) ||
    /nao\s+permanecer\s+depois\s+dos?\s+3\s+mes/.test(normalized);

  // Captura data após "3 meses a partir de dd/mm/yyyy" com variações (quebras de linha já normalizadas)
  const pattern =
    /(?:fica|permanece|permanecer)?(?:\s+no\s+programa)?(?:\s+por)?\s+3\s+mes(?:es)?\s+(?:a\s*partir\s*(?:de)?)\s+(\d{2}\/\d{2}\/\d{4})/i;

  const match = normalized.match(pattern);

  if (!match) {
    // fallback: "3 meses a partir de dd/mm/yyyy"
    const fallback = /3\s+mes(?:es)?\s+(?:a\s*partir\s*(?:de)?)\s+(\d{2}\/\d{2}\/\d{4})/i;
    const m2 = normalized.match(fallback);

    if (!m2) {
      // sem data, mas texto sugere limite/controle
      if (exceededByText) return { state: "exceeded" as ThreeMonthState, dateStr: "", startDate: null as Date | null };
      return { state: "none" as ThreeMonthState, dateStr: "", startDate: null as Date | null };
    }

    const dateStr2 = m2[1];
    const parsed2 = parseDdMmYyyy(dateStr2);
    if (!parsed2.valid) return { state: "invalid_date" as ThreeMonthState, dateStr: dateStr2, startDate: null as Date | null };

    // com data: decide pelo calendário
    const startDate2 = parsed2.date!;
    const now = new Date();
    const plus2 = addMonthsSafe(startDate2, 2);
    const plus3 = addMonthsSafe(startDate2, 3);

    if (now >= plus2 && now < plus3) return { state: "last_month" as ThreeMonthState, dateStr: dateStr2, startDate: startDate2 };
    if (now >= plus3) return { state: "exceeded" as ThreeMonthState, dateStr: dateStr2, startDate: startDate2 };
    return { state: "active" as ThreeMonthState, dateStr: dateStr2, startDate: startDate2 };
  }

  const dateStr = match[1];
  const parsed = parseDdMmYyyy(dateStr);

  if (!parsed.valid) {
    return { state: "invalid_date" as ThreeMonthState, dateStr, startDate: null as Date | null };
  }

  const startDate = parsed.date!;
  const now = new Date();
  const plus2 = addMonthsSafe(startDate, 2);
  const plus3 = addMonthsSafe(startDate, 3);

  if (now >= plus2 && now < plus3) return { state: "last_month" as ThreeMonthState, dateStr, startDate };
  if (now >= plus3) return { state: "exceeded" as ThreeMonthState, dateStr, startDate };

  // Mesmo dentro do prazo, se o texto diz "não permanecer mais depois dos 3 meses",
  // mantemos como active (porque ainda não excedeu), mas isso não pinta vermelho.
  return { state: "active" as ThreeMonthState, dateStr, startDate };
}

export default function TabelaDados() {
  const { data, loading } = useData();

  const date = new Date();
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long" });
  const currentMonth = formatter.format(date);

  const exportPDF = (items: InputsProps[]) => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const marginLeft = 10;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const rowsWithoutNumber = items
      .filter(
        (item) =>
          !Object.values(item).some(
            (value) => typeof value === "string" && value.includes("DESLIGADO")
          )
      )
      .map((elt) => {
        const dataIngresso = elt.data_ingresso
          ? new Date(elt.data_ingresso).toLocaleDateString("pt-BR")
          : "";

        const endereco = `${elt.rua || ""}, ${elt.numero || ""}, ${elt.bairro || ""}`;

        const obsRaw = elt.Observações || "";
        const three = detectThreeMonthsState(obsRaw);

        let observacaoFinal = obsRaw;
        let invalidDate = false;

        if (three.state === "invalid_date") {
          observacaoFinal = 'Data invalida: a data deve estar no formato "DD/MM/AAAA".';
          invalidDate = true;
        } else if (three.state === "last_month") {
          const tag = three.dateStr
            ? `ÚLTIMO MÊS (início: ${three.dateStr})`
            : "ÚLTIMO MÊS";
          observacaoFinal = prependTag(tag, obsRaw);
        } else if (three.state === "exceeded") {
          const tag = three.dateStr
            ? `LIMITE DE PERMANENCIA EXCEDIDO (início: ${three.dateStr})`
            : "LIMITE DE PERMANENCIA EXCEDIDO (sem data detectável)";
          observacaoFinal = prependTag(tag, obsRaw);
        }

        return {
          numero: 0,
          nome: elt.nome_beneficiario || "",
          dataIngresso,
          telefone: elt.telefone || "",
          endereco,
          observacao: observacaoFinal,
          assinatura: elt.assinatura || "",
          threeMonthState: three.state,
          invalidDate,
        } as RowPdf;
      });

    const filteredData: RowPdf[] = rowsWithoutNumber
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }))
      .map((row, idx) => ({ ...row, numero: idx + 1 }));

    doc.text(
      `Tabela de beneficiarios Seara do Bem (ativos no programa no mês de ${currentMonth})`,
      marginLeft,
      30
    );

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
        row.assinatura,
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
        5: { cellWidth: 160 },
      },
      styles: {
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        lineColor: [44, 62, 80],
        lineWidth: 0.75,
      },
      didParseCell: function (cell) {
        if (cell.section !== "body") return;

        const rowData = filteredData[cell.row.index];

        // Pintar em vermelho:
        // - last_month (último mês)
        // - exceeded (limite excedido)
        if (rowData.threeMonthState === "last_month" || rowData.threeMonthState === "exceeded") {
          if ([1, 2, 3, 4, 5].includes(cell.column.index)) {
            cell.cell.styles.textColor = [255, 0, 0];
            cell.cell.styles.fontStyle = "bold";
          }
        }

        // Data inválida: apenas Observações em vermelho
        if (rowData.invalidDate && cell.column.index === 5) {
          cell.cell.styles.textColor = [255, 0, 0];
          cell.cell.styles.fontStyle = "bold";
        }
      },
      rowPageBreak: "avoid",
      pageBreak: "auto",
    });

    doc.save("tabela de beneficiarios ativos.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      size="small"
      onClick={() => exportPDF(data)}
      disabled={loading}
    >
      {loading ? "Carregando..." : "Tabela de ativos do programa"}
    </Button>
  );
}
