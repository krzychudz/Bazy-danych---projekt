const product = require('../models/product');
const storehouse = require('../models/storehouse');
const { check, validationResult } = require('express-validator/check');
const pagesController = require('./PageController');
const knex = require('knex')(require('../config/knexfile'));

exports.store = (req, res) =>
{

    const Product = product.create(
        {
            'productName': req.body.productName,
            'ID_PRODUCENT': req.body.producerList,
            'ID_PODZESPOL': req.body.componentList
        }
    ).then(function ()
    {

        knex('PRODUKT').where({
            NAZWA: req.body.productName,
            ID_PRODUCENT: req.body.producerList,
            ID_PODZESPOL: req.body.componentList
        }).select('ID_PRODUKT').then((rows)=> {

            const Storehouse = storehouse.create(
                {
                    'ID_PRODUKT': rows[0].ID_PRODUKT
                }
            ).then(function () {

                req.flash('statusCreateProduct','Produkt został dodany do bazy dancyh!');
                res.redirect('/productCreate');

            });

        });

    }, function()
    {
        req.flash('statusCreateProduct','Niestety produkt nie został dodany do bazy danych!');
        res.redirect('/productCreate');
    });

};

exports.validate = [
    check('productName').isLength({max:20}).withMessage('Przekroczyłeś dopuszczalną ilość znaków!')
];


//middleware

exports.checkValidation = (req,res,next) =>
{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('productCreate', {
            validated: req.body,
            errors: errors.mapped(),
            components: pagesController.componentList,
            producers: pagesController.producerList,
            formMessage: 0
        });

    }

    next();
};