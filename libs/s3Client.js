// Create service client module using ES6 syntax.
//import { S3Client } from "@aws-sdk/client-s3";
const AWS = require("@aws-sdk/client-s3");

// Set the AWS Region.
const REGION = "eu-west-3";

// Create an Amazon S3 service client object.
const s3Client = new AWS.S3({ region: REGION });

exports.s3Client = s3Client; 

