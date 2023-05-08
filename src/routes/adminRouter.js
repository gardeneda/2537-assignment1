const express = require('express');

const adminController = require(`${__dirname}/../controllers/adminController`);
const validation = require(`${__dirname}/../utils/validation`);

const router = express.Router();

router
    .route('/')
    .get(
        validation.checkCookie,
        adminController.checkAdmin,
        adminController.createHTML
);
    
router
    .route('/:id/:val')
    .post(adminController.changeUserType);



module.exports = router;