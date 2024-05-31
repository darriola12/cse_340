const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const loggedin = res.locals.loggedin;
  const nav = await utilities.getNav();
  res.render("index", {
    title: "Home",
    nav: nav,
    loggedin: loggedin
  });
};




module.exports = baseController