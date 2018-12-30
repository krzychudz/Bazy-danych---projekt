const producer = require('../models/producer');
//const { check, validationResult } = require('express-validator/check');
//const pagesController = require('./PageController');

exports.store = (req, res) =>
{

    const Producer = producer.create(
        {
            'ProducerName': req.body.Processor,
            'ProdcuerTel': req.body.RAM,
            'hdd': req.body.HDD,
            'gpu': req.body.GPU

        }
    ).then(function ()
    {
        res.redirect('/productCreate');
        //req.flash('statusCreateProduct','Produkt został dodany do bazy dancyh!');
        //res.redirect('/productCreate');
    }, function()
    {
        //req.flash('statusCreateProduct','Niestety produkt nie został dodany do bazy danych!');
    });

};