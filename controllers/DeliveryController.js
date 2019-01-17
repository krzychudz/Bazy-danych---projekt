const knex = require('knex')(require('../config/knexfile'));
//const bookshelf = require('../config/bookshelf');

exports.getData = (req, res) =>
{

    let sortTarget;
    let sortType;

    let DateFrom = req.query.DateFrom;
    let DateTo = req.query.DateTo;

    let Amount = req.query.Amount;

    if(req.query.sort == "") {
        sortTarget = 'DOSTAWY.ID';
        sortType = 'ASC';
    }
    else if(req.query.sort == "DateR") {
        sortTarget = 'DOSTAWY.DATA';
        sortType = 'ASC';
    }
    else if(req.query.sort == "DateM") {
        sortTarget = 'DOSTAWY.DATA';
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

    if(req.query.DateFrom == "")
    {
        DateFrom = '1900-01-01';
        DateTo = '2500-01-01';
    }

    if(req.query.Amount == "")
    {
        Amount = 0;
    }

    let qb = knex('DOSTAWY').where('PRODUKT.NAZWA','like','%'+req.query.NameProduct+'%')
        .andWhere('PRODUCENT.NAZWA','like','%'+req.query.NameProducer+'%')
        .andWhere('DOSTAWY.ILOSC', '>=', Amount)
        .andWhereBetween('DOSTAWY.DATA',[DateFrom, DateTo])
        .innerJoin('PRODUKT','DOSTAWY.ID_PRODUKT','PRODUKT.ID_PRODUKT')
        .innerJoin('PRODUCENT','PRODUKT.ID_PRODUCENT','PRODUCENT.ID_PRODUCENT')
        .orderBy(sortTarget, sortType)
        .select(
            'PRODUCENT.NAZWA as ProducentNazwa',
            'PRODUKT.NAZWA as ProduktNazwa',
            'PRODUKT.ID_PRODUKT as IdProdukt',
            'PRODUKT.CENA as ProduktCena',
            'DOSTAWY.ILOSC as Ilosc',
            'DOSTAWY.DATA as DostawaData')
        .then((rows)=>{

            for(let i = 0; i < rows.length; i++) {
                let month = rows[i].DostawaData.getMonth() + 1;
                let day = rows[i].DostawaData.getDate();

                if (month < 10)
                    month = '0' + month;

                if (day < 10)
                    day = '0' + day;

                rows[i].DostawaData = rows[i].DostawaData.getFullYear() + '/' + month + '/' + day;

            }

                res.render('delivery',
                    {
                        data: rows
                    });

        },(err)=>{
            console.log(err.toString());
        });

};