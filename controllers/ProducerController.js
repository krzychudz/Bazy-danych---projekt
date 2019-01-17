const producer = require('../models/producer');
const producerAddress = require('../models/producerAddress');
const knex = require('knex')(require('../config/knexfile'));
//const { check, validationResult } = require('express-validator/check');
//const pagesController = require('./PageController');

exports.store = (req, res) =>
{

    const ProdAddress = producerAddress.create(
        {
            'street': req.body.ProdStreet,
            'zipCode': req.body.CityList
        }
    ).then( function()
        {

            knex('ADRES_PRODUCENT').where({
                ULICA: req.body.ProdStreet,
                KOD_POCZTOWY: req.body.CityList
            }).select('ID_ADRESPRODUCENT').then((rows)=>{


                const Producer = producer.create(
                    {
                        'TELEFON': req.body.ProdTel,
                        'ID_ADRESPRODUCENT': rows[0].ID_ADRESPRODUCENT,
                        'NAZWA': req.body.ProdName
                    }
                ).then(function ()
                {
                    req.flash('statusCreateProduct','Producent został dodany do bazy dancyh!');
                    res.redirect('/productCreate');
                }, function()
                {
                    req.flash('statusCreateProduct','Producent nie został dodany do bazy danych!');
                });




            });
        }
    );

};