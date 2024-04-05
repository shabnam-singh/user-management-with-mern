import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const SignInForm = () => {
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const navigate = useNavigate();
    const { setIsAdminAuthenticated } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5001/api/signin', formData);
            
            const user = response.data;
            if (response.status === 200) {
                setIsAdminAuthenticated(true);
                navigate('/userDashboard',{state:{id:user.data._id}});
            } else {
                 console.error(response.data.msg);
            }
        } catch (error) {
            if(error.response.status===400){
                alert(error.response.data.msg);
            }
            else{
                console.error('Error signing in:', error.response.data.msg);
            }

        }
    };
    

    return (
        <div className="container">
            <h2>User Sign In</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Number">Number:</label>
                
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required></input>
            
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <input type="submit" value="Sign In" />
            </form>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            <p>Admin? <a href="/admin">Admin Login</a></p>
        </div>
    );
};

export default SignInForm;
