const component = require('../models/component');
//const { check, validationResult } = require('express-validator/check');
//const pagesController = require('./PageController');

exports.store = (req, res) =>
{

    const Component = component.create(
        {
            'processor': req.body.Processor,
            'ram': req.body.RAM,
            'hdd': req.body.HDD,
            'gpu': req.body.GPU

        }
    ).then(function ()
    {
        req.flash('statusCreateProduct','Podzespół został dodany do bazy dancyh!');
        res.redirect('/productCreate');
    }, function()
    {
        req.flash('statusCreateProduct','Podzespół nie został dodany do bazy danych!');
        res.redirect('/productCreate');
    });

};