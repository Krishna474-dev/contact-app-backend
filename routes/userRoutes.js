const express = require("express");
const {
  userRegister,
  userLogin,
  userInfo,
} = require("../controllers/UserController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

router.get("/current", validateToken, userInfo);

module.exports = router;
