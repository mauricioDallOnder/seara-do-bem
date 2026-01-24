import { useData, InputsProps } from "@/app/context/DataContext";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ProgramState = "none" | "active" | "last_month" | "exceeded" | "invalid_date";
type ProgramRule = "none" | "duration" | "until";

type RowPdf = {
  numero: number;
  nome: string;
  dataIngresso: string;
  telefone: string;
  endereco: string;
  observacao: string;
  assinatura: string;
  programState: ProgramState;
  invalidDate: boolean;

  rule: ProgramRule;
  months?: number;       // 1..6 (quando rule="duration")
  startDateStr?: string; // dd/mm/yyyy (quando rule="duration")
  endDateStr?: string;   // dd/mm/yyyy (quando rule="until" ou calculado)
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

  // valida overflow (ex.: 31/02 vira março)
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

function subMonthsSafe(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

function monthsFromToken(token: string): number | null {
  const t = normalizeText(token);

  const n = parseInt(t, 10);
  if (Number.isFinite(n)) return n;

  const map: Record<string, number> = {
    um: 1,
    uma: 1,
    dois: 2,
    duas: 2,
    tres: 3,
    quatro: 4,
    cinco: 5,
    seis: 6,
  };
  return map[t] ?? null;
}

function prependTag(tag: string, original: string) {
  const t = (original || "").trim();
  if (!t) return tag;
  if (normalizeText(t).includes(normalizeText(tag))) return t;
  return `${tag}\n${t}`;
}

// Retorna algo no formato pt-BR só para exibir na observação/tag.
// Para lógica usamos Date.
function formatPtBr(d: Date) {
  return d.toLocaleDateString("pt-BR");
}

function detectFromDuration(normalized: string): {
  state: ProgramState;
  rule: ProgramRule;
  months?: number;
  startDateStr?: string;
  endDateStr?: string;
} | null {
  // Grupos posicionais:
  // 1 => months token
  // 2 => date dd/mm/yyyy
  const pattern =
    /(?:fica|permanece|permanecer)?(?:\s+no\s+programa)?(?:\s+por)?\s+(\d+|um|uma|dois|duas|tres|quatro|cinco|seis)\s+mes(?:es)?\s+(?:a\s*partir\s*(?:de)?)\s+(\d{2}\/\d{2}\/\d{4})/i;

  const match = normalized.match(pattern);
  if (!match) return null;

  const monthsToken = match[1];
  const startDateStr = match[2];

  const months = monthsFromToken(monthsToken);
  if (!months || months < 1 || months > 6) {
    return { state: "none", rule: "duration" };
  }

  const parsed = parseDdMmYyyy(startDateStr);
  if (!parsed.valid) {
    return { state: "invalid_date", rule: "duration", months, startDateStr };
  }

  const startDate = parsed.date!;
  const now = new Date();

  const endDate = addMonthsSafe(startDate, months);
  const lastMonthStart = addMonthsSafe(startDate, Math.max(months - 1, 0));

  if (now >= endDate) {
    return {
      state: "exceeded",
      rule: "duration",
      months,
      startDateStr,
      endDateStr: formatPtBr(endDate),
    };
  }

  if (now >= lastMonthStart) {
    return {
      state: "last_month",
      rule: "duration",
      months,
      startDateStr,
      endDateStr: formatPtBr(endDate),
    };
  }

  return {
    state: "active",
    rule: "duration",
    months,
    startDateStr,
    endDateStr: formatPtBr(endDate),
  };
}

function detectFromUntil(normalized: string): {
  state: ProgramState;
  rule: ProgramRule;
  endDateStr?: string;
} | null {
  // Grupo posicional:
  // 1 => date dd/mm/yyyy
  // Observação: "até" vira "ate" pela normalização
  const pattern = /\bate\b\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i;
  const match = normalized.match(pattern);
  if (!match) return null;

  const endDateStr = match[1];
  const parsed = parseDdMmYyyy(endDateStr);

  if (!parsed.valid) {
    return { state: "invalid_date", rule: "until", endDateStr };
  }

  const endDate = parsed.date!;
  const now = new Date();

  const lastMonthStart = subMonthsSafe(endDate, 1);

  // Encerrado: após a data final (se quiser incluir o dia final como encerrado, troque > por >=)
  if (now > endDate) {
    return { state: "exceeded", rule: "until", endDateStr };
  }

  if (now >= lastMonthStart) {
    return { state: "last_month", rule: "until", endDateStr };
  }

  return { state: "active", rule: "until", endDateStr };
}

function detectProgramStateFromObservacoes(observacoesRaw: string): {
  state: ProgramState;
  rule: ProgramRule;
  months?: number;
  startDateStr?: string;
  endDateStr?: string;
} {
  const raw = observacoesRaw || "";
  const normalized = normalizeText(raw);

  // prioridade: "por X meses a partir de"
  const byDuration = detectFromDuration(normalized);
  if (byDuration) return byDuration;

  // fallback: "até DD/MM/AAAA"
  const byUntil = detectFromUntil(normalized);
  if (byUntil) return byUntil;

  return { state: "none", rule: "none" };
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
        const detected = detectProgramStateFromObservacoes(obsRaw);

        let observacaoFinal = obsRaw;
        let invalidDate = false;

        if (detected.state === "invalid_date") {
          observacaoFinal = 'Data inválida: use "DD/MM/AAAA".';
          invalidDate = true;
        } else if (detected.state === "last_month") {
          if (detected.rule === "duration") {
            observacaoFinal = prependTag(
              `ÚLTIMO MÊS (prazo: ${detected.months} mês(es), início: ${detected.startDateStr})`,
              obsRaw
            );
          } else if (detected.rule === "until") {
            observacaoFinal = prependTag(
              `ÚLTIMO MÊS (até: ${detected.endDateStr})`,
              obsRaw
            );
          }
        } else if (detected.state === "exceeded") {
          if (detected.rule === "duration") {
            observacaoFinal = prependTag(
              `PRAZO DE PERMANÊNCIA NO PROGRAMA ENCERRADO (prazo: ${detected.months} mês(es), início: ${detected.startDateStr})`,
              obsRaw
            );
          } else if (detected.rule === "until") {
            observacaoFinal = prependTag(
              `PRAZO DE PERMANÊNCIA NO PROGRAMA ENCERRADO (até: ${detected.endDateStr})`,
              obsRaw
            );
          }
        }

        return {
          numero: 0,
          nome: elt.nome_beneficiario || "",
          dataIngresso,
          telefone: elt.telefone || "",
          endereco,
          observacao: observacaoFinal,
          assinatura: elt.assinatura || "",
          programState: detected.state,
          invalidDate,
          rule: detected.rule,
          months: detected.months,
          startDateStr: detected.startDateStr,
          endDateStr: detected.endDateStr,
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
        5: { cellWidth: 180 },
      },
      styles: {
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        lineColor: [44, 62, 80],
        lineWidth: 0.75,
      },
      didParseCell: function (cell) {
        if (cell.section !== "body") return;

        const rowData = filteredData[cell.row.index];

        // vermelho para: último mês OU prazo encerrado
        if (rowData.programState === "last_month" || rowData.programState === "exceeded") {
          if ([1, 2, 3, 4, 5].includes(cell.column.index)) {
            cell.cell.styles.textColor = [255, 0, 0];
            cell.cell.styles.fontStyle = "bold";
          }
        }

        // data inválida: apenas Observações em vermelho
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
