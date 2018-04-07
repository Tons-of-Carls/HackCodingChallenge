//Express
const express = require("express");
const app = express();

//Validator
const validator = require("validator");

//LowDB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
    emailingList: []
}).write();

//Needed to allow server to read body of request
app.use(express.urlencoded({extended: true}))

//Handle HTTP POST request to /api/addEmail
app.post("/api/addEmail", function(req, res){
    
    console.log("request body (email): " + req.body.email);
    
    //A Header needed to allow client to read response
    res.append("Access-Control-Allow-Origin", "*");
    
    if(validator.isEmail(req.body.email))
    {
        
        if(db.get("emailingList").find({email:req.body.email}).value() == null)
        {
            //Store email in database
            db.get("emailingList").push({email:req.body.email}).write();

            //Log the new emailing list
            console.log(db.getState());

            //Return a status of 200
            res.status(200).send(req.body.email);
        }
        else
        {
            console.log("Email is already in mailing list: " + req.body.email)
        
            //Return a status of 400 if there was an error
            res.status(400).send("Email is already in mailing list.");
        }
        
    }
    else
    {
        console.log("Email is Invalid: " + req.body.email)
        
        //Return a status of 400 if there was an error
        res.status(400).send("Email is invalid.");
    }
});

//Handle HTTP GET request to /api/getEmails
app.get("/api/getEmails", function(req, res){
    //a list of all the email objects in the database
    var emails = db.getState().emailingList;
    
    //a variable to store the string of comma separated emails
    var returnEmails = "";
    
    res.append("Access-Control-Allow-Origin", "*");
    
    for(i = 0; i < emails.length-1; i++)
    {
        returnEmails += emails[i].email + ",";
    }
    
    console.log(db.getState().emailingList);
    
    //Adds the last email to returnEmails without adding a comma
    returnEmails += emails[emails.length - 1].email;
    console.log("String to be returned: " + returnEmails);
    
    //Returns comma separated emails with a status code of 200
    res.status(200).send(returnEmails);
});

//App is listening at http://localhost:3000
app.listen(3000, function(){console.log("App now listening on port 3000")});