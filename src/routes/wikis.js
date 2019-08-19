const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation");

router.get("/wikis/public", wikiController.publicIndex);
router.get("/wikis/private", wikiController.privateIndex);
router.get("/wikis/new", wikiController.new);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", wikiController.edit);

router.post("/wikis/create", validation.validateWiki, wikiController.create);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.post(
  "/wikis/:id/update",
  validation.validateWiki,
  wikiController.update
);

module.exports = router;
