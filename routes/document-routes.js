// import express from 'express';
// import scanDocument from '../controllers/textExtract.js'

const express = require("express");
const scanDocument = require("../controllers/textExtract");

const router = express.Router();

// router.get('/', scanDocument); richieste GET

router.post('/', scanDocument.scanDocument);

module.exports = router;