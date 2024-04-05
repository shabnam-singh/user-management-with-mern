const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const { default: mongoose } = require("mongoose");
const { validationResult } = require('express-validator');
const mailer = require('../helpers/mailer');
const allFunction =require('../helpers/allFunction')

const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);

        const firstError = errors.errors[0];
        if (firstError) {
            var msgdata = firstError.msg;
        }
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: msgdata,
                errors: errors.array()
            });

        }
        const { name, email, phone, password } = req.body;

        const isEmailExists = await User.findOne({ email });
        const isPhoneExists = await User.findOne({ phone });

        if (isEmailExists) {
            return res.status(400).json({
                success: false,
                msg: "Email already exists!"
            });
        }
        if (isPhoneExists) {
            return res.status(400).json({
                success: false,
                msg: "Phone Number already exists!"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password,
            image: 'images/' + req.file.filename
        });

        const userData = await user.save();

        const msg = '<p> Hii ' + name + ' Please verify your email for signing your account ,<br>' + '<a href="' + process.env.EMAIL_URL + process.env.PORT + '/mail-verification?id=' + userData._id + '"><b>Verify Now</b></a>'
        mailer.sendMail(email, "Email Verification", msg);

        return res.status(200).json({
            success: true,
            msg: "Register Successfully...",
            user: userData
        });

    } catch (error) {

        console.log(error)

        return res.status(400).json({
            success: false,
            msg: error.message

        });

    }
};


const signInUser = async (req, res) => {

    const { phone, password } = req.body;

    console.log(phone,password);

    const userData = await User.findOne({ "phone": phone, "password": password });

    if (userData) {
        if (!userData.is_verified == 1) {
            return res.status(400).json({
                success: false,
                msg: "Account Not Verified Please verify email first"
            });
        }
        else{
            // res.status(200).json(user);
            return res.status(200).json({
                success: true,
                msg: "sign in successfully",
                data:userData
            });

        }
    }
    else {
        return res.status(400).json({
            success: false,
            msg: "No User find Please create account first..."
        });
    }
}

const getAllUser = async (req, res) => {
    const users = await User.find({ name: { $exists: true } });

    if (users.length === 0) {
        console.log("No User Found in Database");
        return res.status(404);
    }
    return res.status(200).json(users);

};


const deleteAllUser = async (req, res) => {
    try {
        const result = await User.deleteMany({});
    console.log("Server Said "+`${result.deletedCount} documents deleted`);

    allFunction.deleteProfileImage('../Frontend Data/task1/src/images')

    return res.status(200).json({
        success: true,
        msg: "Deleted Successfully",
        count:result.deletedCount,
    }); 
    } catch (error) {
        return error.res.status(400).json({
            success: true,
            msg: "Error in deleting",
            count:result.deletedCount,
        }); 
        
    }

};



const mailVerification = async (req, res) => {
    try {

        if (req.query.id == undefined) {
            return res.render('404');

        }
        const userData = await User.findOne({ _id: req.query.id });


        if (userData) {
            if (userData.is_verified == 1) {
                return res.render('mail-verification', { message: 'Your mail is already verified...' });
            }

            await User.findByIdAndUpdate({ _id: req.query.id }, {
                $set: {
                    is_verified: 1
                }
            })
            return res.render('mail-verification', { message: 'Your Mail has been verified Successfully You can login now.' });

        }
        else {
            return res.render('mail-verification', { message: 'User not found' });
        }

    } catch (error) {
        console.log(error)
        return res.render('404');

    }

}


//not in user
const verifyEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: "Validation Error",
                errors: errors.array()
            });
        }
        const { name, email } = req.body;

        console.log("email from client", email)


        const userData = await User.findOne({ email });

        if (userData) {
            if (!userData.is_verified) {
                const msg = '<p> Hii ' + name + ' Please verify your email for signing your account ,<br>' + '<a href="' + process.env.EMAIL_URL + process.env.PORT + '/mail-verification?id=' + userData._id + '"><b>Verify Now</b></a>'
                mailer.sendMail(email, "Email Verification", msg);
                return res.status(200).json({
                    success: true,
                    msg: "Verification Link Sent"
                });
            }
            else {
                return res.status(200).json({
                    success: false,
                    msg: "Email already Verified"
                });
            }

        }
        else {
            const msg = '<p> Hii ' + name + ' Please verify your email for signing your account ,<br>' + '<a href="' + process.env.EMAIL_URL + process.env.PORT + '/mail-verification?id=' + userData._id + '"><b>Verify Now</b></a>'
            mailer.sendMail(email, "Email Verification", msg);
            return res.status(200).json({
                success: true,
                msg: "Verification Link Sent"
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            msg: "Errror Sending Mail on Server side............."
        });

    }
};



const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
};

module.exports = {
    userRegister,
    getAllUser,
    mailVerification,
    verifyEmail,
    deleteAllUser,
    signInUser,
    getUserById,
};
