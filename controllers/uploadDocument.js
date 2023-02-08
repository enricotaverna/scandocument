// Import required AWS SDK clients and commands for Node.js.
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "../libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.
//import { path } from "path";
//import { fs } from "fs";

const PutObjectCommand = require("@aws-sdk/client-s3");
const s3Client = require("../libs/s3Client");

const uploadDocument = async (req, res, next) => {
  const { document, type } = req.body;

  if (document == null) {
    // errore
    const error = new Error("Documento non presente");
    error.code = 404;
    return next(error);
  }

  // Set the parameters
  const uploadParams = {
    Bucket: "aeonvisocr2",
    // Add the required 'Key' parameter using the 'path' module.
    Key: "uploadedImageToScan.jpg",
    // Add the required 'Body' parameter
    Body: document,
  };

  // esegue upload
  // Upload file to specified bucket.
  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("Success", data);
    //console.log('GET in document');
    res.json({ message: "successo!" });
  } catch (err) {
    console.log("Error", err);
  }
};

exports.uploadDocument = uploadDocument;
