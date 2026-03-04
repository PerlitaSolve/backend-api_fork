const pool = require('../config/db'); //Solo se hace la importacion hacia la configuración de la BD
 
const getProductos = async (req, res)=>{  //Funcion lamda
    try{  //dentro va la logica de negocios
        const rows= await pool.query('SELECT * FROM productos');
        res.json(rows.rows);
    }catch(e){
        res.status(500).json({error: e});
    }
};

const crearProducto = async (req, res)=>{
    
    const {nombre, precio, stock, id_categoria, descripcion,imagen_url }= req.body;

    try{
        
        if(!nombre || nombre.trim()===''){
            return res.status(400).json({error: 'Ingrese un nombre'});
        }else if(!parseInt(precio) || precio <=0){
            return res.status(400).json({error: 'El precio debe ser un entero mayor a 0'});
        }else if(!Number.isInteger(stock)){
            return res.status(400).json({error:'Ingrese un número entero'});
        }
    
        const resultado= await pool.query ('INSERT INTO productos (nombre, precio,stock, id_categoria, descripcion, imagen url) VALUES ($1,$2,$3, $4, $5,$6) RETURNING id', [nombre, precio, stock, id_categoria, descripcion, imagen_url]);
        res.status(201).json({
            id: resultado.rows[0].id,
            name: nombre,
            costo: precio, 
            cantidad: stock,
            categoria: id_categoria,
            descripcion: descripcion,
            imagen: imagen_url
        });
        

    }catch(error){
        res.status(500).json({mensaje: error});
    }
}

const putProducto = async (req, res)=>{
    const idBusqueda= parseInt (req.params.id);
    const {precio, stock}= req.body;

    try{

        const rows= await pool.query (`UPDATE productos SET precio= $1, stock= $2 WHERE id= $3`, [precio, stock, idBusqueda]);
        if(rows.rowCount===0){
            return  res.status(404).json ({error: "Producto no encontrado"});
        }
        res.json(
            {mensaje: 'Producto Modificado'}
        );


        
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error al modificar producto'});
    }
}

const deleteProducto = async (req, res)=>{
    const idBusqueda= parseInt(req.params.id);

    try{
        const rows= await pool.query (`DELETE FROM productos WHERE id= $1`, [idBusqueda]);
        if(rows.rowCount===0){
            return  res.status(404).json ({error: "Producto no encontrado"});
        }
        res.json(
            {mensaje:'Producto eliminado' }
        );
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error al eliminar producto'});
    }
}
 





module.exports= {getProductos, crearProducto, putProducto, deleteProducto};