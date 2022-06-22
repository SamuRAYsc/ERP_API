const fileService = require('../service/fileService');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/apiExceptions.js');
const path = require('path');

class FileController {
    async upload(req, res, next) {
        try{
            const info = await fileService.upload(req.files.file);
            return res.json(info);
        } catch (e){
            next(e);
        }
    }
    async list(req, res, next) {
        try{
            const list = await fileService.list(req.query.list_size||10, req.query.page||1);
            return res.json(list.rows);
        } catch (e){
            next(e);
        }
    }
    async delete(req, res, next) {
        try{
            const result = await fileService.delete(req.params.id);
            return res.json(!!result);
        } catch (e){
            next(e);
        }
    }
    async getFileInfo(req, res, next) {
        try{
            const info = await fileService.getFileInfo(req.params.id);
            return res.json(info);
        } catch (e){
            next(e);
        }
    }
    async download(req, res, next) {
        try{
            const file = await fileService.download(req.params.id);
            return res.download(file);
        } catch (e){
            next(e);
        }
    }
    async updateFile(req, res, next) {
        try{
            const info = await fileService.updateFile(req.params.id,req.files.file);
            return res.json(info);
        } catch (e){
            next(e);
        }
    }
}

module.exports = new FileController();