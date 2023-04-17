require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String},
    googleId: { type: String},
});

userSchema.plugin(passportLocalMongoose); 
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id).exec()
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
    res.render("index")
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
); 

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
});

app.get("/login", function(req, res) {
    res.render("login")
});

app.get("/register", function(req, res) {
    res.render("register")
});

app.get("/contact", function(req, res) {
    res.render("contact")
});

app.get("/secrets", function(req, res){
    User.find({"secret": {$ne: null}}).exec()
    .then(foundUsers => {
        res.render("secrets", {usersWithSecrets: foundUsers});
    })
    .catch(err => {
        console.log(err);
    });
});

app.get("/logout", function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

app.post("/contact", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const checkbox = req.body.cbox;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields : {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/b9ce3476b1";

    const options = {
        method: "POST",
        auth: process.env.API_KEY,
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.render("success");
        }   else {
            res.render("failure");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/contact");
});

app.post("/success", function(req, res) {
    res.redirect("/");
});

app.post("/register", function(req, res) {

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });    
}); 

app.post("/login", function(req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.loq(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets")
            });
        }
    });
});

app.listen(3000, function (){
    console.log("Server is running on port 3000.");
});
