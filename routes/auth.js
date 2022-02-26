const router = require("express").Router();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Activation = require("../models/Activation.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  const {email} = req.query;
  console.log(email)
  res.render("auth/signup",{form:{email}});
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { email,firstName,lastName, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/signup", { errorMessage: {email: "Please provide your email."}, form:{ email,firstName,lastName, password }});
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: {password: "Your password needs to be at least 8 characters long."}, form:{ email,firstName,lastName, password }});
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage: { password: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter." }, form:{ email,firstName,lastName, password }});
  }
  
  console.log({ email,firstName,lastName, password });

  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: { email: "Email is already in use."},form:{ email,firstName,lastName, password } });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          email,
          firstName,
          lastName,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object

        const code = Math.floor(100000 + Math.random() * 900000);
        
        Activation.create({code,user:user._id})
        .then((activation) =>{

          req.session.user = {
            id:user._id,
            name:user.firstName,
            image:user.profileImage,
            darkmode: user.darkmode,
            active:user.active,
          };
          res.locals.connectedUser = req.session.user;

          const msg = {
            to: email,
            from: process.env.SENDGRID_EMAIL,
            templateId: 'd-383e5812b2d947bc99ba64014ba4e3e0',
            dynamic_template_data: {
              code: code,
              id: activation._id,
            },
          };

          sgMail.send(msg)
          .then(() => {}, error => {
            console.error(error);
        
            if (error.response) {
              console.error(error.response.body)
            }
          });

          res.redirect("/dashboard");

        });
        
        
      })
      .catch((error) => {
        //console.log("error")
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage:{ message:error.message }, form:{ email,firstName,lastName, password }});
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:{ message: "Email need to be unique. The email you chose is already in use."}
          });
        }
        return res
          .status(500)
          .render("auth/signup", {  errorMessage:{ message:error.message }, form:{ email,firstName,lastName, password }});
      });
  });
});

router.get("/signin", isLoggedOut, (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", isLoggedOut, (req, res, next) => {
  const { email, password, signedIn } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/signin", { errors:{ message:"Please provide your email." },form:{email,password}});
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/signin", { errors:{ message:"You're password needs to be at least 8 characters long." },form:{email,password}});
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/signin", { errors:{ message:"Either your email or password is wrong." }, form:{ email, password }});
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/signin", { errors:{ message:"Wrong credentials." }, form:{ email, password }});
        }
        
        req.session.user = {
          id:user._id,
          name:user.firstName,
          image:user.profileImage,
          darkmode: user.darkmode,
          active:user.active,
        };
        res.locals.connectedUser = req.session.user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/dashboard");
      });
    })
    .catch((err) => next(err));
});

router.post("/signout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/signout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

router.get("/reset-password", isLoggedOut, (req, res) => {
  res.render('auth/resetPassword');
});

router.post("/reset-password", isLoggedOut, (req, res) => {
  (async () => {
    const {email} = req.body;
    try{

      if(!email) throw new Error(`You must enter an email`);

      const user = await User.findOneAndUpdate({ email: email},{reset:true});

      if(user){
        const msg = {
          to: email,
          from: process.env.SENDGRID_EMAIL,
          templateId: 'd-6626e715320d4f11b7f816020afe1e44',
          dynamic_template_data: {
            reset: user.id
          },
        };
  
        await sgMail.send(msg);
      }

      res.render('auth/resetPassword',{success:{message:`If we found your email we'll send you a reset password email.`}});

    }catch(err){
      res.render('auth/resetPassword',{errors:{message:err.message}});
    }

  })();
  
});

router.get("/reset", isLoggedOut, (req, res) => {

  
  ( async () =>{
    const {reset} = req.query;
    try{
      if(!reset) return res.redirect('/');
      const user = await User.findOne({_id:reset});
      if(!user.reset) new ThrowError('User did not request a reset password');
      res.render('auth/reset',{reset});
    }catch(err){
      return res.redirect('/');
    }
  })();
  

});

router.post("/reset", isLoggedOut, (req, res) => {

  const {reset,password} = req.body;
  if(!reset) return res.redirect('/');
  if(!password) return res.render('auth/reset',{errors:{message:'Please enter a correct password.'}});

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("auth/reset", {errors: { message: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter." }});
  }

  ( async () =>{
    try{
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.findOneAndUpdate({_id:reset},{password: hashedPassword,reset:false});
      res.render('auth/reset',{success:{message: `We've succesfully reset your password.`}});
    }catch(err){
      return res.render('auth/reset',{errors:{message:err.message}});
    }
  })();
  

});

module.exports = router;
