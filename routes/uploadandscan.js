// import express from 'express';
// import uploadandscan from "../controllers/uploadAndScan.js"

const express = require("express");
const uploadandscan = require("../controllers/uploadAndScan.js");

const router = express.Router();

router.post('/', uploadandscan.uploadAndScan);

module.exports = router;