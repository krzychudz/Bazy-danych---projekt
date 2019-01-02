const knex = require('knex')(require('../config/knexfile'));
//const bookshelf = require('../config/bookshelf');

exports.getData = (req, res) =>
{

    let qb = knex('MAGAZYN')
        .select()
        .innerJoin('PRODUKT','MAGAZYN.ID_PRODUKT','PRODUKT.ID_PRODUKT').then((rows)=>{
            console.log(rows);
            res.render('storehouse',
                {
                    data: rows
                });
        },()=>{
            console.log('nie dziala');
        });


};