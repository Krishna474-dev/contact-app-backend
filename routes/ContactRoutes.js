const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/ContactController");
const validateToken = require("../middleware/validateTokenHandler");

// Public Route: No token required

// Protected Routes: Token required
router.use(validateToken);
router.get("/", getAllContacts);
router.post("/", createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
