const UserModel = require(`../models/user`);
const fs = require(`fs`);
const { promisify } = require(`util`);
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.detectedMimeType !== 'image/jpg' &&
      req.file.detectedMimeType !== 'image/png' &&
      req.file.detectedMimeType !== 'image/jpeg'
    ) {
      throw Error('invalid file');
    }

    if (req.file.size > 500000) {
      throw Error('max size');
    }
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }

  const fileName = req.body.name + '.jpg'; // permet d'écraser les photos anciennes avec le pesudo

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );
};
