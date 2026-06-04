const express = require("express");

const router = express.Router();

const {
    registerUser
} = require("../controllers/RegisterController");

router.post("/", registerUser);

module.exports = router;