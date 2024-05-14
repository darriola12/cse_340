const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

module.exports = Util


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img class= "img-car" src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


 

Util.buildinfoCarGrid = async function(vehicle) {
  let grid2 
  if (Object.keys(vehicle).length !== 0) {
    grid2 = '<div class="container-main-car">'
    grid2 += '<div class="container-car-img">'
    grid2 += '<img class = "img-car-individual" src="' + vehicle.inv_image +
      '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model +
      ' on CSE Motors" />'
    grid2 += '</div>'
    grid2 += '<div class="container-car-info">' 
    grid2 += '<h2>' + vehicle.inv_make + ' ' +  vehicle.inv_year + '</h2>'
    grid2 += '<p>'+ '<span class = "title-car">'+ "Description:" + '</span>' +  ' '  +  vehicle.inv_description + '</p>'
    grid2 += '<p>' + '<span class = "title-car">' + "Price:" + '</span>' + ' '  + "$" +  new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    grid2 += '<p>'+ '<span class = "title-car">'+  "Miles:" + '</span>' + ' '  +   new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +  '</p>'
    grid2 += '<p>'+ '<span class = "title-car">'+   "Color:" + '</span>' + ' '  +  vehicle.inv_color + '</p>'
    grid2 += '</div>'
    grid2 += '</div>'

  } else {
    grid2 += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid2;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

