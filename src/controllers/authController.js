const pool = require ('../config/db');
const bcrypt = require('bcryptjs');

const registro = async (req, res)=> {
    const {email, password} = req.body;

    try{
        const userExist = await pool.query ('SELECT * FROM usuarios WHERE email = $1', [email]);
        if(userExist.rows.length > 0){
            return res.status(400).json({msg: 'El usuario ya existe'});
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
        'INSERT INTO usuarios ( email, password) VALUES ($1, $2) RETURNING *',
        [email, passwordHash]
    );
    res.status(201).json({
        msg: 'Usuario registrado exitosamente', user: newUser.rows[0]
    });
    }catch (error){
    console.error(error);
    res.status(500).json({error: 'Error en el servidor'});
    }
};

const jwt = require('jsonwebtoken');
const login = async (req, res)=>{
    const {email, password}= req.body;

    try{
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0){
            return res.status(400).json({msg: "Credenciales inválidas"});
        }
    }
}

module.exports = {registro};