/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

const imageNumber = 2;
/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/*
    Send the user client the main landing page after you log-in.
    Attaches a random picture when signed in.
*/
exports.createHTML = (req, res, next) => {
  const randomNumber = Math.trunc(Math.random() * imageNumber) + 1;
  const imagePath = `/img/cat-${randomNumber}.jpg`;
  const html = `
        <h1>Hello, ${req.session.username}.</h1>
        </br>
        <img width="300px" src=${imagePath} alt="Picture of a cat"/>
        </br>
        <button onclick="window.location.href='/logout'">Log Out</button>
    `;
  res.send(html);
};

/* 
    Checks if the user has a valid session/cookie.
    If not redirects them to the login page.
*/
exports.checkCookie = (req, res, next) => {
  if (!req.session.authenticated) {
    res.redirect("/");
    return;
  }
  next();
};

/* 
    Produces a page with randomly generated cats.
*/
exports.producePage = (req, res, next) => {
  const randomNumber = req.params.id + 1;
  const imagePath = `/img/cat-${randomNumber}.jpg`;
  const html = `
        <h1>Hello, ${req.session.username}.</h1>
        </br>
        <img width="300px" src=${imagePath} alt="Picture of a cat"/>
        </br>
        <button onclick="window.location.href='/logout'">Log Out</button>
    `;
  res.send(html);
};
