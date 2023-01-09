const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');