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

const { ObjectId } = require("mongodb");


const saltRounds = 12;
/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

exports.createHTML = async (req, res, next) => {

    const result = await userCollection
    .find()
    .project({})
    .toArray();
        
    res.render('admin', { users: result });
};

exports.checkAdmin = async (req, res, next) => {
    const email = req.session.email;
    const userDoc = await userCollection.findOne({ email: email });
    
    console.log(userDoc.userType === 'admin' ? true : false);

    if (userDoc.userType !== 'admin') {
        res.render('403');
        return;
    }
    next();
}

exports.changeUserType = (req, res, next) => {
    const userID = new ObjectId(req.params.id);
    const type = req.params.val > 0 ? 'admin' : 'user';


    userCollection.updateOne(
        { _id: userID },
        { $set: { userType: type } }

    ).then(() => {
        console.log(`User Type Changed to: ${type}`);
        res.redirect('/admin');

    }).catch((err) => {
        console.log(err);
        next(err);
    });
};

