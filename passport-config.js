require('dotenv').config();

const passport = require('passport');
const Employee = require('./models/Employee');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWTokenSecret = process.env.JWTokenSecret; // Replace with your actual secret


// Define JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTokenSecret, // Your JWT secret
};

// Create the JWT strategy
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Find the user based on the JWT payload (email)
    const employee = await Employee.findOne({ email: payload.email });
    console.log(employee)

    if (!employee) {
      return done(null, false); // User not found
    }

    return done(null, employee); // User found
  } catch (error) {
    return done(error, false); // Error while searching for user
  }
});


// Use the JWT strategy with Passport
passport.use(jwtStrategy);
