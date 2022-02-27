const router = require("express").Router();
const mongoose = require("mongoose");
const fileUploader = require('../config/cloudinary.config');

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const Portfolio = require("../models/Portfolio.model");
const User = require("../models/User.model");

// Routes

router.get("/:userId/edit", (req, res, next) => {
    const {userId} = req.params
    User.findOne({_id:userId})
    .then(user => {
        res.render("profile/edit", {user});
    })
    .catch(err => console.log(err));
});

router.post("/:userId/edit", fileUploader.single('profile-picture'), (req, res, next) => {

    const { email,firstName,lastName,password, existingImage } = req.body
    const { userId } = req.params

    if (req.file) {
        profileImage = req.file.path;
    } else {
        profileImage = existingImage;
    }
    
    if (!email) {
        return res
        .status(400)
        .render(`/${userId}/edit`, { errorMessage: {email: "Please provide your email."}, form:{ email,firstName,lastName, password }});
    }

    if (password.length < 8) {
        return res.status(400).render(`/${userId}/edit`, {
        errorMessage: {password: "Your password needs to be at least 8 characters long."}, form:{ email,firstName,lastName, password }});
    }

    //   ! This use case is using a regular expression to control for special characters and min length
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (!regex.test(password)) {
        return res.status(400).render(`/${userId}/edit`, {
        errorMessage: { password: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter." }, form:{ email,firstName,lastName, password }});
    }

    return bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
        // Find the user and Update it
        User.findOneAndUpdate({_id:userId},{
            email,
            firstName,
            lastName,
            password:hashedPassword,
            profileImage
        }, { new: true })
        .then((user) =>
            res.json(user)
            //res.redirect("/")
        )
    })
});

module.exports = router;