import jsPDF from "jspdf";
import { InputsProps, StringKeyedInputsProps } from "../context/DataContext";
import { sectionsPDF } from "./constants";

export default function convertToDependentes(data: InputsProps) {
  const dependentes = [];
  const indexableData = data as { [key: string]: any };

  for (let i = 1; i <= 6; i++) {
    if (
      indexableData[`nome_dependente${i}`] ||
      indexableData[`parentesco_dependente${i}`] ||
      indexableData[`nascimento_dependente${i}`] ||
      indexableData[`escolarizacao_dependente${i}`]
    ) {
      dependentes.push({
        nome: indexableData[`nome_dependente${i}`] || "",
        parentesco: indexableData[`parentesco_dependente${i}`] || "",
        nascimento: indexableData[`nascimento_dependente${i}`] || "",
        escolarização: indexableData[`escolarizacao_dependente${i}`] || "",
      });
    }
  }

  return dependentes;
}

export const generatePdf = (data: InputsProps) => {
  const doc = new jsPDF("p", "pt");
  const fontSizeText = 12;
  const fontSizeHeader = 16;
  const margin = 10;
  const lineHeight = fontSizeText + 6;
  const headerLineHeight = fontSizeHeader + 8;
  const titleMarginTop = 10;

  const pageWidth = doc.internal.pageSize.width;
  let YPosition = 48;

  doc.setFontSize(20);
  doc.text("Seara do Bem - Ficha Cadastral", pageWidth / 2, YPosition, {
    align: "center",
  });
  YPosition += 30;

  const stringKeyedData: StringKeyedInputsProps = data;

  sectionsPDF.forEach(({ title, fields }, index) => {
    if (index !== 0) {
      YPosition += titleMarginTop;
    }

    doc.setFontSize(fontSizeHeader);
    doc.text(title, margin, YPosition);
    YPosition += headerLineHeight;

    doc.setFontSize(fontSizeText);

    fields.forEach((field) => {
      const value = stringKeyedData[field];

      if (field === "dependentes") {
        // Garante que value seja um array; caso contrário, utiliza array vazio
        const dependentesArray = Array.isArray(value) ? value : [];

        const columnWidth = (pageWidth - 2 * margin) / 4;

        ["Nome", "Parentesco", "Nascimento", "Escolarização"].forEach(
          (header, idx) => {
            doc.rect(
              margin + idx * columnWidth,
              YPosition - fontSizeText,
              columnWidth,
              lineHeight
            );
            doc.text(header, margin + idx * columnWidth + 5, YPosition);
          }
        );

        YPosition += lineHeight;

        for (let i = 0; i < 5; i++) {
          const dependent = dependentesArray[i] || {};

          // Desenha as células para cada coluna (Nome, Parentesco, etc.)
          // Ajuste conforme sua necessidade
          ["nome", "parentesco", "nascimento", "escolarização"].forEach(
            (col, idx) => {
              doc.rect(
                margin + idx * columnWidth,
                YPosition - fontSizeText,
                columnWidth,
                lineHeight
              );
              doc.text(
                dependent[col] || "",
                margin + idx * columnWidth + 5,
                YPosition
              );
            }
          );

          YPosition += lineHeight;
        }
      } else {
        const text = `${field}: ${value || ""}`;
        doc.rect(
          margin,
          YPosition - fontSizeText,
          pageWidth - 2 * margin,
          lineHeight
        );
        doc.text(text, margin, YPosition);
        YPosition += lineHeight;
      }
    });
  });

  return doc;
};
