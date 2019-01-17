const customer = require('../models/customer');
const customerAddress = require('../models/customerAddress');
const knex = require('knex')(require('../config/knexfile'));
//const { check, validationResult } = require('express-validator/check');
const pagesController = require('./PageController');

let customersData;

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


exports.getData = (req, res) =>
{
    let qb = knex('KLIENT')
        .innerJoin('ADRES_KLIENT','KLIENT.ID_ADRESKLIENT','ADRES_KLIENT.ID_ADRESKLIENT')
        .innerJoin('MIASTO','MIASTO.KOD_POCZTOWY', 'ADRES_KLIENT.KOD_POCZTOWY')
        .where('KLIENT.IMIE','like','%'+req.query.searchPattern+'%')
        .orWhere('KLIENT.NAZWISKO','like','%'+req.query.searchPattern+'%')
        .orWhere('KLIENT.TELEFON ','like','%'+req.query.searchPattern+'%')
        .orWhere('ADRES_KLIENT.ULICA','like','%'+req.query.searchPattern+'%')
        .orWhere('ADRES_KLIENT.KOD_POCZTOWY','like','%'+req.query.searchPattern+'%')
        .orWhere('MIASTO.MIEJSCOWOSC','like','%'+req.query.searchPattern+'%')
        .select(
            'KLIENT.KLIENT_ID as KlientID',
            'KLIENT.IMIE as KlientImie',
            'KLIENT.NAZWISKO as KlientNazwisko',
            'KLIENT.TELEFON as KlientTelefon',
            'ADRES_KLIENT.ULICA as AdresUlica',
            'ADRES_KLIENT.KOD_POCZTOWY as AdresKP',
            'MIASTO.MIEJSCOWOSC as AdresMiasto',
        )
        .then((rows)=>{

            customersData = rows;

            res.render('customersShowEdit',{
               data: rows,
               formMessage: 0,
               cities: pagesController.cityList
            });


        }, (err) =>{
            console.log(err.toString());

                res.render('customersShowEdit',{
                    data: rows,
                    formMessage: 'Nie udalo sie wczytac danych',
                    cities: pagesController.cityList
            });
        });

};


exports.updateData = (req, res) =>
{

    knex.raw("begin updateCustomer("+req.body.CustomerID_Edit+",'"+ req.body.CustomerName_EDIT +
        "','"+req.body.CustomerSurname_EDIT+"','"+req.body.CustomerTel_EDIT+"','"+req.body.CustomerStreet_EDIT+"','"+req.body.CityList+"'); end;").then(()=>{

       knex.raw("SELECT MIEJSCOWOSC FROM MIASTO WHERE MIASTO.KOD_POCZTOWY ='" +req.body.CityList +"'").then((city) => {

           for(let i = 0; i < customersData.length; i++)
           {
               if(customersData[i].KlientID == req.body.CustomerID_Edit)
               {
                   customersData[i].KlientImie = req.body.CustomerName_EDIT;
                   customersData[i].KlientNazwisko = req.body.CustomerSurname_EDIT;
                   customersData[i].KlientTelefon = req.body.CustomerTel_EDIT;
                   customersData[i].AdresUlica = req.body.CustomerStreet_EDIT;
                   customersData[i].AdresKP = req.body.CityList;
                   customersData[i].AdresMiasto = city[0].MIEJSCOWOSC;

                   break;
               }
           }

           res.render('customersShowEdit',{
               data: customersData,
               formMessage: 'Aktualizacja przebiegła pomyślnie',
               cities: pagesController.cityList
           });



       }, (err) => {

           console.log(err.toString());

           res.render('customersShowEdit',{
               data: customersData,
               formMessage: 'Aktualizacja zakończona niepowodzeniem',
               cities: pagesController.cityList
           });

       });

    }, (err) => {

            console.log(err.toString());

        res.render('customersShowEdit',{
            data: customersData,
            formMessage: 'Aktualizacja zakończona niepowodzeniem',
            cities: pagesController.cityList
        });

    });
};


exports.deleteCustomer = (req, res) => {

    knex.raw("begin delCustomer("+req.body.CustomerID_Del+"); end;").then(()=> {

        for (let i = 0; i < customersData.length; i++) {
            if (customersData[i].KlientID == req.body.CustomerID_Del) {
                customersData.splice(i, 1);
                break;
            }
        }

        res.render('customersShowEdit',{
            data: customersData,
            formMessage: 'Klient został usunięty z bazy danych',
            cities: pagesController.cityList
        });

    }, (err) => {
        console.log(err.toString());

        res.render('customersShowEdit',{
            data: customersData,
            formMessage: 'Klient nie został usunięty z bazy danych. Istnieje zamówienie przypisane do tego klienta.',
            cities: pagesController.cityList
        });

    });

};


exports.createSummary = (req, res) =>
{

    knex.raw('SELECT IMIE, NAZWISKO FROM KLIENT WHERE KLIENT_ID='+req.query.CustomerID_Summary).then((customerName)=>{

        let qb = knex('ZAMOWIENIA')
            .innerJoin('KLIENT','KLIENT.KLIENT_ID','ZAMOWIENIA.KLIENT_ID')
            .innerJoin('PRODUKT','PRODUKT.ID_PRODUKT', 'ZAMOWIENIA.ID_PRODUKT')
            .where('ZAMOWIENIA.KLIENT_ID','=',req.query.CustomerID_Summary)
            .andWhere('ZAMOWIENIA.STATUS', '=', 'REALIZACJA')
            .select(
                'ZAMOWIENIA.ID_ZAMOWIENIE as ZamowienieID',
                'ZAMOWIENIA.DATA_START as ZamowienieDataStart',
                'ZAMOWIENIA.ILOSC as ZamowenieIlosc',
                'PRODUKT.CENA as ProduktCena',
                'PRODUKT.ID_PRODUKT as ProduktID',
                'PRODUKT.NAZWA as ProduktNazwa',
                'KLIENT.KLIENT_ID as KlientID'
            ).then((rows)=>{

                knex.raw('select sumCost('+req.query.CustomerID_Summary+') as cost from dual').then((totalCost)=>{

                    for(let i = 0; i < rows.length; i++) {

                        let month = rows[i].ZamowienieDataStart.getMonth() + 1;
                        let day = rows[i].ZamowienieDataStart.getDate();

                        if (month < 10)
                            month = '0' + month;

                        if (day < 10)
                            day = '0' + day;

                        rows[i].ZamowienieDataStart = rows[i].ZamowienieDataStart.getFullYear() + '/' + month + '/' + day;
                    }

                    res.render('customersShowEdit',{
                        data: customersData,
                        formMessage: 0,
                        cities: pagesController.cityList,
                        summary: true,
                        customerName: customerName[0],
                        orderData: rows,
                        totalCost: totalCost[0].COST
                    });


                }, (err)=>{
                    console.log(err.toString());
                });

            }, (err) =>{
                console.log(err.toString());
            });





    }, (err) =>{
        console.log(err.toString());
    });


};
