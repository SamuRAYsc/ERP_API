const userService = require('../service/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/apiExceptions.js');

class UserController {
    async registration(req, res, next) {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            const {id, password} = req.body;
            const userData = await userService.registration(id, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 5*24*3600*1000, httpOnly: true});

            return res.json(userData);
        } catch (e){
            next(e);
        }
    }
    async login(req, res, next) {
        try{
            const {id, password} = req.body;
            const userData = await userService.login(id, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 5*24*3600*1000, httpOnly: true});

            return res.json(userData);
        } catch (e){
            next(e);
        }
    }
    async logout(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(!!token);
        } catch (e){
            next(e);
        }
    }
    async refresh(req, res, next) {
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 5*24*3600*1000, httpOnly: true});

            return res.json(userData);
        } catch (e){
            next(e);
        }
    }
    async getInfo(req, res, next) {
        try{
            const user = await userService.getinfo(req.user.id);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }
}

module.exports = new UserController();