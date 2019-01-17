const order = require('../models/order');
const knex = require('knex')(require('../config/knexfile'));

let ordersData;

exports.store = (req, res) =>
{
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

            knex('DOSTAWY').where({
                ID_PRODUKT: req.body.productList,
            }).orderBy('DATA','DESC')
                .select('DATA').then((rows1)=>{

                let month = rows1[0].DATA.getMonth() + 1;
                let day = rows1[0].DATA.getDate();

                if (month < 10)
                    month = '0' + month;

                if (day < 10)
                    day = '0' + day;


                rows1[0].DATA = rows1[0].DATA.getFullYear() + '/' + month + '/' + day;


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

exports.getData = (req,res) =>
{

    let qb = knex('ZAMOWIENIA')
        .innerJoin('KLIENT','KLIENT.KLIENT_ID','ZAMOWIENIA.KLIENT_ID')
        .innerJoin('PRODUKT','PRODUKT.ID_PRODUKT', 'ZAMOWIENIA.ID_PRODUKT')
        .where('ZAMOWIENIA.ID_ZAMOWIENIE','like','%'+req.query.searchPattern+'%')
        .orWhere('PRODUKT.NAZWA','like','%'+req.query.searchPattern+'%')
        .orWhere('KLIENT.IMIE','like','%'+req.query.searchPattern+'%')
        .orWhere('KLIENT.NAZWISKO','like','%'+req.query.searchPattern+'%')
        .orWhere('ZAMOWIENIA.ILOSC','like','%'+req.query.searchPattern+'%')
        .orWhere('ZAMOWIENIA.STATUS','like','%'+req.query.searchPattern+'%')
        .select(
            'ZAMOWIENIA.ID_ZAMOWIENIE as ZamowienieID',
            'ZAMOWIENIA.DATA_START as ZamowienieDataStart',
            'ZAMOWIENIA.DATA_KONIEC as ZamowienieDataKoniec',
            'PRODUKT.NAZWA as ProduktNazwa',
            'KLIENT.IMIE as KlientImie',
            'KLIENT.NAZWISKO as KlientNazwisko',
            'ZAMOWIENIA.ILOSC as ZamowenieIlosc',
            'PRODUKT.CENA as ProduktCena',
            'PRODUKT.ID_PRODUKT as ProduktID',
            'ZAMOWIENIA.STATUS as ZamowienieStatus'
            )
        .orderBy('ZAMOWIENIA.STATUS','ASC')
        .then((rows)=>{


            for(let i = 0; i < rows.length; i++)
            {

                let month = rows[i].ZamowienieDataStart.getMonth() + 1;
                let day = rows[i].ZamowienieDataStart.getDate();

                if(month  < 10)
                    month = '0' + month;

                if(day < 10)
                    day = '0' + day;

                rows[i].ZamowienieDataStart = rows[i].ZamowienieDataStart.getFullYear() + '/' + month + '/' + day;


                if (rows[i].ZamowienieDataKoniec == null)
                    rows[i].ZamowienieDataKoniec = "-";
                else {
                    month = rows[i].ZamowienieDataKoniec.getMonth() + 1;
                    day = rows[i].ZamowienieDataKoniec.getDate();

                    if (month < 10)
                        month = '0' + month;

                    if (day < 10)
                        day = '0' + day;
                    rows[i].ZamowienieDataKoniec = rows[i].ZamowienieDataKoniec.getFullYear() + '/' + month + '/' + day;
                }

            }

            ordersData = rows;

            res.render('orderShowEdit',
                {
                    data: rows,
                    formMessage: 0
                });
        },(err)=>{
            console.log(err.toString());
        });

};


exports.updateData = (req, res) =>
{

    knex.raw("begin updateOrder("+req.body.OrderID_Edit+",'"+ req.body.OrderAmountEdit +
        "',"+req.body.productList+"); end;").then(()=>{

            knex.raw('SELECT ILOSC from ZAMOWIENIA where ZAMOWIENIA.ID_ZAMOWIENIE =' + req.body.OrderID_Edit).then((OrderAmount)=>{

                knex.raw('SELECT NAZWA from PRODUKT where PRODUKT.ID_PRODUKT =' + req.body.productList).then((ProductName)=>{


                    for(let i = 0; i < ordersData.length; i++)
                    {
                        if(ordersData[i].ZamowienieID == req.body.OrderID_Edit)
                        {
                            ordersData[i].ProduktNazwa = ProductName[0].NAZWA;
                            ordersData[i].ZamowenieIlosc = OrderAmount[0].ILOSC;
                            break;
                        }
                    }

                    res.render('orderShowEdit',{
                        data: ordersData,
                        formMessage: 'Aktualizacja powiodła się'
                    });


                }, (err)=>{console.log(err.toString())});

            },(err)=>{console.log(err.toString())});

    },(err)=>{
        console.log(err.toString());
        res.render('orderShowEdit',{
            data: ordersData,
            formMessage: 'Zbyt mała ilość produktów w magazynie'
        });


        });

};

exports.finOrder = (req, res) =>
{

    knex.raw("begin finOrder("+req.body.OrderID_Finish+"); end;").then(()=> {

        knex.raw('SELECT DATA_KONIEC from ZAMOWIENIA where ZAMOWIENIA.ID_ZAMOWIENIE =' + req.body.OrderID_Finish).then((orderDate)=> {

            let month = orderDate[0].DATA_KONIEC.getMonth() + 1;
            let day = orderDate[0].DATA_KONIEC.getDate();

            if(month  < 10)
                month = '0' + month;

            if(day < 10)
                day = '0' + day;


            for(let i = 0; i < ordersData.length; i++)
            {
                if(ordersData[i].ZamowienieID == req.body.OrderID_Finish)
                {
                    ordersData[i].ZamowienieDataKoniec = orderDate[0].DATA_KONIEC.getFullYear() + '/' + month + '/' + day;
                    ordersData[i].ZamowienieStatus = 'WYKONANE';
                    break;
                }
            }

            res.render('orderShowEdit',{
                data: ordersData,
                formMessage: 'Poprawnie zakończono zamówienie'
            });



        }, ()=> {

            res.render('orderShowEdit',{
                data: ordersData,
                formMessage: 'Błąd podczas kończenie zamówienia'
            });
        });

    }, () => {
        res.render('orderShowEdit',{
            data: ordersData,
            formMessage: 'Błąd podczas kończenie zamówienia'
        });
    });

};

exports.cancelOrder = (req, res) =>
{

    knex.raw('SELECT ID_PRODUKT from ZAMOWIENIA WHERE ID_ZAMOWIENIE =' + req.body.OrderID_Del).then((productID) => {

        knex.raw("begin cancelOrder("+req.body.OrderID_Del+",'"+ productID[0].ID_PRODUKT +
            "',"+req.body.OrderAmountCancel+"); end;").then(()=> {


            for(let i = 0; i < ordersData.length; i++)
            {
                if(ordersData[i].ZamowienieID == req.body.OrderID_Del)
                {
                    ordersData.splice(i, 1);
                    break;
                }
            }

            res.render('orderShowEdit',{
                data: ordersData,
                formMessage: 'Zamówienie zostało anulowane'
            });


        }, () => {

            res.render('orderShowEdit',{
                data: ordersData,
                formMessage: 'Błąd podczas anulowania zamówienia. Istnieje reklamacja przypisana do tego zamówienia'
            });
        });

    }, ()=> {

        res.render('orderShowEdit',{
            data: ordersData,
            formMessage: 'Błąd podczas anulowania zamówienia. Istnieje reklamacja przypisana do tego zamówienia'
        });
    });


};

