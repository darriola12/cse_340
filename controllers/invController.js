const invModel = require("../models/inventory-model")
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

module.exports = invCont