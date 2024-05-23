const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDisplayInfoCar);
router.get("/", invController.buildInventoryManagement);
router.get("/addclassification", utilities.handleErrors(invController.addclassificationView));
router.post("/addclassification", regValidate.regclassification(),  regValidate.checkclassification, utilities.handleErrors(invController.addClassificationController));
router.get("/addinventory", utilities.handleErrors(invController.addInventoryView));
router.post("/addinventory",regValidate.addinventory(), regValidate.checkinventory , utilities.handleErrors(invController.addInventoryController)); 






module.exports = router; 