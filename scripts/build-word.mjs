import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { FORMATOS } from "../src/content/normas.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "plantillas", "word");
mkdirSync(root, { recursive: true });

const line = { style: BorderStyle.SINGLE, size: 4, color: "D9D0C5" };
const borders = { top: line, bottom: line, left: line, right: line };
const page = 9360;

function text(value, options = {}) {
  return new Paragraph({
    spacing: { after: options.after ?? 120 },
    heading: options.heading,
    children: [
      new TextRun({
        text: value,
        bold: options.bold,
        italics: options.italics,
        font: "Calibri",
        size: options.size ?? 21,
        color: options.color ?? "241C16",
      }),
    ],
  });
}

function cell(value, width, header = false) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    shading: header ? { type: ShadingType.CLEAR, fill: "E7F0EC" } : undefined,
    margins: { top: 70, bottom: 70, left: 90, right: 90 },
    children: [
      new Paragraph({
        children: [new TextRun({ text: value || " ", bold: header, font: "Calibri", size: 18, color: "241C16" })],
      }),
    ],
  });
}

function table(rows) {
  const columns = rows[0].length;
  const widths = columns === 2 ? [2800, 6560] : Array.from({ length: columns }, () => Math.floor(page / columns));
  return new Table({
    width: { size: page, type: WidthType.DXA },
    rows: rows.map(
      (values, index) =>
        new TableRow({
          children: values.map((value, column) => cell(String(value), widths[column], index === 0)),
        }),
    ),
  });
}

function documentFor(formato) {
  return new Document({
    styles: { default: { document: { styles: [{ id: "Normal", run: { font: "Calibri", size: 21 } }] } } },
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: "Plantilla de estudio · POO", italics: true, font: "Calibri", size: 16, color: "6F655C" })],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "No reproduce el texto oficial de la norma. Ordena el trabajo con la estructura del ítem de información.",
                    italics: true,
                    font: "Calibri",
                    size: 16,
                    color: "6F655C",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          text(formato.title, { heading: HeadingLevel.HEADING_1, size: 32, after: 200 }),
          text("1. Control del documento", { heading: HeadingLevel.HEADING_2, size: 26 }),
          table([
            ["Campo", "Valor"],
            ["Código", formato.id],
            ["Versión", "0.1 · borrador de estudio"],
            ["Norma de referencia", `${formato.norm} — ${formato.normName}`],
            ["Caso", "Préstamo del ejemplar E-204"],
            ["Autor", ""],
            ["Fecha", ""],
          ]),
          text("2. Propósito", { heading: HeadingLevel.HEADING_2, size: 26 }),
          text(formato.purpose),
          text("3. Alcance", { heading: HeadingLevel.HEADING_2, size: 26 }),
          text("El formato cubre el contenido de esta semana del curso. Las filas con ejemplo pertenecen al préstamo de biblioteca. Las filas vacías se completan con otro caso."),
          text("4. Contenido", { heading: HeadingLevel.HEADING_2, size: 26 }),
          table(formato.rows),
          text("5. Criterio de cierre", { heading: HeadingLevel.HEADING_2, size: 26 }),
          text("La plantilla está completa cuando cada fila de ejemplo se puede leer en voz alta y cada fila en blanco tiene el mismo tipo de información, aplicada a otro caso."),
          text("6. Historial", { heading: HeadingLevel.HEADING_2, size: 26 }),
          table([
            ["Versión", "Fecha", "Cambio"],
            ["0.1", "", "Primera elaboración del estudiante"],
            ["", "", ""],
          ]),
        ],
      },
    ],
  });
}

for (const formato of FORMATOS) {
  const buffer = await Packer.toBuffer(documentFor(formato));
  writeFileSync(join(root, formato.file), buffer);
}
console.log(`Plantillas Word escritas en ${root}`);
