const { check } = require('express-validator');

exports.registerValidator = [
    check('name', "Name is required").not().isEmpty(),
    check('email', "Email is required").isEmail(),
    check('phone', "Phone should be contains 10 digits and start with 6 to 9").custom((value, { req }) => {
        const regex = /^(?:\+91)?[6-9]\d{9}$/;
    return regex.test(value);
    }).withMessage("Invalid phone number format"),

    check('password', "Password must be greater than 6 character, contains atleast one uppercase, one lower case, one number and one special character")
        .isStrongPassword({
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }),
    check('image')
    .custom((value, { req }) => {
        if (req.file.mimetype ==="image/jpeg" || req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png") {
            return true;
        }
        else {
            return false;
        }
    }).withMessage("Please Choose Image: jpg, jpeg, png")
];

exports.emailValidationn = [
    check('email', "Email is required").isEmail(),
];


exports.phoneValidation = [
    check('phone', "Phone should be contains 10 digits and start with 6 to 9").custom((value, { req }) => {
        const regex = /^(?:\+91)?[6-9]\d{9}$/;
    return regex.test(value);
    }).withMessage("Invalid phone number format"),
    
];