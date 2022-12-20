const express = require('express');

const bodyparser = require('body-parser');
const app = express();
const { engine } = require ('express-handlebars');
const admin = require('./routes/admin');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash =require('connect-flash');


//configuração
    //body parser
        bodyparser.urlencoded({ extended: true });
        bodyparser.json();
        bodyparser.text({ type: 'text/plain' });

    // handlebars
        app.engine('handlebars',engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    //sessão
        app.use(session({
            secret: "crudnode",
            resave:true,
            saveUninitialized:true,
        }));
        app.use(flash());
    //middleware
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            next();
        });
    //mongoose 
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", true);
        mongoose.connect('mongodb://0.0.0.0:27017/listaTelefonica').then(()=>{
            console.log('Connected to MongoDB');
        }).catch((err) =>{
            console.log(err)
        });
    //public
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(bodyparser.urlencoded({ extended: true }));
        app.use(bodyparser.json());
    //rotas
        
        //usando rota exportada do da pasta routes
        app.use('/',admin);
    //outros
        const PORT = 8081;
        app.listen(PORT,()=>{
            console.log("servidor rodando");
        });