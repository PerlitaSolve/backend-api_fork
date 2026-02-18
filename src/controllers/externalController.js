const pool = require('../config/db');

const poblarProductos = async (request, response) => {
    try {
        // Fetch FakeStoreApi
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const products = await apiFetch.json();

        let inserciones = 0;
        // Destructurar el objeto
        for(const product of products){
            const { title, price, description, image, category} = product;

            const stock = Math.floor(Math.random() * 50) + 1;

            const query = `
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagen_url)
                VALUES ($1, $2, $3, $4, $5)
            `

            await pool.query(query, [title, price, stock, description, image, category]);

            inserciones++;
        }
        response.status(200).json(
            {
                mensaje: "Carga masiva exitosa", 
                cantidad: inserciones
            }
        );
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message})
    }
};

const anadirCategoria = async (req, res) => {
    try{
        const apiFech = await fetch('http://fakestoreapi.com/products');
        const productosLista = await apiFech.json();
        let modificados =0;

        for(const producto of productosLista){
            const categoria = producto.category;

            const query = await pool.query('select id from categoria where nombre = $1', [categoria]);
            await pool.query('update productos set id_categoria =$1 where nombre = $2', [query.rows[0].id, producto.title]);
            modificados++;

        }
        res.status(200).json({mensaje: "Categorias añadidas exitosamente", cantidad: modificados});

    }catch(error){
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message})
    }
};

const poblarCategoria = async (req, res) => {
    try {
        // Fetch FakeStoreApi
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const categorias = await apiFetch.json();

        let inserciones = 0;
        // Destructurar el objeto
        for(const categoria of categorias){
            const {category} = categoria;


            const query = `INSERT INTO categoria (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING`;

            await pool.query(query, [category]);

            inserciones++;
        }
        res.status(200).json(
            {
                mensaje: "Carga de categorias exitosa", 
                cantidad: inserciones
            }
        );
        
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message})
    }
};

const buscarProducto = async (req, res) => {
    const Busqueda = req.params.busqueda;

    try{
        const row = await pool.query('SELECT * FROM productos where nombre ilike $1', [`%${Busqueda}%`]);
        res.json(row.rows);
    }catch(error){
        console.log(`Error: ${error}`);
        res.status(500).json({error: error.message});
    }
};

const buscarCategoria = async (req, res) => {
    const Busqueda = req.params.busqueda;

    try{
        const row = await pool.query('SELECT * FROM categoria where nombre ilike $1', [`%${Busqueda}%`]);
        res.json(row.rows);
    }catch(error){
        console.log(`Error: ${error}`);
        res.status(500).json({error: error.message});
    }
};

const mostrar = async (req, res) => {
    try{
        const row = await pool.query('SELECT * FROM productos');
        res.json(row.rows);
    }catch(error){
        console.log(`Error: ${error}`);
        res.status(500).json({error: error.message});
    }   
};

module.exports = { poblarProductos, poblarCategoria, anadirCategoria, buscarProducto , buscarCategoria, mostrar };