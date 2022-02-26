const router = require("express").Router();
const mongoose = require("mongoose");
const Portfolio = require("../models/Portfolio.model");
const User = require("../models/User.model");

router.get("/:userId/edit", (req, res, next) => {
    const {userId} = req.params
    User.findOne({_id:userId})
    .then(user => {
        res.render("profile/edit", {user});
    })
    .catch(err => console.log(err));
});

router.post("/:userId/edit", (req, res) => {
    const { email,firstName,lastName, password } = req.body;
    const { userId } = req.params

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

    User.findOneAndUpdate({_id:userId},{email,firstName,lastName,password})
    .then(user => {
        console.log("Updated :",user)
        res.redirect("/", {user});
    });

    Portfolio.findOne({user:userId})
    .then(folio => {
        res.redirect(`/${folio._id}`, {user,folio});
    })
    .catch(err => console.log(err));
});

module.exports = router;