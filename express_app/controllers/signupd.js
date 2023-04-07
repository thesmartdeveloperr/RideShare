const ethCrypto=require('eth-crypto');
const fs=require("fs");
const HDwalletprovider=require("truffle-hdwallet-provider");
const Web3=require("web3");
const session=require("express-session");
var mongoose=require('mongoose');
// const cookie=require("cookie-parser");

const abi=require("../user_contract").abi2;
const address=require("../user_contract").address2;


const createIdentity=require("./create_identity");
const Profiles = require('../models/Profiles');

require("dotenv").config();

module.exports=(app)=>{

    app.get("/signupd",(req,res)=>{
        if(req.session.identity!== undefined){
            res.redirect("/homed");
        }
        else{
            res.render("signupd",{message:null});
        }
    });

    app.post("/signupd",async (req,res)=>{
        var name=req.body.name;
        var phno=req.body.phno;
        var username=req.body.email;
        var password=req.body.password;
        var vehicle=req.body.vehicle;
        var vehicleNo=req.body.vehicle_num;
        var userType = 'Driver';

        console.log(phno,name);
        // Creating identity
        var identity=createIdentity();

        console.log(identity);
        const publicKey=identity.publicKey;
        const privateKey=identity.privateKey;

        const newCompressed=ethCrypto.publicKey.compress(
            publicKey
        );
        identity.compressed=newCompressed;
        
        

        // Setting provider and web3
        const provider=new HDwalletprovider(
            "8e7cba54925eee830b75397fe9690fecfffed079f29c217b5c7a9bcfa19c576e",
            'https://data-seed-prebsc-1-s3.binance.org:8545'
        );

        const web=new Web3(provider);

        console.log("provider set");

        const contract=new web.eth.Contract(abi,address);
        const response= await contract.methods.set(name,username,phno,vehicle,vehicleNo,userType,password,privateKey).send({from: "0x7a318969EB4a55911EfFe22adc1A00b5C91c292f"});
        console.log(response);  




        // --------------------------------------------------------------------------------------------------

        req.session.username=username;
        req.session.privateKey=privateKey;
        req.session.userType=userType;
        res.redirect("/homed");
        //console.log("deployed --contract deployment left");
/*      Code to download keys    
        // Setting up sessions
        req.session.identity=identity;
        
        console.log(req.session);
        

        //writing to a file
        var path=__dirname+"/"+identity.compressed+".txt";
        
        var data={
            identity1:identity,
        };
    
        fs.writeFileSync(path,JSON.stringify(data),'utf8',(err)=>{
            console.log(err);
        });


        // download file
        // res.setHeader('Content-disposition', 'attachment; filename=' + identity.address+".txt");
        res.download(path,identity.compressed+'.txt',(err)=>{
            if(err){
                console.log(err);
            }else{
                
            }
        });
*/
});


}