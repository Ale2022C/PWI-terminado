const express = require('express');
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT;

// Conexión a la Base de Datos
// const conexion = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });

// conexion.connect((err) => {
//     if (err) {
//         console.error(`Error en la conexión: ${err.stack}`)
//         return;
//     }
//     console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
// });

//Configurar Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

//Configuración del Motor de plantillas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res, next) => {
    res.render('index', {
        titulo: 'Bienvenidos a la App de la UTN',
        style: 'index.css'
    })
});

app.get('/formulario', (req, res) => {
    res.render('formulario', {
        titulo: 'Formulario para preprocesadores',
        style: 'formulario.css'
    })
});

// app.get('/listado', (req, res) => {

//     // let sql = 'SELECT * FROM preprocesadores';

//     //     conexion.query(sql, (err, result) => {
//     //         if (err) throw err;
//             res.render('listado', {
//                 titulo: 'Listado de productos', 
//                 style: 'listado.css',
//                 // results: result,
//         });
//     });
// });


app.get('/preprocesadores', (req, res) => {
    res.render('preprocesadores', {
        titulo: 'Preprocesadores', 
        style: 'preprocesadores.css'
    });
});

// app.post('/formulario', (req, res) => {
//     const { nombre, apellido, mensaje } = req.body;

//     // console.log(nombre, precio);

//     if (nombre == '' || apellido == '' || mensaje == '') {
//         let validacion = 'Rellene los campos correctamente..';
//         res.render('formulario', {
//             titulo: 'Formulario para preprocesadores',
//             validacion
//         });
//     } else{

//         let datos = {
//             nombre: nombre, 
//             apellido: apellido,
//             mensaje: mensaje
//         };

//         let sql = 'INSERT INTO preprocesadores SET ?';

//         conexion.query(sql, datos, (err, result) => {
//             if (err) throw err;
//             res.render('formulario', {
//                 titulo: 'Formulario para preprocesadores'
//             });
//         });
//     }
// });

app.get('/contacto', (req, res) => {
    res.render('contacto', {
        titulo: 'Formulario para suscripcion',
        style: 'contacto.css'
    })
})

app.get('/haml', (req, res) => {
    res.render('haml', {
        style: 'prepro-contenido.css'
    })
})

app.get('/jade', (req, res) => {
    res.render('jade', {
        style: 'prepro-contenido.css'
    })
})

app.get('/slim', (req, res) => {
    res.render('slim', {
        style: 'prepro-contenido.css'
    })
})

app.get('/sass', (req, res) => {
    res.render('sass', {
        style: 'prepro-contenido.css'
    })
})

app.get('/stylus', (req, res) => {
    res.render('stylus', {
        style: 'prepro-contenido.css'
    })
})
app.get('/postcss', (req, res) => {
    res.render('postcss', {
        style: 'prepro-contenido.css'
    })
})
app.get('/less', (req, res) => {
    res.render('less', {
        style: 'prepro-contenido.css'
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
            style: 'enviado.css',
            nombre,
            email
        })
        }
        envioMail();
    }
})

// app.listen(PORT, () => {
//     console.log(`El servidor está trabajando en el Puerto ${PORT}`);
// });












