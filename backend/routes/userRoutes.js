const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');


router.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
      // cb(null, path.join(__dirname, '../public/images')); saving file on server side folder
      cb(null, "../Frontend Data/task1/src/images"); //saving file on server side folder

    }
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  }
  else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

const userController = require('../controllers/userController');

const { registerValidator, emailValidationn, phoneValidation } = require('../helpers/validation');

router.post('/register', upload.single('image'), registerValidator, userController.userRegister);

router.post('/signin', phoneValidation, userController.signInUser);

//not in use
// router.post('/email-verification', emailValidationn, userController.verifyEmail);

router.get('/getallusers', userController.getAllUser);

router.get("/:id",userController.getUserById);

router.delete('/delallusers', userController.deleteAllUser);


module.exports = router;
