const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const fsPromise = require('fs/promises')
const models = require("../models/index.js");
const ApiError = require('../exceptions/apiExceptions.js');

class FileService {
    async upload(file){
        const name = uuid.v4();
        const store = path.join(__dirname,'..','/static',name+'.'+file.name.split('.').pop());
        file.mv(store);
        const fileInfo = await models.File.create({name: name, extension: file.name.split('.').pop(), type_MIME: file.mimetype, size: file.size});

        return fileInfo;
    }

    async list(amountPerPage,page){
        const allFiles  = await models.File.findAndCountAll({limit: +amountPerPage, offset: (page-1)*amountPerPage});
        return allFiles
    }

    async delete(id){
        const file = await models.File.findOne({where: {id}});
        if (file == null) {
            throw ApiError.BadRequest(`No file found`);
        }
        const filePath = path.join(__dirname,'..','/static',file.name)
        fs.rm(filePath, (err)=> {
            if (err) {
                throw new Error(err);
            }
        })
        const deletedFiles = await models.File.destroy({ where: {id}});
        return deletedFiles
    }

    async getFileInfo(id){
        const fileData  = await models.File.findOne({where: {id}});
        if (fileData == null) {
            throw ApiError.BadRequest(`No file found`);
        }
        return fileData
    }

    async download(id){
        const file = await models.File.findOne({where: {id}});
        if (file == null) {
            throw ApiError.BadRequest(`No file found`);
        }
        const fileLink = path.join(__dirname,'..','/static/' + file.name +'.' + file.extension);
        return fileLink
    }

    async updateFile(id,file){
        const oldFile = await models.File.findOne({where: {id}});
        if (oldFile == null) {
            throw ApiError.BadRequest(`No file found`);
        }
        const name = oldFile.name;
        const filePath = path.join(__dirname,'..','/static', name);
        fs.rmSync(filePath+'.'+oldFile.extension)
        
        file.mv(filePath+'.'+file.name.split('.').pop());
        const newFile = await models.File.update({extension: file.name.split('.').pop(), type_MIME: file.mimetype, size: file.size}, {where: {id}});
        return newFile;
    }


}

module.exports = new FileService();