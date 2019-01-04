const order = require('../models/order');
const knex = require('knex')(require('../config/knexfile'));

exports.store = (req, res) =>
{

    console.log(req.body.productList);

    knex('MAGAZYN').where({
        ID_PRODUKT: req.body.productList,
            }).select('ILOSC').then((rows)=>{

        if(rows[0].ILOSC >= req.body.OrderAmount)
        {
            const Order = order.create(
                {
                    'DATA_START': req.body.OrderDateStart,
                    'DATA_KONIEC': req.body.OrderDateEnd,
                    'ID_PRODUKT': req.body.productList,
                    'ID_KLIENT': req.body.customerList,
                    'AMOUNT': req.body.OrderAmount

                }
            ).then(function ()
            {
                knex('MAGAZYN')
                    .where('ID_PRODUKT', '=',req.body.productList)
                    .update({
                        ILOSC: rows[0].ILOSC - req.body.OrderAmount
                    }).then(function()
                {
                    req.flash('statusOrder','Zamówienie zostało dodane do bazy dancyh!');
                    res.redirect('/orderCreate');
                });

            }, function()
            {

                req.flash('statusOrder','Zamówienie nie zostało dodane do bazy dancyh!');
                res.redirect('/orderCreate');

            }).catch(()=>{

                req.flash('statusOrder','Zamówienie nie zostało dodane do bazy dancyh!');
                res.redirect('/orderCreate');

            });
        }
        else
        {


            console.log(knex('DOSTAWY').where({
                ID_PRODUKT: req.body.productList,
            }).select('DATA').toString());

            knex('DOSTAWY').where({
                ID_PRODUKT: req.body.productList,
            }).select('DATA').then((rows1)=>{

                req.flash('statusOrder','Zbyt mała ilość produktu w magazynie! Pozostało ' + rows[0].ILOSC + '. Najblizsza ' +
                    'dostawa: ' + rows1[0].DATA);
                res.redirect('/orderCreate');

            }, () => {

                req.flash('statusOrder','Zbyt mała ilość produktu w magazynie! Pozostało ' + rows[0].ILOSC);
                res.redirect('/orderCreate');

            }).catch(()=>{

                req.flash('statusOrder','Zbyt mała ilość produktu w magazynie! Pozostało ' + rows[0].ILOSC);
                res.redirect('/orderCreate');

            });

        }

    });

};

