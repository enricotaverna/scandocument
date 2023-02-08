import {
  TextractClient,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";
import {
  TextractDocument,
  TextractExpense,
} from "amazon-textract-response-parser";

// *** Richiamato da router ***
const scanDocument = async (req, res, next) => {
  const { document, type } = req.body;
  // const document = req.body.document; equivalente

  if (document == null) {
    // errore
    const error = new Error("Documento non presente");
    error.code = 404;
    return next(error);
  }

  // esegue l'analisi del documento
  const words = await AnalizzaDocumento(document, type);

  //console.log('GET in document');
  res.json({ data: words });
};

// *** Funzione principale ***
async function AnalizzaDocumento(documentBase64, type) {
  const client = new TextractClient({ region: "eu-west-3" });
  let words = [];

  const byteArray = new Buffer(
    documentBase64.replace(/^[\w\d;:\/]+base64\,/g, ""),
    "base64"
  );

  const params = {
    Document: { Bytes: byteArray },
    FeatureTypes: ["TABLES", "FORMS"],
  };

  const command = new AnalyzeDocumentCommand(params);

  // async/await.
  try {
    const data = await client.send(command);
    const doc = new TextractDocument(data);

    if (type == "byCell") {
      words = estraiPerCella(doc);
    } else {
      words = estraiPerParola(doc);
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    //
  }
  return words;
}

// *** estraiPerParola ***
function estraiPerParola(doc) {

  const words = [];
  let next = false;
  let PFO = "";

  // Iterate through content:
  for (const page of doc.iterPages()) {
    // (In Textract's output order...)
    for (const line of page.iterLines()) {
      for (const word of line.iterWords()) {

        if (word.text.substring(0, 1) == "#") {
          // PFO
          PFO = word.text.replaceAll("#", "");
          next = true;
          continue;
        }

        if (next) {
          // PFO
          words.push([PFO, word.text.replaceAll(",", ".")]); // converte virgola per decimali
          next = false;
        }
      }
    }
  }

  return words;
}

// *** estraiPerCella ***
function estraiPerCella(doc) {

  const words = [];
  let PFO,numeroOCR;
  let startIndex, endIndex;

  // loop sugli elementi della pagina fino alla cella 
  for (const page of doc.iterPages()) {
    for (const table of page.iterTables()) {
      for (const row of table.iterRows()) {
        for (const cell of row.iterCells()) {
         
          //estrai PFO
          const startDelimiter = "#";
          const endDelimiter = "#";

          startIndex = cell.text.indexOf(startDelimiter) + startDelimiter.length;

          // continua solo se la cella contiene un PFO
          if (startIndex == 0)
            continue;
        
          endIndex = cell.text.indexOf(endDelimiter, startIndex);
          PFO = cell.text.substring(startIndex, endIndex);
          
          // rimuovi PFO dalla stringa e tutti i caratteri a parte numeri e virgola
          numeroOCR = cell.text.replace(PFO, "").replace(/[^\d,]/g, "");

          // carica array
          words.push([PFO, numeroOCR.replaceAll(",", ".")]);
        }
      }
    }
  }

  return words;
}

export default scanDocument;
