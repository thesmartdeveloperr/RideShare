const ethCrypto=require('eth-crypto');
//const abi=require("../family_tree_details").abi;
// const address=require("../family_tree_details").address;
const HDwalletprovider=require("truffle-hdwallet-provider");
const Web3=require("web3");
const session=require("express-session");
var mongoose=require('mongoose');
const abi=require("../user_contract").abi2;
const address=require("../user_contract").address2;



require("dotenv").config();
const Profiles = require('../models/Profiles');

module.exports=(app)=>{
    
app.get("/login",async (req,res)=>{
        
    if(req.session.username!==undefined)
    {
        console.log(req.session.userType);
        if(req.session.userType==="Driver"){
            res.redirect("/homed");
        }else{
            res.redirect("/homer");
        }

    }
    else{
        res.render("login",{message:null});
    }

});

    app.post("/login",async (req,res)=>{

        const username=req.body.email;
        const password=req.body.password;
        const provider=new HDwalletprovider(
            "7d010de6a8e765a057116f038684d51cd3c297f46a8f066914d95e1b78f9b0be",
            'https://data-seed-prebsc-1-s1.binance.org:8545'
         );
 
        const web=new Web3(provider);

        console.log("provider set");

        const contract=new web.eth.Contract(abi,address);
        console.log(contract);
        const response= await contract.methods.get(username).call({from: '0x6D4BF827f20FF446A4A8C7Fe68Beafae6E908606'});
        console.log(response);
        
        if(response['5']!==""){
            console.log(response);
            if(password===response['6']){
                req.session.username=username;
                req.session.privateKey=response['0'];
                req.session.userType=response['4'];

                console.log(req.session);
                if(response['4']==="Driver"){
                    res.redirect("/homed");
                }else{
                    res.redirect("/homer");
                }
            }else{

                res.render("index",{message:"invalid credentials"});
            }
            
        }else{
            res.render("index",{message:"No such user"});
        }



    });

    app.get('/logout',(req,res)=>{
        req.session.destroy((err)=>{
            if(err)
            console.log(err);
        });
        res.redirect("/")
    });

}
