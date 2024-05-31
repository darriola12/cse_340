const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

// Util.buildUpdate = async function(account_email) {
//   try {
//     let data = await getAccountByEmail(account_email); 
//     let updateForm = '<form class="updateForm" method="post" action="account/update">';
//     updateForm += '<label id="updateName">Account First Name</label>'; 
//     updateForm += '<input name="account_firstname" value="' + data.account_firstname + '">';
//     updateForm += '<label id="updateLastName">Account Last Name</label>';
//     updateForm += '<input name="account_lastname" value="' + data.account_lastname + '">';
//     updateForm += '<label id="updateEmail">Email</label>'; 
//     updateForm += '<input name="account_email" value="' + data.account_email + '">';
//     updateForm += '<button type="submit">Update</button>';
//     updateForm += '</form>';
//     return updateForm;
//   } catch (error) {
//     return "Error: " + error.message; // Handle error in case of no matching email
//   }
// };



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}





/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.logout = (req, res, next) => {
  if (res.locals.loggedin) {
    res.clearCookie("jwt");
    res.redirect("/account/login");
    req.flash("success", "Session successfully closed.");
  }
};


Util.checkAcess = (req, res, next) => {
  try {
    // Extract JWT token from request headers, cookies, or wherever it's stored
    const token = req.cookies.jwt; // Assuming JWT is stored in cookies

    // Check if token exists
    if (!token) {
      req.flash("error", "Unauthorized access. Please log in.");
      return res.redirect("/account/login");
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check account type
    if (decodedToken.account_type !== 'Employee' && decodedToken.account_type !== 'Admin') {
      req.flash("error", "Unauthorized access. You do not have permission to perform this action.");
      return res.redirect("/account/login");
    }

    // Allow access if account type is Employee or Admin
    next();
  } catch (error) {
    console.error(error);
    req.flash("error", "Unauthorized access. Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

