/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const Joi = require("joi");
const bcrypt = require("bcrypt");

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

// Snippet of code here referenced from sample of
// Assignment 1 in Patrick Guichon's COMP 2537
const expireTime = 60 * 60 * 1000;
const status400 = "400 - Bad Request";

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/* 
    Sends the client a log-in page where the user can 
    log in with the appropriate forms.
*/
exports.createHTML = (req, res) => {

  res.render("login");
};

/* 
    Sanitizes user input and validates it.
*/
exports.checkUserInput = (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  const schema = Joi.string().max(20).required();
  const validationResult = schema.validate(email);

  if (validationResult.error != null) {
    console.log(validationResult);
    const error = validationResult.error.details[0].message;
    res.render(
      'error',
      {
        statusCode: status400,
        message: error
      }
    );
    return;
  }

  next();
};

// Snippet of code here referenced from sample of
// Assignment 1 in Patrick Guichon's COMP 2537
/* 
    Validates whether user exists and for the correct password.
    If successful, create a session for the user. 
*/
exports.login = async (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  const result = await userCollection
    .find({ email: email })
    .project({ email: 1, password: 1, _id: 1, username: 1, userType: 1})
    .toArray();

  console.log(result);

  if (result.length != 1) {
    res.render(
      'error',
      {
        statusCode: status400,
        message: error
      }
    );
    return;
  }

  if (await bcrypt.compare(password, result[0].password)) {
    console.log("correct password");
    req.session.authenticated = true;
    req.session.email = email;
    req.session.username = result[0].username;
    req.session.userType = result[0].userType;
    req.session.cookie.maxAge = expireTime;

    res.redirect("/member");
    return;
  } else {
    console.log("incorrect password");
    res.render(
      'error',
      {
        statusCode: status400,
        message: error
      }
    );
    return;
  }
};
