const knex = require('knex')(require('../config/knexfile'));
//const bookshelf = require('../config/bookshelf');

exports.getData = (req, res) =>
{

        let Amount = 0;

        let sortTarget;
        let sortType;

        if(req.query.sort == "") {
            sortTarget = 'PRODUKT.ID';
            sortType = 'ASC';
        }
        else if(req.query.sort == "AmountR") {
            sortTarget = 'MAGAZYN.ILOSC';
            sortType = 'ASC';
        }
        else if(req.query.sort == "AmountM") {
            sortTarget = 'MAGAZYN.ILOSC';
            sortType = 'DESC';
        }
        else if(req.query.sort == "PriceR") {
            sortTarget = 'PRODUKT.CENA';
            sortType = 'ASC';
        }
        else{
            sortTarget = 'PRODUKT.CENA';
            sortType = 'DESC';
        }


        if(req.query.Amount != "")
           Amount =  req.query.Amount;

        let qb = knex('MAGAZYN').where('PRODUKT.NAZWA','like','%'+req.query.NameProduct+'%')
            .andWhere('PRODUCENT.NAZWA','like','%'+req.query.NameProducer+'%')
            .andWhere(function() {this.where('PODZESPOLY.PROCESOR','like','%'+req.query.Component+'%')
                .orWhere('PODZESPOLY.RAM','like','%'+req.query.Component+'%')
                .orWhere('PODZESPOLY.HDD','like','%'+req.query.Component+'%')
                .orWhere('PODZESPOLY.GPU','like','%'+req.query.Component+'%')})
            .andWhere('MAGAZYN.ILOSC', '>=', Amount)
            .innerJoin('PRODUKT','MAGAZYN.ID_PRODUKT','PRODUKT.ID_PRODUKT')
            .innerJoin('PRODUCENT','PRODUKT.ID_PRODUCENT','PRODUCENT.ID_PRODUCENT')
            .innerJoin('PODZESPOLY','PRODUKT.ID_PODZESPOL', 'PODZESPOLY.ID_PODZESPOL')
            .orderBy(sortTarget, sortType)
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