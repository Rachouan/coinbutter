const router = require("express").Router();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Activation = require("../models/Activation.model.js");
const User = require("../models/User.model.js");

router.post("/activate/resend", (req, res, next) => {
    const {userId} = req.body;

    //if(!userId) return res.redirect('/dashboard');
    console.log(userId);
    (async () => {

        try{
            const activateDoc = await Activation.findOne({user:userId}).populate('user');
            const msg = {
                to: activateDoc.user.email,
                from: process.env.SENDGRID_EMAIL,
                templateId: 'd-383e5812b2d947bc99ba64014ba4e3e0',
                dynamic_template_data: {
                    code: activateDoc.code,
                    id: activateDoc._id,
                },
            };

            await sgMail.send(msg);
            return res.redirect('/dashboard');
        }catch(err){
            console.log(err);
            return res.redirect('/dashboard');
        }
        
    })();
    
});
router.get("/activate", (req, res, next) => {
   
    (async () => {

        try{
            const {activate} = req.query;

            if(activate) {
                const activateDoc = await Activation.findOne({_id:activate})
                console.log(activateDoc);
                if(!activateDoc){
                    return res.render('activation/activate',{errors:{message:'You code is not correct.'}});
                }

                if(activateDoc.active){
                    return res.render('activation/activate',{success:{message:"Your account is already activated;"}});
                }
                
                await User.findOneAndUpdate({_id:activateDoc.user},{active:true});
                await Activation.findByIdAndUpdate({_id:activateDoc._id},{active:true});
                
                if(req.session.user){
                    req.session.user.active = true;
                    res.locals.connectedUser = req.session.user;
                }
                
                res.render('activation/activate');

            }else{
                return res.redirect('/dashboard');
            }
            
            
        }catch(err){
            console.log(err);
            //return res.redirect('/dashboard');
        }
        
    })();
    
});

module.exports = router;
