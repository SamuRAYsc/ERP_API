const jwt = require('jsonwebtoken');
const models = require('../models/index.js');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'10m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'14d'});
        return {
            accessToken, refreshToken
        }
    }
    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch(e) {
            return null;
        }
    }
    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch(e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await models.Active_Token.findOne({ where: {owner: userId}})
        //============временная заглушка, потом придумать мультидевайс логин==================================
        if (tokenData) {
            tokenData.update({token:refreshToken}) ;
            return tokenData;
        }
        const token = await models.Active_Token.create({owner: userId, token: refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await models.Active_Token.destroy({ where: {token: refreshToken}})
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await models.Active_Token.findOne({ where: {token: refreshToken}})
        return tokenData;
    }
}

module.exports = new TokenService();