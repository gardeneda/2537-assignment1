const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;

const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;

const signupRouter = require(`${__dirname}/../routes/signupRouter`);
const loginRouter = require(`${__dirname}/../routes/loginRouter`);
const memberRouter = require(`${__dirname}/../routes/memberRouter`);

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

app.use('/img', express.static(`${__dirname}/../public/img`));

app.use("/signup", signupRouter);

app.use("/login", loginRouter);

app.use("/member", memberRouter);

app.use("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});


app.use('/', (req, res) => {
	if (req.session.authenticated) {
		const html = `
		<button onclick="window.location.href='/member'">Member Page</button>
		</br>
		<button onclick="window.location.href='/logout'">Log Out</button>
		`; 
		res.send()
	} else {
		const html = `
		<button onclick="window.location.href='/signup'">Sign up</button>
		</br>
		<button onclick="window.location.href='/login'">Log in</button>
		`
		res.send(html);
	}
});

app.use("*", (req, res) => {
  const html = `
		<h2>Page Does Not Exist - 404</h2>
		</br>
		<a href='/'>Go back to main</a>
	`;

  res.status(400);
  res.send(html);
});

module.exports = app;
