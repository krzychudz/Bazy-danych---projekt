const customer = require('../models/customer');
const customerAddress = require('../models/customerAddress');
const knex = require('knex')(require('../config/knexfile'));
//const { check, validationResult } = require('express-validator/check');
//const pagesController = require('./PageController');

exports.store = (req, res) =>
{
    const CustomerAddress = customerAddress.create(
        {
            'street': req.body.CustomerStreet,
            'zipCode': req.body.CityList
        }
    ).then( function()
        {

            knex('ADRES_KLIENT').where({
                ULICA: req.body.CustomerStreet,
                KOD_POCZTOWY: req.body.CityList
            }).select('ID_ADRESKLIENT').then((rows)=>{


                const Customer = customer.create(
                    {
                        'customerFirstname': req.body.CustomerFirstname,
                        'customerLastname': req.body.CustomerLastname,
                        'customerTel': req.body.CustomerTel,
                        'ID_ADRESKLIENT': rows[0].ID_ADRESKLIENT

                    }
                ).then(function ()
                {
                    req.flash('statusOrder','Klient został dodany do bazy dancyh!');
                    res.redirect('/orderCreate');
                }, function()
                {
                    req.flash('statusOrder','Klient nie został dodany do bazy danych!');
                    res.redirect('/orderCreate');
                });


             });
        });
};
