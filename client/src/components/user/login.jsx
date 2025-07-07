import React, { useState } from "react";
import AXIOS from 'axios';
import './log.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UseNavbar from "./navbar";

export default function LoginUser() {
    const [record, setRecord] = useState({ email: "", password: "" });
    const [error, setError] = useState({});
    const navigate = useNavigate();

    
    const handleChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newError = {};
        if (!record.email.trim()) newError.email = "Email is required";
        if (!record.password) newError.password = "Password required";
        return newError;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validateErrors = validate();
        if (Object.keys(validateErrors).length > 0) {
            setError(validateErrors);
            return;
        }

        AXIOS.post('http://localhost:9000/api/user/loginuser', record)
            .then((res) => {
                if (res.data.status === 200) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("username", res.data.username); // Save username
                    toast.success('User Login successful');
                    setTimeout(() => { navigate("/userviewproduct"); }, 1000);
                } else {
                    toast.error(res.data.msg);
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error occurred");
            });
    };

    return (
        <>
            <UseNavbar />
            <ToastContainer position="top-center" autoClose={5000} theme="light" transition={Bounce} />
            <div className="container">
                <h1>Login Page</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <p>
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                        {error.email && <span style={{ color: "red" }}>{error.email}</span>}
                    </p>
                    <p>
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                        {error.password && <span style={{ color: "red" }}>{error.password}</span>}
                    </p>
                    <button type="submit">Login</button>
                    <p className="register-link">
                        Don't have an account? <a href="/reg">Register here</a>
                    </p>
                </form>
            </div>
        </>
    );
}
