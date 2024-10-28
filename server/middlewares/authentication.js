const { verifyToken } = require("../helpers/jwt");
const User = require("../models/User");

async function authentication(req) {
    // ambil access token dari headers
    const authorization = req.headers.authorization || '';
    if(!authorization) throw new Error("Invalid Token");

    const [type, token] = authorization.split(' ');
    if(type !== 'Bearer') throw new Error("Invalid Token");

    // verify token & cek apakah id user nya ada
    const payload = verifyToken(token);
    const user = await User.findById(payload._id);
    if(!user) throw new Error("Invalid Token");
    // console.log(user);
    return user;
}

module.exports = authentication