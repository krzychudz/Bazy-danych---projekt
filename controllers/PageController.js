//All controllers which are used to render sites
const component = require('../models/component');
const producer = require('../models/producer');


exports.home = (req, res) =>
{
    res.render('home');
};


exports.productCreate = (req, res) =>
{
    var data = component.getData().then(function (componentData) {

        var data1 = producer.getData().then(function (producerData) {

            module.exports.componentList = componentData.serialize();
            module.exports.producerList = producerData.serialize();

            res.render('productCreate', {
                components: componentData.serialize(),
                producers: producerData.serialize(),
                formMessage: req.flash('statusCreateProduct')
            })

        });

    });

}
