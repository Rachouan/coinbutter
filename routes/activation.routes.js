const router = require("express").Router();
const { render } = require("sass");
const Activation = require("../models/Activation.model.js");
const User = require("../models/User.model.js");


router.get("/activate", (req, res, next) => {
   
    (async () => {

        try{
            const {activate} = req.query;
            if(activate) {
            }
            const activateDoc = await Activation.findOne({id:activate})
            console.log(activateDoc);
            if(!activateDoc){
                return res.render('activation/activate',{errors:{message:'You code is not correct.'}});
            }
            
            await Activation.findByIdAndUpdate({_id:activateDoc._id},{active:true});
            const user = await User.findOneAndUpdate({_id:activateDoc.user},{active:true});
            
            if(req.session.user){
                req.session.user.active = true;
                res.locals.connectedUser = req.session.user;
            }
            
            res.render('activation/activate');
            
        }catch(err){
            console.log(err)
        }
        
    })();
    
});

router.post("/activate", (req, res, next) => {
    const {code} = req.body;

    const userId = req.session.user.id;
    
    async function checkActivation(){
        try{
            
            const activate = await Activation.findOne({user:userId})
            console.log(activate);
            if(activate.code != code){
                return res.render('activation/activate',{errors:{message:'You code is not correct.'}});
            }
            
            await Activation.findByIdAndUpdate({_id:activate._id},{active:true});
            const user = await User.findOneAndUpdate({_id:userId},{active:true});
            
            req.session.user.active = true;
            res.locals.connectedUser = req.session.user;

            res.redirect('/dashboard');
            
        }catch(err){console.log(err)}
    }
    

    checkActivation();

});

module.exports = router;
