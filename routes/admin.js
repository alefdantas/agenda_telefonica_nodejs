const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Agenda')
const Agenda = mongoose.model('agendas')

router.get('/',(req,res) => {
    res.render("admin/index");
})
router.get('/cadastra_usuario',(req,res) => {
    res.render("admin/cadastra_usuario");
})

//lista as agendas
router.get('/lista_agenda', (req,res) => {
    Agenda.find().lean().sort({date:'desc'}).then((agenda) => {
        res.render('admin/lista_agenda',{lista: agenda})
    }).catch((err)=>{
        req.flash('error_msg','erro ao listar agendas')
        res.render('admin/index');
    });
});

//cadastra agenda
router.post('/cadastrar_agenda', (req,res)=>{
    var erros = []
    if(!req.body.nome_usuario || typeof req.body.nome_usuario == undefined || req.body.nome_usuario==null){
        erros.push({texto: "Nome inválido"})

    }
    if(!req.body.telefone_usuario || typeof req.body.telefone_usuario == undefined || req.body.telefone_usuario==null){
        erros.push({texto: "Telefone inválido"})
    }
    if(erros.length > 0){
        res.render('admin/cadastra_usuario',{erros: erros})
    }else{
        const nova_agenda={
            nome: req.body.nome_usuario,
            telefone: req.body.telefone_usuario
    
        }
    
        new Agenda(nova_agenda).save().then(() => {
            req.flash('success_msg','novo contato salvo com sucesso')
            res.redirect('/lista_agenda')
        }).catch((err)=>{
            req.flash('error_msg','erro ao salvar contato')
            
        });

    }
    

});

router.get('/edita_agenda/:id/',(req,res)=> {
    Agenda.findOne({_id:req.params.id}).lean().then((agenda)=>{
        res.render('admin/edita_agenda',{lista:agenda})
    })
})
router.post('/edita_agenda',(req,res)=> {
    Agenda.findOne({_id: req.body.id}).then((agenda)=>{
        agenda.nome = req.body.nome_usuario
        agenda.telefone = req.body.telefone_usuario

        agenda.save().then(() => {
            req.flash('success_msg','agenda editado com sucesso')
            res.redirect('/lista_agenda')
        }).catch((err)=>{
            req.flash('error_msg','erro ao editar agenda')
        })
    }).catch((err)=>{
        req.flash('error_msg','erro ao editar agenda')
        res.redirect('/lista_agenda')
    })
})

router.post('/deleta_agenda',(req,res)=> {
    Agenda.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg','agenda deletado com sucesso')
        res.redirect('/lista_agenda')
    }).catch((err)=>{
        req.flash('error_msg','erro ao deletar agenda')
        res.redirect('/lista_agenda')
    })
})

module.exports = router;