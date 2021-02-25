const express = require('express');
const router = express.Router();
const Carro = require('../models/Carro');

//Way of creating another page.
router.get('/', async (request, response) => {
    try{
        //Find is the mongoose method for getting stuff from the db.
        //No parameters means getting all the posts.
        const carros = await Carro.find();
        res.json(carros);
    }
    catch(err)
    {
        res.json({message : err});
    }
});



module.exports = router;