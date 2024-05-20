const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build inventory by each carñ
 * ************************** */

invCont.buildDisplayInfoCar = async function(req, res, next) {
  try {
    const inventoryId = req.params.inventoryId; // Corregido: Usar inventoryId en lugar de displayinfoCar
    const vehicleData = await invModel.getInventoryById(inventoryId);
    console.log(vehicleData)
    const gridVehicles = await utilities.buildinfoCarGrid(vehicleData);
    const nav = await utilities.getNav();
    const classVehicle = vehicleData.classification_name; 
    res.render("./inventory/vehicle", {
      title: classVehicle + " vehicle", 
      nav,
      grid2: gridVehicles,
    });
  } catch (error) {
    console.error("Error en buildDisplayInfoCar:", error);
    next(error); 
  }
}

invCont.buildInventoryManagement = async function(req, res, next) {
  try {
      const nav = await utilities.getNav();
      res.render('../views/inventory/management', {
          title: 'Inventory Management',
          nav,
      });
  } catch(error) {
      console.error("Error en buildInventoryManagement:", error);
      next(error); 
  }
}

invCont.addClassificationController = async function(req, res){
  
  let  nav = await utilities.getNav();
  const {classification_name} = req.body
  const regResult = await invModel.addClassfication(classification_name)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations,  you add a new classificatin called ${classification_name}. `
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add classification",
      nav,
    })
  } else {s
    req.flash("notice", "Sorry, something failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
    })
  }

      
}
 

module.exports = invCont