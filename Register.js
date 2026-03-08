import React, { useState } from 'react';
import API from '../api/api';

function Register() {
    const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'citizen' });
    const [message, setMessage] = useState('');

    const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const res = await API.post('/auth/register', form);
            setMessage(`Registered as ${res.data.user.role}`);
        }catch(err){
            setMessage(err.response.data.message);
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} required/><br/>
                <input name="email" placeholder="Email" onChange={handleChange} required/><br/>
                <input name="phone" placeholder="Phone" onChange={handleChange}/><br/>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required/><br/>
                <select name="role" onChange={handleChange}>
                    <option value="citizen">Citizen</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="ngo">NGO</option>
                    <option value="govt_agent">Govt Agent</option>
                </select><br/>
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default Register;