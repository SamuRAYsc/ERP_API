const models = require("../models/index.js");
const bcrypt = require("bcrypt");
const tokenService = require('./tokenService');
const ApiError = require('../exceptions/apiExceptions.js');

class UserService {
    async registration(id, password) {
        const match = await models.User.findOne({where:{id: id}})
        if (match){
            throw ApiError.BadRequest(`User with email ${id} already exist`)
        }
        const hashPassword = await bcrypt.hash(password, 4);
        const user = await models.User.create({id, password: hashPassword});
        const tokens = tokenService.generateTokens({"id":user.id});
        await tokenService.saveToken(user.id,tokens.refreshToken);

        return {
            ...tokens,
            user//временно, пока дебагать надо
        }
    }
    async login(id,password) {
        const match = await models.User.findOne({where:{id: id}})
        if (!match){
            throw ApiError.BadRequest(`User with email ${id} not exist`)
        }
        const passwordCheck = await bcrypt.compare(password, match.password);
        if (!passwordCheck){
            throw ApiError.BadRequest(`Wrong password`)  
        }
        const tokens = tokenService.generateTokens({"id":match.id});
        await tokenService.saveToken(match.id,tokens.refreshToken);
        return {...tokens }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    
    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const storedToken = await tokenService.findToken(refreshToken);
        if (!userData || !storedToken){
            throw ApiError.UnauthorizedError();
        }
        const user  = await models.User.findOne({where:{id: userData.id}});
        const tokens = tokenService.generateTokens({"id":user.id});
        await tokenService.saveToken(user.id,tokens.refreshToken);

        return {...tokens }
    }

    async getinfo(id){
        const user  = await models.User.findOne({where:{id}});
        return user;
    }
}

module.exports = new UserService();