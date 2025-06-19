const express=require("express");
const { createUser, login, submitPhone, verifyCode } = require("../controller/authController");
const router=express.Router();

router.route('/register').post(createUser);
router.route('/submit-phone').post(submitPhone);
router.route('/verify-phone').post(verifyCode);
router.route('/login').post(login);

module.exports=router;