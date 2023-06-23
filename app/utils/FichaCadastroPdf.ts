import jsPDF from "jspdf";
import { InputsProps,StringKeyedInputsProps, useData } from "../context/DataContext";
import { sectionsPDF } from "./constants";
//novo arquivo
export default function convertToDependentes(data: InputsProps) {
    const dependentes = [];
    const indexableData = data as { [key: string]: any }; // adicionado para tornar o data indexado
  
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
    const fontSizeText = 12; // Diminuindo o tamanho da fonte
    const fontSizeHeader = 16; // Diminuindo o tamanho da fonte do cabeçalho
    const margin = 10; // Diminuindo a margem
    const lineHeight = fontSizeText + 6; // Ajustando a altura da linha
    const headerLineHeight = fontSizeHeader + 8; // Ajustando a altura da linha do cabeçalho
    const titleMarginTop = 10; // Diminuindo a margem superior do título
  
    const pageWidth = doc.internal.pageSize.width;
    let YPosition = 48;
  
    doc.setFontSize(20); // Diminuindo o tamanho da fonte do título
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
            const dependent = value[i] || {};
  
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
          const text = `${field}: ${value}`;
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