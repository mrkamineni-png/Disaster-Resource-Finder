import React, { useState } from 'react';
import API from '../api/api';

function Login() {
    const [form, setForm] = useState({email:'', password:''});
    const [message,setMessage] = useState('');

    const handleChange = e => setForm({...form,[e.target.name]: e.target.value});
    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await API.post('/auth/login', form);
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('user',JSON.stringify(res.data.user));
            setMessage(`Logged in as ${res.data.user.role}`);
        }catch(err){
            setMessage(err.response.data.message);
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} required/><br/>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required/><br/>
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default Login;