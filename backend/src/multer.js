const multer = require("multer");
const storageProduct = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/products");
    },
    filename: function (req, file, cb) {
        const nomeArquivo = file.originalname.trim().replaceAll(" ", "_");
        cb(null, Date.now() + nomeArquivo);
    },
});
const uploadProduct = multer({ storage: storageProduct });

const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/users");
    },
    filename: function (req, file, cb) {
        const nomeArquivo = file.originalname.trim().replaceAll(" ", "_");
        cb(null, Date.now() + nomeArquivo);
    },
});
const uploadUser = multer({ storage: storageUser });

module.exports = { uploadProduct, uploadUser }