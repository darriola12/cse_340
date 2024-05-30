const { render } = require("ejs")
const invModel = require("../models/inventory-model")
const Util = require("../utilities/")
const utilities = require("../utilities/")
const expressEjsLayouts = require("express-ejs-layouts")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const loggedin = res.locals.loggedin;
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    loggedin,
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
    const loggedin = res.locals.loggedin;
    const inventoryId = req.params.inventoryId; // Corregido: Usar inventoryId en lugar de displayinfoCar
    const vehicleData = await invModel.getInventoryById(inventoryId);
    const gridVehicles = await utilities.buildinfoCarGrid(vehicleData);
    const nav = await utilities.getNav();
    const classVehicle = vehicleData.classification_name; 
    res.render("./inventory/vehicle", {
      loggedin,
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
      const loggedin = res.locals.loggedin;
      const nav = await utilities.getNav();
      const selectList = await Util.buildClassificationList(); 
      res.render('../views/inventory/management', {
          loggedin, 
          title: 'Inventory Management',
          nav,
          classificationList: selectList,
      });
  } catch(error) {
      console.error("Error en buildInventoryManagement:", error);
      next(error); 
  }
}

invCont.addclassificationView  = async function(req, res, next) {
  const loggedin = res.locals.loggedin;
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    loggedin, 
    title: "Add classification",
    nav,
    errors:null,
  })
}


invCont.addClassificationController = async function(req, res){
  const loggedin = res.locals.loggedin;
  let  nav = await utilities.getNav();
  const {classification_name} = req.body
  console.log(classification_name)
  const regResult = await invModel.addClassification(classification_name)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you add a new classification  called ${classification_name}`
    )
    res.status(201).render("inventory/management", {
      loggedin,
      title: "Inventory Management",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, there was something wrong")
    res.status(501).render("inventory/add-classification", {
      loggedin,
      title: "Add Classification",
      nav,
      errors:null, 
    })
  }
      
}

invCont.addInventoryView = async function(req, res, next) {
const selectList = await Util.buildClassificationList(); 
let nav = await utilities.getNav();
const loggedin = res.locals.loggedin;
res.render("inventory/add-inventory", {
  loggedin,
  title: "Add an Inventory",
  nav,
  classificationList: selectList, // Cambia selectList por classificationList
  errors: null
});
};

invCont.addInventoryController = async function(req, res){
  const loggedin = res.locals.loggedin;
  const nav = utilities.getNav(); 
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
  const regResult = await invModel.addNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you add a new inventory`
    )
    res.status(201).render("inventory/management", {
      loggedin,
      title: "Inventory Management",
      nav,
      errors:null,
      
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
      errors:null,
    })
  }


};


invCont.editInventoryController = async function(req, res){
  const nav = utilities.getNav(); 
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
  const regResult = await invModel.addNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you add edit inventory`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors:null,
      
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add classification",
      nav,
      errors:null,
    })
  }


};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}





invCont.biuldEditView




 

module.exports = invCont