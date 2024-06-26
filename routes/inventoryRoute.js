const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const invCont = require("../controllers/invController")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDisplayInfoCar);
router.get("/", utilities.checkAcess,  invController.buildInventoryManagement);
router.get("/addclassification", utilities.handleErrors(invController.addclassificationView));
router.post("/addclassification", regValidate.regclassification(),  regValidate.checkclassification, utilities.handleErrors(invController.addClassificationController));
router.get("/addinventory", utilities.handleErrors(invController.addInventoryView));
router.post("/addinventory",regValidate.addinventory(), regValidate.checkinventory , utilities.handleErrors(invController.addInventoryController)); 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView) )
router.post("/update/", utilities.handleErrors(invController.updateInventory))




module.exports = router; 