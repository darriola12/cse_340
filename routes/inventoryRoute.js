const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDisplayInfoCar);
router.get("/", invController.buildInventoryManagement);
router.get("/addclassification", invController.addClassificationController);
router.post(
    "/addclassification",
    (req, res) => {
      res.status(200).send('done')
    }
)







module.exports = router; 