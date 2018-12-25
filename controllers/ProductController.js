const product = require('../models/product');


exports.store = (req, res) =>
{
    const Product = product.create(
        {
            'productName': req.body.productName,
            'ID_PODZESPOL': req.body.ID_PODZESPOL,
            'ID_PRODUCENT': req.body.ID_PRODUCENT

        }
    ).then(function ()
    {
        res.redirect('/productCreate');
    });

};