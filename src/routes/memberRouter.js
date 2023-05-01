const express = require("express");

const memberController = require(`${__dirname}/../controllers/memberController`);

const router = express.Router();

router
  .route("/")
  .get(memberController.checkCookie, memberController.createHTML);

router.route("/:id").get(memberController.producePage);

module.exports = router;
