const express = require("express");

const memberController = require(`${__dirname}/../controllers/memberController`);
const validation = require(`${__dirname}/../utils/validation`);

const router = express.Router();

router
  .route("/")
  .get(validation.checkCookie, memberController.createHTML);

router.route("/:id").get(validation.checkCookie, memberController.producePage);

module.exports = router;
