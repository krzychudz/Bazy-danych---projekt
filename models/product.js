const bookshelf = require('../config/bookshelf');
const knex = require('knex')(require('../config/knexfile'));


const productModel = bookshelf.Model.extend(
    {
        tableName: 'PRODUKT'
    }
);


module.exports.create = (productData) =>
{

    return new productModel(
        {
            NAZWA: productData.productName,
            ID_PODZESPOL: productData.ID_PODZESPOL,
            ID_PRODUCENT: productData.ID_PRODUCENT
        }
    ).save();

};

module.exports.getData = () =>
{
    return new productModel().fetchAll();
}