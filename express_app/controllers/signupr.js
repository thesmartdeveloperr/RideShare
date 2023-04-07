const ethCrypto=require('eth-crypto');
const fs=require("fs");
const HDwalletprovider=require("truffle-hdwallet-provider");
const Web3=require("web3");
const session=require("express-session");
var mongoose=require('mongoose');

const abi=require("../user_contract").abi2;
const address=require("../user_contract").address2;

// const cookie=require("cookie-parser");

//const abi=require("../family_tree_details").abi;
//const address=require("../family_tree_details").address;
//const byteCode=require("../family_tree_details").bytecode;
const createIdentity=require("./create_identity");
const Profiles = require('../models/Profiles');

require("dotenv").config();

module.exports=(app)=>{

    app.get("/signupr",(req,res)=>{
        if(req.session.username!== undefined){
            res.redirect("/homer");
        }
        else{
        res.render("signupr",{message:null});
        }
    });

    app.post("/signupr",async (req,res)=>{
        const name=req.body.name;
        const phno=req.body.phno;
        const username=req.body.email;
        const password=req.body.password;
        const userType = 'Rider';
        const vehicle="";
        const vehicleNo="";
        // Creating identity
        var identity=createIdentity();

        console.log(identity);
        const publicKey=identity.publicKey;
        const privateKey=identity.privateKey;
        const newCompressed=ethCrypto.publicKey.compress(
            publicKey
        );
        identity.compressed=newCompressed;

        const provider=new HDwalletprovider(
            "8e7cba54925eee830b75397fe9690fecfffed079f29c217b5c7a9bcfa19c576e",
            'https://data-seed-prebsc-1-s3.binance.org:8545'
         );
 
        const web=new Web3(provider);
        const AccountAddress = await web.eth.getAccounts();
        console.log(AccountAddress);
        console.log("provider set");
 
        const contract=new web.eth.Contract(abi,address);
        console.log(contract);
        const response= await contract.methods.set(name, username, phno, vehicle, vehicleNo, userType, password, privateKey).send({from: "0x7a318969EB4a55911EfFe22adc1A00b5C91c292f"});
        console.log("yha se response");
        console.log(response);



        req.session.username=username;
        req.session.privateKey=privateKey;
        req.session.userType=userType;
        
        console.log("yha tak aya tha");

        res.redirect("/homer");
        
});

}