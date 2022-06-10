const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const PORT = process.env.PORT || 5000;
const User = require("./model/User");

app.set("view engine", "ejs");
connectDB();


app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}))

function isLoggedIn(req,res,next) {
  req.user ? next() : res.sendStatus(401);
}

var passport = require('passport');
var userProfile;
 
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use("/api/auth", require("./Auth/route"));

app.get("/", (req, res) => res.render("home")); 
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  req.logout(() => {
    req.session.destroy();
  })
  res.redirect("/login");
});

  
app.get("/google", isLoggedIn, (req,res) => res.render("google", {user: userProfile}))
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user", {user: userProfile}));
app.get('/error', (req, res) => res.send("error logging in"));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '651708385881-ulcgq3rfjanhb02g9uvitrq3efk1hj1f.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://web-design-2.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/google');
  });

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
