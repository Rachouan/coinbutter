const router = require("express").Router();
const { render } = require("sass");
const Activation = require("../models/Activation.model.js");
const User = require("../models/User.model.js");


router.get("/activate", (req, res, next) => {
   
    (async () => {

        try{
            const {activate} = req.query;

            if(activate) {
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
            }
            
            
        }catch(err){
            console.log(err)
        }
        
    })();
    
});

module.exports = router;
