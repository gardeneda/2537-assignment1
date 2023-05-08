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

const saltRounds = 12;
const status400 = "400 - Bad Request";

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/* 
    Checks if all fields for the user sign-up form is
    all filled out. There should be no empty fields.
*/
exports.checkInput = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username) {
    res.render(
      'error',
      {
        statusCode: status400,
        message: 'Please enter a valid name.'
      }
    );
    return;
  } else if (!email) {
    res.render(
      'error',
      {
        statusCode: status400,
        message: 'Please enter a valid email.'
      }
    );
    return;
  } else if (!password) {
    res.render(
      'error',
      {
        statusCode: status400,
        message: 'Please enter a password.'
      }
    );
    return;
  }

  const schema = Joi.object({
    username: Joi.string().alphanum().max(20).required(),
    password: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
  });

  const validationResult = schema.validate({ username, password, email });

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

/* 
    Checks if the username the user inputted already
    exists within the database. If so, throw error.
    Otherwise, proceed. 
*/
exports.checkDuplicate = async (req, res, next) => {
  const email = { email: req.body.email };
  const results = await userCollection
    .find(email)
    .project({ email: 1 })
    .toArray();
  if (results.length > 0) {
    res.send(`You already have an account. <a href='/login'>Log-in</a>`);
    return;
  }
  next();
};

/* 
    Send the client the User Creation Page 
    when it asks for /signup
*/
exports.createHTML = (req, res) => {

  res.render("signup");
};

// Snippet of code here referenced from sample of
// Assignment 1 in Patrick Guichon's COMP 2537
/* 
    Creates a User if all fields are valid and not already in database. 
*/
exports.createUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await userCollection.insertOne({
    username: username,
    email: email,
    password: hashedPassword,
    userType: "user"
  });

  console.log("Inserted User");
  res.render("signup-success");
};
