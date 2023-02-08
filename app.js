// Initialize the Amazon Cognito credentials provider
// AWS.config.region = "eu-west-3";
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "eu-west-3:dab0dfed-f4a8-4e77-9390-cd76625b6e55",
// });

// *** libreria per analizzare risposta TextExtract ***
// https://github.com/aws-samples/amazon-textract-response-parser/blob/master/src-js/README.md

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const documentRoutes = require("./routes/document-routes");
const uploaddocument = require("./routes/uploaddocument");
const uploadandscan = require("./routes/uploadandscan");

// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";

// import documentRoutes from "./routes/document-routes.js";
// import uploaddocument from "./routes/uploaddocument.js"
// import uploadandscan from "./routes/uploadandscan.js"

const app = express();

app.use(cors());

app.use(bodyParser.json({limit: '4MB'}));

app.use("/scandocument", documentRoutes);

app.use("/uploaddocument", uploaddocument);

app.use("/uploadandscan", uploadandscan);

app.use((error, req, res, next) => {
  
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 'app.js: Errore sconosciuto' });

}); // error handling

app.listen(5015);
