const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// REGISTER
router.post('/register', async (req,res)=>{
    const { name,email,phone,password,role } = req.body;
    if(!name || !email || !password || !role)
        return res.status(400).json({ message:'Missing fields' });

    try{
        const userExist = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
        if(userExist.rows.length > 0)
            return res.status(400).json({ message:'Email already exists' });

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await pool.query(
            'INSERT INTO users(name,email,phone,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role',
            [name,email,phone,hashedPassword,role]
        );
        const token = jwt.sign({id:newUser.rows[0].id, role:newUser.rows[0].role},process.env.JWT_SECRET);
        res.json({ user:newUser.rows[0], token });
    }catch(err){
        console.error(err);
        res.status(500).json({ message:'Server error' });
    }
});

// LOGIN
router.post('/login', async (req,res)=>{
    const { email,password } = req.body;
    if(!email || !password) return res.status(400).json({ message:'Missing fields' });

    try{
        const userRes = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
        if(userRes.rows.length === 0) return res.status(400).json({ message:'User not found' });

        const user = userRes.rows[0];
        const match = await bcrypt.compare(password,user.password_hash);
        if(!match) return res.status(400).json({ message:'Invalid password' });

        const token = jwt.sign({id:user.id, role:user.role}, process.env.JWT_SECRET);
        res.json({ user:{id:user.id,name:user.name,email:user.email,role:user.role}, token });
    }catch(err){
        console.error(err);
        res.status(500).json({ message:'Server error' });
    }
});

module.exports = router;