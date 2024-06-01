const express = require('express');
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.post("/login",regValidate.regLoginEmail(),regValidate.checkLoginEmail, utilities.handleErrors(accountController.accountLogin))
router.get("/account/", utilities.checkLogin,  accountController.accountView)
router.get("/logout", utilities.logout )
router.get("/update", utilities.handleErrors(accountController.accountUpdate))
router.post("/update", regValidate.regupdateForm(), regValidate.checkUpdateForm, utilities.handleErrors(accountController.accountUpdatePost))
router.post("/updatepassword", utilities.handleErrors(accountController.accountPasswordPost))



module.exports = router; 
