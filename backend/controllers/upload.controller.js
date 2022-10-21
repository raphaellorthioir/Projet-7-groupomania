const UserModel = require(`../models/user`);
const fs = require(`fs`);
const { promisify } = require(`util`);
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfil = async (req,res) =>{
    
}