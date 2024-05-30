const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const accountModel = require("../models/account-model")
const Util = require(".")
  const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************S
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}


validate.regclassification = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid classification Name")
      .isLength({ min: 1, max: 50 }) 
      .withMessage("Classification Name must be between 1 and 50 characters long")
      .custom((value, { req }) => {
        // Verifica que el valor tenga solo una palabra
        const words = value.split(" ");
        if (words.length > 1) {
          throw new Error("Classification Name must be a single word");
        }
        return true;
      })
  ];
};

validate.checkclassification= async (req, res, next) => {
  const {classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add a classification",
      nav,
      classification_name
    })
    return
  }
  next()
}
validate.addinventory = () =>{
  return[
    body("inv_make")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide the car name"), // on error this message is sent.
    body("inv_model")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide model"), // on error this message is sent.
    body("inv_year")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide the year"), // on error this message is sent.
    body("inv_description")
     .trim()
     .escape()
     .notEmpty()
     .withMessage("Please provide more description"), // on error this message is sent.
    body("inv_image")
     .trim()
     .escape()
     .notEmpty()
     .withMessage("Please provide the URL image"), // on error this message is sent.
    body("inv_thumbnail")
     .trim()
     .escape()
     .notEmpty()
     .withMessage("Please provide thr URL image"), // on error this message is sent.
    body("inv_price")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide the price"), // on error this message is sent.
    body("inv_miles")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide the car miles"), // on error this message is sent.
    body("inv_color")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide car color"), // on error this message is sent.
    body("classification_id")
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please select a classificaton"), // on error this message is sent.
  ]
}
validate.checkinventory= async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,  classification_id } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add an inventory",
      nav,
      inv_make, inv_model,
      inv_year, 
      inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, inv_miles, 
      inv_color,  
      
    })
    return
  }
  next()
}
validate.checkupdateDate= async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,  classification_id, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit inventory",
      nav,
      inv_make, inv_model,
      inv_year, 
      inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, inv_miles, 
      inv_color, 
      classification_id, 
      inv_id,
      
    })
    return
  }
  next()
}


validate.regLoginEmail = () =>{
  return[
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (email) => {
        const emailExists = await accountModel.checkExistingEmail(email)
        if (!emailExists){
          throw new Error("There is not email related with this account, please sign in")
        }
      }),
  ]

}
validate.checkLoginEmail= async (req, res, next) => {
  const {email} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      email,
    })
    return
  }
  next()
}







module.exports = validate
  