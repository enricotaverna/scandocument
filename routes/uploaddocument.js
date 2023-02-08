// import express from 'express';
// import uploaddocument from "../controllers/uploadDocument.js"

const express = require("express");
const uploaddocument = require("../controllers/uploadDocument.js");

const router = express.Router();

router.post('/', uploaddocument.uploadDocument);

module.exports = router;