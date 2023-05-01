/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });


const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

const imageNumber = 5;
/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */


/*
    Send the user client the main landing page after you log-in.
    Attaches a random picture when signed in.
*/
exports.createHTML = (req, res, next, val) => {
    const randomNumber = Math.trunc(Math.random() * imageNumber); 
    res.send(`./member/${randomNumber}`);
}

/* 
    Checks if the user has a valid session/cookie.
    If not redirects them to the login page.
*/
exports.checkCookie = (req, res, next) => {
    if (!req.session.authenticated) {
        res.redirect('/');
        return;
    }
    next();
};

/* 
    Produces a page with randomly generated cats.
*/
exports.producePage = (req, res, next, val) => {
    const imagePath = `${__dirname}/../img/cat-${val}` 
    const html = `
        <h1>Hello, ${req.session.username}.</h1>
        </br>
        <img src=${imagePath} alt="Picture of a cat"/>
    `;
    res.send(html);
};

