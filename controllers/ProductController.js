const product = require('../models/product');
const storehouse = require('../models/storehouse');
const { check, validationResult } = require('express-validator/check');
const pagesController = require('./PageController');
const knex = require('knex')(require('../config/knexfile'));


let productsData;

exports.store = (req, res) =>
{

    const Product = product.create(
        {
            'productName': req.body.productName,
            'productPrice': req.body.productPrice,
            'ID_PRODUCENT': req.body.producerList,
            'ID_PODZESPOL': req.body.componentList
        }
    ).then(function ()
    {

        knex('PRODUKT').where({
            NAZWA: req.body.productName
            //ID_PRODUCENT: req.body.producerList,
            //ID_PODZESPOL: req.body.componentList
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


exports.getData = (req,res) =>
{

    let qb = knex('PRODUKT')
        .innerJoin('PRODUCENT','PRODUKT.ID_PRODUCENT','PRODUCENT.ID_PRODUCENT')
        .innerJoin('PODZESPOLY','PRODUKT.ID_PODZESPOL', 'PODZESPOLY.ID_PODZESPOL')
        .where('PRODUCENT.NAZWA','like','%'+req.query.searchPattern+'%')
        .orWhere('PRODUKT.NAZWA','like','%'+req.query.searchPattern+'%')
        .orWhere('PRODUKT.ID_PRODUKT','like','%'+req.query.searchPattern+'%')
        .orWhere('PODZESPOLY.PROCESOR','like','%'+req.query.searchPattern+'%')
        .orWhere('PODZESPOLY.RAM','like','%'+req.query.searchPattern+'%')
        .orWhere('PODZESPOLY.HDD','like','%'+req.query.searchPattern+'%')
        .orWhere('PODZESPOLY.GPU','like','%'+req.query.searchPattern+'%')
        .orWhere('PRODUKT.CENA','like','%'+req.query.searchPattern+'%')
        .select(
            'PRODUCENT.NAZWA as ProducentNazwa',
            'PRODUKT.NAZWA as ProduktNazwa',
            'PRODUKT.ID_PRODUKT as IdProdukt',
            'PODZESPOLY.PROCESOR as PodzespolProcesor',
            'PODZESPOLY.RAM as PodzespolRAM',
            'PODZESPOLY.HDD as PodzespolHDD',
            'PODZESPOLY.GPU as PodzespolGPU',
            'PRODUKT.CENA as ProduktCena')
        .then((rows)=>{

            productsData = rows;

            res.render('productShowEdit',
                {
                    components: pagesController.componentList,
                    producers: pagesController.producerList,
                    data: rows,
                    formMessage: 0
                });
        },(err)=>{
            console.log(err.toString());
        });

};


exports.updateData = (req, res) =>
{
    knex.raw("begin updateProduct("+req.body.ProductID+",'"+ req.body.ProductName +
        "',"+req.body.componentList+","+req.body.producerList+","+req.body.ProductPrice+"); end;").then(()=>{

        knex.raw("Select NAZWA from PRODUCENT WHERE ID_PRODUCENT = " + req.body.producerList).then((PROD_NAME) => {

            knex.raw("SELECT PROCESOR, RAM, HDD, GPU from PODZESPOLY where ID_PODZESPOL = " + req.body.componentList).then((componentsName)=>{

                for(let i = 0; i < productsData.length; i++)
                    if(productsData[i].IdProdukt == req.body.ProductID)
                    {
                        productsData[i].ProduktNazwa = req.body.ProductName;
                        productsData[i].ProduktCena = req.body.ProductPrice;
                        productsData[i].ProducentNazwa = PROD_NAME[0].NAZWA;
                        productsData[i].PodzespolProcesor = componentsName[0].PROCESOR;
                        productsData[i].PodzespolRAM = componentsName[0].RAM;
                        productsData[i].PodzespolHDD = componentsName[0].HDD;
                        productsData[i].PodzespolGPU = componentsName[0].GPU;

                        break;

                    }

                res.render('productShowEdit',
                    {
                        components: pagesController.componentList,
                        producers: pagesController.producerList,
                        data: productsData,
                        formMessage: 'Edycja produktu zakończyła się skucesem'
                    });

            }, (err) =>{
                console.log(err.toString());
            });


        }, (err)=>{
            console.log(err.toString());
        });


    }, (err) => {
        res.render('productShowEdit',
            {
                components: pagesController.componentList,
                producers: pagesController.producerList,
                data: productsData,
                formMessage: 'Edycja produktu zakończyła się niepowodzeniem'
            });

    });
};


exports.deleteData = (req, res) =>
{
    knex.raw("begin delProduct("+req.body.ProductID_DEL+"); end;").then(()=> {

        for(let i = 0; i < productsData.length; i++)
        {
            if(productsData[i].IdProdukt == req.body.ProductID_DEL) {
                productsData.splice(i, 1);
                break;
            }
        }

        res.render('productShowEdit',
            {
                components: pagesController.componentList,
                producers: pagesController.producerList,
                data: productsData,
                formMessage: 0
            });

    }, () => {

        res.render('productShowEdit',
            {
                components: pagesController.componentList,
                producers: pagesController.producerList,
                data: productsData,
                formMessage: 'Nie udało się usunąć przedmiotu. Prawdopodbnie jest gdzieś używany.'
            });

    });
};