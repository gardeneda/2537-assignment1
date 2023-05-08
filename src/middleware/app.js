const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const url = require('url');

const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;

const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;


// ############### ROUTER ##################

const adminRouter = require(`${__dirname}/../routes/adminRouter`);
const indexRouter = require(`${__dirname}/../routes/indexRouter`);
const signupRouter = require(`${__dirname}/../routes/signupRouter`);
const loginRouter = require(`${__dirname}/../routes/loginRouter`);
const memberRouter = require(`${__dirname}/../routes/memberRouter`);

// ############### MIDDLEWARE ###############

const navLinks = require(`${__dirname}/../utils/navlinkManager.js`);

// ##########################################

app.set('views', path.resolve(`${__dirname}/../views`))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }));

// Snippet of code here referenced from sample of
// Assignment 1 in Patrick Guichon's COMP 2537
var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
	crypto: {
		secret: mongodb_session_secret,
	},
});

app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// Snippet of code here referenced from sample of
// Assignment 1 in Patrick Guichon's COMP 2537
app.use(
	session({
		secret: node_session_secret,
		store: mongoStore, //default is memory store
		saveUninitialized: false,
		resave: true,
	})
);

// EJS creates a "locals" parameter on app.
// We can set this to create 'global' variables that
// EJS scripts can refer to.
app.use("/", (req, res, next) => {
	
	if (!req.session.authenticated) {

		app.locals.status = 0;

	} else {

		app.locals.status = 1;
	}

	app.locals.navLinks = navLinks;
	app.locals.currentURL = url.parse(req.url).pathname;
	next();
});


app.use("/img", express.static(`${__dirname}/../../public/img`));

app.use("/signup", signupRouter);

app.use("/login", loginRouter);

app.use("/member", memberRouter);

app.use("/admin", adminRouter);

app.use("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

app.get("/", indexRouter);

app.get("*", (req, res) => {

	res.render("404");
});

module.exports = app;
