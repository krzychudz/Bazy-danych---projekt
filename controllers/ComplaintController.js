const complaint = require('../models/complaint');
const knex = require('knex')(require('../config/knexfile'));
//const { check, validationResult } = require('express-validator/check');
//const pagesController = require('./PageController');

let ComplaintsData;

exports.store = (req, res) =>
{
    const Complaint = complaint.create(
        {
            'complaintInfo': req.body.complaintInfo,
            'ID_ZAMOWIENIE': req.body.orderList
        }
    ).then(function ()
    {
        req.flash('statusComplaint','Reklamacja została dodana do bazy dancyh!');
        res.redirect('/complaintCreate');
    }, function()
    {
        req.flash('statusComplaint','Reklamacja dla tego zamówienia jest już w bazie!');
        res.redirect('/complaintCreate');
    });

};


exports.getData = (req, res) =>
{

    let qb = knex('REKLAMACJE')
        .innerJoin('ZAMOWIENIA','REKLAMACJE.ID_ZAMOWIENIE','ZAMOWIENIA.ID_ZAMOWIENIE')
        .innerJoin('PRODUKT','PRODUKT.ID_PRODUKT', 'ZAMOWIENIA.ID_PRODUKT')
        .innerJoin('KLIENT','KLIENT.KLIENT_ID', 'ZAMOWIENIA.KLIENT_ID')
        .where('REKLAMACJE.INFO','like','%'+req.query.searchPattern+'%')
        .orWhere('REKLAMACJE.STATUS','like','%'+req.query.searchPattern+'%')
        .orWhere('PRODUKT.NAZWA','like','%'+req.query.searchPattern+'%')
        .orWhere('KLIENT.IMIE','like','%'+req.query.searchPattern+'%')
        .orWhere('KLIENT.NAZWISKO','like','%'+req.query.searchPattern+'%')
        .select(
            'REKLAMACJE.DATA_START as ReklamacjaDataStart',
            'REKLAMACJE.DATA_KONIEC as ReklamacjaDataKoniec',
            'REKLAMACJE.INFO as ReklamacjaInfo',
            'REKLAMACJE.STATUS as ReklamacjaStatus',
            'PRODUKT.NAZWA as ProduktNazwa',
            'KLIENT.IMIE as KlientImie',
            'KLIENT.NAZWISKO as KlientNazwisko',
            'REKLAMACJE.ID_REKLAMACJA as ReklamacjaID',
            )
        .then((rows)=>{

            for(let i = 0; i < rows.length; i++) {

                let month = rows[i].ReklamacjaDataStart.getMonth() + 1;
                let day = rows[i].ReklamacjaDataStart.getDate();

                if (month < 10)
                    month = '0' + month;

                if (day < 10)
                    day = '0' + day;

                rows[i].ReklamacjaDataStart = rows[i].ReklamacjaDataStart.getFullYear() + '/' + month + '/' + day;


                if (rows[i].ReklamacjaDataKoniec == null)
                    rows[i].ReklamacjaDataKoniec = "-";
                else {
                    month = rows[i].ReklamacjaDataKoniec.getMonth() + 1;
                    day = rows[i].ReklamacjaDataKoniec.getDate();

                    if (month < 10)
                        month = '0' + month;

                    if (day < 10)
                        day = '0' + day;
                    rows[i].ReklamacjaDataKoniec = rows[i].ReklamacjaDataKoniec.getFullYear() + '/' + month + '/' + day;
                }

            }

            ComplaintsData = rows;


            res.render('complaintShowEdit',{
                data: rows,
                formMessage: 0
            });


        });



};


exports.updateData = (req, res) =>
{
    knex.raw("begin updateComplaint("+req.body.ComplaintID_Edit+",'"+ req.body.ComplaintInfo+"'); end;").then(()=>{


        for(let i = 0; i < ComplaintsData.length; i++)
        {
            if(ComplaintsData[i].ReklamacjaID == req.body.ComplaintID_Edit)
            {
                ComplaintsData[i].ReklamacjaInfo = req.body.ComplaintInfo;
                break;
            }
        }


        res.render('complaintShowEdit',{
            data: ComplaintsData,
            formMessage: 'Reklamacja została zaktualizowana'
        });

    }, ()=>{
        res.render('complaintShowEdit',{
            data: ComplaintsData,
            formMessage: 'Reklamacja nie została zaktualizowana'
        });
    });


};

exports.finComplaint = (req, res) =>
{
    knex.raw("begin finComplaint("+req.body.ComplaintID_Finish+"); end;").then(()=>{

        knex.raw('SELECT DATA_KONIEC from REKLAMACJE where REKLAMACJE.ID_REKLAMACJA =' + req.body.ComplaintID_Finish).then((orderDate)=> {

            console.log(orderDate[0].DATA_KONIEC);

            let month = orderDate[0].DATA_KONIEC.getMonth() + 1;
            let day = orderDate[0].DATA_KONIEC.getDate();

            if (month < 10)
                month = '0' + month;

            if (day < 10)
                day = '0' + day;

            for(let i = 0; i < ComplaintsData.length; i++)
            {
                if(ComplaintsData[i].ReklamacjaID == req.body.ComplaintID_Finish)
                {
                    ComplaintsData[i].ReklamacjaStatus = "ZAMKNIĘTA";
                    ComplaintsData[i].ReklamacjaDataKoniec = orderDate[0].DATA_KONIEC.getFullYear() + '/' + month + '/' + day;
                    break;
                }
            }

            res.render('complaintShowEdit',{
                data: ComplaintsData,
                formMessage: 'Reklamacja została zakończona'
            });



        }, (err) => {console.log(err.toString())});

    }, (err) => {

        console.log(err.toString());

        res.render('complaintShowEdit',{
            data: ComplaintsData,
            formMessage: 'Reklamacja nie została zakończona'
        });

    });
};

exports.deleteComplaint = (req,res) =>
{
    knex.raw("begin delComplaint("+req.body.ComplaintID_Del+"); end;").then(()=>{

        for(let i = 0; i < ComplaintsData.length; i++)
        {
            if(ComplaintsData[i].ReklamacjaID == req.body.ComplaintID_Del)
            {
                ComplaintsData.splice(i, 1);
                break;
            }
        }

        res.render('complaintShowEdit',{
            data: ComplaintsData,
            formMessage: 'Reklamacja została usunięta'
        });


    }, (err) =>{

        res.render('complaintShowEdit',{
            data: ComplaintsData,
            formMessage: 'Reklamacja nie została usunięta'
        });

    });


};