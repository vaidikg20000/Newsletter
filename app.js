//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members:[
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME:firstName,
                    LNAME:lastName,
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);
    const url = 'https://us8.api.mailchimp.com/3.0/lists/194f532f75';
    const options = {
        method:"POST",
        auth: "vaidikg:ca43b15f5ea69f51ecff738f438116bd-us8"
    }

    const request = https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/faliure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
            
        });
    });

    request.write(jsonData);
    request.end();    
});

app.post("/faliure",function(req,res){
    res.redirect("/");
});

app.listen(Process.env.PORT||3000,function(){
    console.log("server running");
    
});

//api key
//ca43b15f5ea69f51ecff738f438116bd-us8

//list id
//194f532f75

//data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
