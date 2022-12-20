const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Agenda = new Schema({
    nome: {
        type: String,
        required: true,
    },
    telefone:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now(),
    }
})

mongoose.model("agendas",Agenda)