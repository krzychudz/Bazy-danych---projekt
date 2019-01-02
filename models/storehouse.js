const bookshelf = require('../config/bookshelf');


const storehouseModel = bookshelf.Model.extend(
    {
        tableName: 'MAGAZYN'
    }
);


module.exports.create = (productData) =>
{

    return new storehouseModel(
        {
            ID_MAGAZYN: 0,
            ILOSC: 0,
            ID_PRODUKT: productData.ID_PRODUKT
        }
    ).save();

};

module.exports.getData = () =>
{
    return new storehouseModel().fetchAll();
}