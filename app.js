require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Configuración de PostgreSQL
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(bodyParser.json());

// Obtener todos los hospitales
app.get('/hospitales', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM hospitales');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un hospital por ID
app.get('/hospitales/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM hospitales WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los paquetes de un hospital
app.get('/hospitales/:id/paquetes', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM paquetes WHERE id_hospital = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un formulario (nuevo registro)
app.post('/formularios', async (req, res) => {
    const { nombres, apellidos, email, numero, id_hospital, contactado, metodo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO formularios (nombres, apellidos, email, numero, id_hospital, contactado, metodo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombres, apellidos, email, numero, id_hospital, contactado, metodo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todos los formularios
app.get('/formularios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM formularios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
