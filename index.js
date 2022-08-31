const express = require('express');
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a la Base de Datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

conexion.connect((err) => {
    if (err) {
        console.error(`Error en la conexión: ${err.stack}`)
        return;
    }
    console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
});

//Configurar Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

//Configuración del Motor de plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
//conexion.end();

app.get('/', (req, res, next) => {
    res.render('index', {
        titulo: 'Bienvenidos a la App de la UTN',
        style: 'index.css'
    })
});

app.get('/formulario', (req, res) => {
    res.render('formulario', {
        titulo: 'Formulario para Productos',
        style: 'formulario.css'
    })
});

app.get('/productos', (req, res) => {

    let sql = 'SELECT * FROM producto';

        conexion.query(sql, (err, result) => {
            if (err) throw err;
            res.render('productos', {
                titulo: 'Formulario para Productos', 
                results: result,
        });
    });
});

app.get('/productos', (req, res) => {
    res.render('productos', {
        titulo: 'Formulario para Productos', 
    });
});

app.post('/formulario', (req, res) => {
    //Desestructuración de datos
    //const {nombre, apellido, dni } = req.body;
    //Asigno datos a las variables enviadas desde el front
    /* let nombre = req.body.nombre;
    let precio = req.body.precio; */
    /* res.send(`Tus datos han sido recibidos: Nombre: ${nombre} y Apellido: ${apellido} y DNI: ${dni}`); */


    const { nombre, precio } = req.body;

    // console.log(nombre, precio);

    if (nombre == '' || precio == '') {
        let validacion = 'Rellene los campos correctamente..';
        res.render('formulario', {
            titulo: 'Formulario para Productos',
            validacion
        });
    } else{

        let datos = {
            nombre: nombre, 
            precio: precio
        };

        let sql = 'INSERT INTO producto SET ?';

        conexion.query(sql, datos, (err, result) => {
            if (err) throw err;
            res.render('formulario', {
                titulo: 'Formulario para Productos'
            });
        });
    }
});

app.get('/contacto', (req, res) => {
    res.render('contacto', {
        titulo: 'Formulario para suscripcion'
    })
})

app.post('/contacto', (req, res) => {
    const { nombre, email } = req.body;
    // let fecha = new Date();
    // let dia = fecha.getFullYear();

    if (nombre == '' || email == '') {
        let validacion = 'Rellene la suscripcion correctamente..';
        res.render('contacto', {
            titulo: 'Formulario para suscripcion',
            validacion
        });
    } else{

        async function envioMail() {

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USEREMAIL,
                    pass: process.env.PASS,
                }
        });   

        let envio = await transporter.sendMail({
            from: process.env.USEREMAIL,
            to:`${email}`,
            subject: 'Gracias por suscribirse a nuestra pagina',
            html: `Muchas gracias por contactarse con nosotros, estaremos enviando su pedido a la brevedad. <br>
            Todas nuestras promociones estaran a su disposicion. <br>`
        });

        // res.send(`Tu nombre es ${nombre} y tu email registrado es ${email}`);
        res.render('enviado', {
            titulo: 'Mail enviado satisfactoriamente',
            nombre,
            email
        })
        }
        envioMail();
    }
})

app.listen(PORT, () => {
    console.log(`El servidor está trabajando en el Puerto ${PORT}`);
});

// 1 Comentar console.logs
// 2 Comentar codigo de prueba
// 3 Desconectamos la base de datos
// 4 Comentamos las variables de entorno que no usamos (.env)
// 5 Ir al package.json y crear script "start"
// 6 Crear un archivo Procfile










