//All controllers which are used to render sites
const component = require('../models/component');
const producer = require('../models/producer');
const cities  = require('../models/address');
const product = require('../models/product');
const customer = require('../models/customer');
const order = require('../models/order');


exports.home = (req, res) =>
{
    res.render('home');
};

exports.storehouse = (req, res) =>
{
    res.render('storehouse');
};

exports.delivery = (req,res) =>
{
    res.render('delivery');
};


exports.orderShowEdit = (req,res) =>
{
        res.render('orderShowEdit', {
            formMessage: req.flash('orderEditStatus')
        });

};

exports.productShowEdit = (req, res) =>
{
    var data = component.getData().then(function (componentData) {

        var data1 = producer.getData().then(function (producerData) {

            module.exports.componentList = componentData.serialize();
            module.exports.producerList = producerData.serialize();

            res.render('productShowEdit',
                {
                    components: componentData.serialize(),
                    producers: producerData.serialize(),
                    formMessage: req.flash('productDelStatus')
                });

        });

    });

};


exports.complaintCreate = (req, res) =>
{
    var data = order.getData().then(function(productData)
    {
        res.render('complaintCreate',
            {
                orders: productData.serialize(),
                formMessage: req.flash('statusComplaint')
            });
    });

};

exports.complaintShowEdit = (req, res) =>
{
    res.render('complaintShowEdit',{
        formMessage: req.flash('complaintEditStatus')
    });
};

exports.customerShowEdit = (req, res) =>
{
    var data2 = cities.getData().then(function (citiesData) {

        module.exports.cityList = citiesData.serialize();

        res.render('customersShowEdit', {
            formMessage: req.flash('customersEditStatus'),
            cities: citiesData.serialize()
        });


    });

};


exports.orderCreate = (req, res) =>
{

    var data = product.getData().then(function(productData)
    {
        var data1 = customer.getData().then(function(customerData)
        {
            var data2 = cities.getData().then(function (citiesData) {

                res.render('orderCreate',
                    {
                        customers: customerData.serialize(),
                        products: productData.serialize(),
                        cities: citiesData.serialize(),
                        formMessage: req.flash('statusOrder')
                    });

            });

        });

    });


};


exports.productCreate = (req, res) =>
{
    var data = component.getData().then(function (componentData) {

        var data1 = producer.getData().then(function (producerData) {

            var data2 = cities.getData().then(function (citiesData) {

                module.exports.componentList = componentData.serialize();
                module.exports.producerList = producerData.serialize();
                module.exports.cityList = citiesData.serialize();

                res.render('productCreate', {
                    components: componentData.serialize(),
                    producers: producerData.serialize(),
                    cities: citiesData.serialize(),
                    formMessage: req.flash('statusCreateProduct')
                })


            });

        });

    });

};
