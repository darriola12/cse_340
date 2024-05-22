const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")



// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDisplayInfoCar);
router.get("/", invController.buildInventoryManagement);
router.get("/addclassification", utilities.handleErrors(invController.addclassificationView));
router.post("/addclassification", utilities.handleErrors(invController.addClassificationController))
router.get("/addinventory", utilities.handleErrors(invController.addInventoryView))







module.exports = router; 