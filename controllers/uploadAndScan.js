// Import required AWS SDK clients and commands for Node.js.
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "../libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.
// import {
//   TextractClient,
//   AnalyzeDocumentCommand,
// } from "@aws-sdk/client-textract";
// import { TextractDocument } from "amazon-textract-response-parser";

const PutObjectCommand = require("@aws-sdk/client-s3");
const s3Client = require("../libs/s3Client");
const {TextractClient,AnalyzeDocumentCommand } = require("@aws-sdk/client-textract");
const TextractDocument = require("amazon-textract-response-parser");

const uploadAndScan = async (req, res, next) => {
  const { document, type } = req.body;
  // const document = req.body.document; equivalente

  if (document == null) {
    // errore su chiamata
    const error = new Error("Documento non presente");
    error.code = 404;
    return next(error);
  }
  
  let ret = await Upload(document);
  if (ret.result == false) {
    // errore in upload
    const error = new Error(ret.message);
    error.code = 500;
    return next(error);
  }

  // esegue l'analisi del documento
  ret = await AnalizzaDocumento(document);
  if (ret.result == false) {
    // errore in upload
    const error = new Error(ret.message);
    error.code = 500;
    return next(error);
  }

  //console.log('GET in document');
  res.json({ data: ret.words });
};

//**
//  *** Funzione principale ***
//** 
async function Upload(documentBase64) {
  // Set the parameters
  const uploadParams = {
    Bucket: "aeonvisocr2",
    Key: "uploadedImageToScan.jpg",
    Body: documentBase64,
    ContentType : "image/jpeg"
  };

  // esegue upload
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return ({ result: true, message: "caricamento con successo" });
  } catch (err) {
    return ({ result: false, message: "errore in caricamento: " + err.message });
  }
}

//**
// *** Funzione principale ***
//**
async function AnalizzaDocumento(documentBase64) {
  const client = new TextractClient({ region: "eu-west-3" });
  const words = [];

  const params = {
    Document: {
      S3Object: {
        Bucket: "aeonvisocr2",
        Name: "uploadedImageToScan.jpg"
      },
    },
    FeatureTypes: ['TABLES', 'FORMS'],
  }

  //  const params = {
  //    Document: { "Bytes": { "content": Buffer.from(documentBase64) } },
  //    FeatureTypes: ["TABLES", "FORMS"],
  //  };

  const command = new AnalyzeDocumentCommand(params);

  // async/await.
  try {
    const data = await client.send(command);
    const doc = new TextractDocument(data);

    // Iterate through content:
    let next = false;
    let PFO = "";

    for (const page of doc.iterPages()) {
      // (In Textract's output order...)
      for (const line of page.iterLines()) {
        for (const word of line.iterWords()) {
          if (word.text.substring(0, 1) == "#") {
            // PFO
            PFO = word.text;
            next = true;
            continue;
          }

          if (next) {
            // PFO
            words.push([PFO, word.text]);
            next = false;
          }
        }
      }
    }
  } catch (error) {
    return ({ result: false, words: [] }); // errore
  } finally {
    //
  }

  return ({ result: true, words: words });
}

exports.uploadAndScan = uploadAndScan;


