const express = require('express');
var faker = require('faker');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var Carro = require('./models/Carro');
require('dotenv/config');

const app = express();


app.use(express.static('public'))
app.set('view engine','ejs');
app.use(expressLayouts);

//Maybe needs to be used to save jsons on the mongoDB?
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

//Import Routes,
//Importing the routes from the posts file
const postRoute = require('./routes/posts');
//const carroRoute = require('.')

//Setting that if a request for the /posts page is called.
//This the method on the posts file will be called.
app.use('/posts',postRoute);

//ROUTES
app.get('/', (req, res) => {
    res.render('pages/home');
});

app.get('/about', (req, res) => {
    var users = [{
      name: faker.name.findName(),
      email: faker.internet.email(),
      avatar: 'http://placekitten.com/300/300'
    }, {
      name: faker.name.findName(),
      email: faker.internet.email(),
      avatar: 'http://placekitten.com/400/300'
    }, {
      name: faker.name.findName(),
      email: faker.internet.email(),
      avatar: 'http://placekitten.com/500/300'
    }]
  
    res.render('pages/about', { usuarios: users })
});

app.get('/carro', (req, res) => {
    res.render('pages/carro');
});

app.post('/carro', async (req, res) =>
{
    const carro = new Carro({
        marca: req.body.marca,
        modelo: req.body.modelo,
        versao: req.body.versao,
        ano: req.body.ano,
        quilometragem: req.body.quilometragem,
        cambio: req.body.cambio,
        preco: req.body.preco
    });

    try{
        await carro.save();
        const carros = await Carro.find();
        res.render('pages/carros', { carros: carros });   
    }catch(err)
    {
        res.json({message : err});
    }
});

app.get('/carros', async (req, res) =>
{

    try{
        const carros = await Carro.find();
        res.render('pages/carros', { carros: carros })
    }
    catch(err)
    {
        res.send({err});
    }
});

app.post('/carromod', async (req, res) =>
{
    console.log("id: "+req.body.itemId);
    try{
        await Carro.findByIdAndUpdate(
            {_id: req.body.itemId},
            {   "$set": 
                {
                    "marca": req.body.marca,
                    "modelo": req.body.modelo,
                    "versao": req.body.versao,
                    "ano": req.body.ano,
                    "quilometragem": req.body.quilometragem,
                    "cambio": req.body.cambio,
                    "preco": req.body.preco
                }
            }, {new: true}
        ).exec();

        var carros = await Carro.find();
        res.render('pages/carros', {carros : carros});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }    
});

app.post('/carrosfiltros', async (req,res)=>
{
    var carros = await Carro.find();
    var filteredCarros = [];

    for(var i = 0; i < carros.length; i++)
    {        
        if(req.body.modelofilter != "")
            if(carros[i].modelo != req.body.modelofilter)
                continue;
        
        if(req.body.marcafilter != "")
            if(carros[i].marca != req.body.marcafilter)
                continue;

        if(req.body.versaofilter != "")
            if(carros[i].versao != req.body.versaofilter)
                continue;

        if(req.body.quilometragemfilter != "")
            if(carros[i].quilometragem != req.body.quilometragemfilter)
                continue;

        if(req.body.cambiofilter != "")
            if(carros[i].cambio != req.body.cambiofilter)
                continue;

        if(req.body.anominfilter != "")
            if(carros[i].ano < req.body.anominfilter)
                continue;
        
        if(req.body.anomaxfilter != "")
            if(carros[i].ano > req.body.anomaxfilter)
                continue;

        if(req.body.precominfilter != "")
            if(carros[i].preco < req.body.precominfilter)
                continue;

        if(req.body.precomaxfilter != "")
            if(carros[i].preco > req.body.precomaxfilter)
                continue;   
                
        filteredCarros.push(carros[i]);
    }

    res.render('pages/carros' , {carros : filteredCarros});
});

//Called when a car is selected to be edited.
//This responds for details or delete button being pressed.
app.post('/selecionacarro', async (req, res) =>
{    
    var buttonType;
    var itemId;

    if(!(typeof req.body.buttonType === 'string' || req.body.buttonType instanceof String))
    {
        buttonType = req.body.buttonType[0];
        itemId = req.body.itemId[0];
    }
    else
    {
        buttonType = req.body.buttonType;
        itemId = req.body.itemId;
    }

    try{
        if(buttonType == "details")
        {
            var carro = await Carro.findById(itemId);        
            res.render('pages/carroinfo', {carro : carro});
        }        
        else if(buttonType == "delete")
        {
            await Carro.findByIdAndDelete(itemId);
            var carros = await Carro.find();
            res.render('pages/carros' , {carros : carros});
        }
        else
        {
            res.send("Error: button type is neither details or delete: "+req.body.buttonType);
        }
    }
    catch(err)
    {
        res.send({err});
    }
});

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => 
    {
        console.log("Connected to DB");
    });

//How to start listening for the server?
//Listening to the port 3000
app.listen(3000);