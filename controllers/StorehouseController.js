const knex = require('knex')(require('../config/knexfile'));
//const bookshelf = require('../config/bookshelf');

exports.getData = (req, res) =>
{

        let qb = knex('MAGAZYN').where('PRODUKT.NAZWA','like','%'+req.query.searchPattern+'%').orWhere('MAGAZYN.ID_PRODUKT','like','%'+req.query.searchPattern+'%')
            .orWhere('PRODUCENT.NAZWA','like','%'+req.query.searchPattern+'%')
            .innerJoin('PRODUKT','MAGAZYN.ID_PRODUKT','PRODUKT.ID_PRODUKT')
            .innerJoin('PRODUCENT','PRODUKT.ID_PRODUCENT','PRODUCENT.ID_PRODUCENT')
            .innerJoin('PODZESPOLY','PRODUKT.ID_PODZESPOL', 'PODZESPOLY.ID_PODZESPOL')
            .select(
                 'PRODUCENT.NAZWA as ProducentNazwa',
                 'PRODUKT.NAZWA as ProduktNazwa',
                 'PRODUKT.ID_PRODUKT as IdProdukt',
                 'PODZESPOLY.PROCESOR as PodzespolProcesor',
                 'PODZESPOLY.RAM as PodzespolRAM',
                 'PODZESPOLY.HDD as PodzespolHDD',
                 'PODZESPOLY.GPU as PodzespolGPU',
                 'PRODUKT.CENA as ProduktCena',
                 'MAGAZYN.ILOSC as Ilosc')
            .then((rows)=>{
            res.render('storehouse',
                {
                    data: rows
                });
        },(err)=>{
            console.log(err.toString());
        });

};