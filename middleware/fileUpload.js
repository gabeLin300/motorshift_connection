const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png'];
    if (mimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('The uploaded file is not the correct format, please upload jped or png.'));
    }
}

const upload = multer({
    storage: storage, 
    fileFilter:fileFilter, 
    limits:{fileSize: 3 * 1024 * 1024}
}).single('eventImg');

exports.fileUpload = (req,res, next) => {
    upload(req, res, err => {
        if (err) {
            err.status = 400;
            next(err);
        } else
            next();
    });
}