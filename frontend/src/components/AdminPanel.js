import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const { isAdminAuthenticated, setIsAdminAuthenticated } = useAuth();
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchData();
        }
    }, [isAdminAuthenticated]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/getallusers');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSignOut = () => {
        setIsAdminAuthenticated(true);
        navigate('/admin');

    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete all users?');
        if (!confirmed) return;


        try {
            const response = await axios.delete('http://localhost:5001/api/delallusers');
            // console.log("Front end :", response);

            if (response.data.count > 0) {
                setDocuments([])
                // console.log(response.data.count,"records are deleted");
                alert(response.data.count," records are deleted");
            } else if (response.data.count <= 0) {
                alert("No records for delete")
            }
            else {
                console.error('Error in deleting data:');

            }
        } catch (error) {
            console.error('Error in deleting data:', error);
        }


    };


    if (!isAdminAuthenticated) {
        return <div className="container">Access denied. Please log in as an admin.</div>;
    }

    return (
        <div className="table-container" style={{ width: '700px' }}>
            <h2>Admin Panel</h2>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={handleDelete}>Delete All Users</button>
            <table>
                <thead>
                    <tr>
                        <th>Profile Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Password</th>
                        <th>Account Status</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((document) => (

                        <tr key={document._id}>
                            <td>
                                <img src={require(`../${document.image}`)} alt="dp" height={100} width={100} />
                            </td>
                            <td>{document.name}</td>
                            <td>{document.email}</td>
                            <td>{document.phone}</td>
                            <td>{document.password}</td>
                            <td>{document.is_verified ? "Verified" : "Not Verified"}</td>

                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
