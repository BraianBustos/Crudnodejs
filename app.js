const http = require('http');
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Script } = require('vm');


//Recursos
app.use(express.static(__dirname+'/'));


//Configuracion del servidor
app.set("view engine", "ejs");//Establece el motor de plantilla, con motor ejs
app.set("views", path.join(__dirname,""));// Permite gestionar las rutas de los diferentes recursos
app.use(express.urlencoded({extended:false})); //Permite recuperar valores publicadas en un request 
//app.listen(5000);
//console.log('Servidor corriendo esitoxamente en el puerto 5000');

//Enrutamiento

app.get('/', (req,res)=>{
    res.render('index.ejs');
});

app.get('/acerca', (req,res)=>{
    res.render('acerca.ejs');
});

app.get('/contacto',(req,res)=>{
    res.render('contacto.ejs');
});

const PUERTO = process.env.PORT || 5000;

app.listen(PUERTO, ()=>{
    console.log(`El servidor está escuchando en el puerto ${PUERTO}`);
});

//Base de datos
const db_name = path.join(__dirname,"web","db","base.db");
const db = new sqlite3.Database(db_name,err =>{ 
    if(err){
        return console.error(err.message);
    }
    else{
        console.log("...");
    }
});

//Crear la tabla
const sql_create="CREATE TABLE IF NOT EXISTS Productos(Product_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Nombre TEXT NOT NULL, Precio REAL NOT NULL, Descripcion TEXT)";

db.run(sql_create,err => {
    if(err){
        return console.error(err.message);  
    }
    else{
        console.log("Conexión exitosa con la base de datos");
    }
});

//Crear un nuevo registro
app.get('/crear',(req,res)=>{
    res.render('crear.ejs',{modelo:{}});
});

//POST /crear
app.post('/crear',(req,res)=>{
    const sql="INSERT INTO Productos(Nombre,Precio,Descripcion) VALUES(?,?,?)";
    const nuevo_producto=[req.body.Nombre, req.body.Precio, req.body.Descripcion];
    //const nuevo_producto=["Cel",1200,"ultima generación"];
    db.run(sql, nuevo_producto,err =>{
    if(err){
        return console.error(err.message);
    }
    else{
        res.redirect("/productos");
    }
    });
});

//Editar un registro/id
app.get('/editar/:id',(req,res)=>{
    const id = req.params.id;
    const sql="SELECT * FROM Productos WHERE Produc_ID=?";
    db.get(sql,id,(err, rows)=>{
        res.render('editar.ejs',{modelo:rows});
    });    
});

//POST /editar/id
app.post('/editar/:id',(req,res)=>{
    const id=req.params.id;
    const info_producto=[req.body.Nombre,req.body.Precio, req.body.Descripcion,id];
    const sql="UPDATE Productos SET Nombre=?, Precio=?, Descripcion=? WHERE (Produc_ID=?)";
    db.run(sql,info_producto,err =>{
    if(err){
        return console.error(err.message);
    }
    else{
        res.redirect("/productos");
    }
    });
});


//Mostrar tabla
app.get('/productos',(req,res)=>{
    const sql="SELECT * FROM Productos ORDER BY Nombre";
    db.all(sql,[],(err,rows)=>{
        if (err){
            return console.error(err.message);
        }else{
            res.render("productos.ejs",{modelo:rows});
        }
    });
});

//Eliminar un registro
//GET/eliminar/id
app.get('/eliminar/:id',(req,res)=>{
    const id=req.params.id;
    const sql= "SELECT * FROM Productos WHERE Produc_ID =?";
    db.get(sql,id,(err, rows)=>{
        res.render("eliminar.ejs", {modelo: rows});
    });
});

//POST /eliminar/id
app.post('/eliminar/:id',(req,res)=>{
    const id=req.params.id;
    const sql="DELETE FROM Productos WHERE Produc_ID=?";

    db.run(sql,id,err =>{
    if(err){
        return console.error(err.message);
    }
    else{
        res.redirect("/productos");
    }
    });
});


////Buscar traer pág
//app.get('/buscar',(req,res)=>{
//    const sql="SELECT * FROM Productos WHERE Produc_ID=1";
//    db.all(sql,[],(err, rows)=>{
//        res.render('buscar.ejs',{modelo:rows});
//   });    
//});
//
////GET/buscar elemento
//app.get('/buscar',(req,res)=>{
//    const id= 1;
//    const info_producto=[req.body.Nombre,req.body.Precio, req.body.Descripcion,id];
//    const sql=`SELECT * FROM Productos WHERE Produc_ID=1`;
//    db.get(sql,id,info_producto,(err,rows) =>{
//        res.render('buscar.ejs',{modelo:rows});
//    });
//});
//












































