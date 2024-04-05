import React, { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useNavigate } from 'react-router-dom';



const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        profileImage: '',
        password: ''
    });
    const [image, setImage] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const [emailMsg, setEmailMessage] = useState("");




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', phone);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('image', image);

        try {
            const response = await axios.post('http://localhost:5001/api/register', formDataToSend);

            if (response.status === 200) {
                alert(response.data.msg + "Verify your email for sign in.");
                setEmailMessage("Verification link sent")

                navigate('/signin');
            }

        } catch (err) {
            // console.log(err)

            if (err.code === "ERR_NETWORK") {
                alert("Server is not running...");
                return
            }
            if (err.response.status === 400) {
                console.log(err.response.errors)
                alert(err.response.data.msg);
            }
        }

    };


    return (
        <div>
            <h2>User Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className='leftLabel container'>
                    <label className="mylabel" htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                    <span style={{ fontSize: 'x-small' }}>{emailMsg}</span><br />


                    <label htmlFor="mobile">Mobile Number:</label>

                    <PhoneInput
                        country={'in'}
                        value={phone}
                        onChange={(phone) => setPhone("+" + phone)}
                    />


                    <div id='recaptcha' style={{ marginTop: '2px' }}></div>



                    <label htmlFor="image">File Upload (Image File):</label>
                    <input type="file" id="image" name="profileImage" accept=".png , .jpeg, .jpg" onChange={handleFileChange} required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    {/* {flag1 && flag2 ? <input type="submit" value="Sign Up" /> : ""} */}
                    <input type="submit" value="Sign Up" />
                </div>
            </form>
            <p>Already have an account? <a href="/signin">Sign In</a></p>
            <p>Admin? <a href="/admin">Admin Login</a></p>
        </div>
    );
};

export default SignUpForm;
