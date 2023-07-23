import passport from 'passport';

import local from 'passport-local';

import { createHash, isValidPassword } from '../bcrypt.js';

import { UserModel } from '../DAO/models/users.model.js';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const LocalStrategy = local.Strategy;

export function iniPassport() {

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await UserModel.findOne({ email: username }).exec();
                    if (!user) {
                        console.log("User Not Found with username (email) " + username);
                        return done(null, false);
                    }
                    if (!isValidPassword(password, user.password)) {
                        console.log("Invalid Password");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                try {
                    const { email, firstName, lastName, admin } = req.body;
                    const user = await UserModel.findOne({ email: username }).exec();
                    if (user) {
                        console.log("User already exists");
                        return done(null, false);
                    }

                    if (!password) {
                        throw new Error("No password provided");
                    }

                    const newUser = {
                        email,
                        firstName,
                        lastName,
                        admin,
                        password: createHash(password),
                    };
                    const userCreated = await UserModel.create(newUser);
                    console.log("User Registration succesful");
                    return done(null, userCreated);
                } catch (e) {
                    console.log("Error in register");
                    return done(e);
                }
            }
        )
    );


    passport.use(
        'google',
        new GoogleStrategy(
            {
                clientID: '176055923838-tql33fkidogr9gnb1i29b9oosf95nvgp.apps.googleusercontent.com',
                clientSecret: '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',
                callbackURL: 'http://localhost:5000/api/sessionsGoogle/auth/google/callback',
            },
            async (accessToken, _, profile, done) => {
                console.log(profile);
                try {
                    const email = profile.emails[0].value;
    
                    let user = await UserModel.findOne({ email });
    
                    if (!user) {
                        const newUser = {
                            email,
                            firstName: profile.name.givenName || 'noname',
                            lastName: profile.name.familyName || 'nolast',
                            admin: false,
                            password: 'nopass',
                        };
    
                        let userCreated = await UserModel.create(newUser);
    
                        console.log('User Registration successful');
    
                        return done(null, userCreated);
                    } else {
                        console.log('User already exists');
                        return done(null, user);
                    }
                } catch (e) {
                    console.log('Error in Google auth');
                    console.log(e);
                    return done(e);
                }
            }
        )
    );


    passport.serializeUser((user, done) => {

        done(null, user._id);

    });



    passport.deserializeUser(async (id, done) => {

        let user = await UserModel.findById(id);

        done(null, user);

    });

}