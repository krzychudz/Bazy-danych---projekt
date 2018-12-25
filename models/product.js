const bookshelf = require('../config/bookshelf');
const knex = require('knex')(require('../config/knexfile'));


const productModel = bookshelf.Model.extend(
    {
        tableName: 'PRODUKT'
    }
);


module.exports.create = (productData) =>
{
    /*
    return new productModel(
        {
            ID_PRODUKT: PRODUKT_SEQ.NEXTVAL,
            NAZWA: userApp.MIEJSCOWOSC,
            ID_PODZESPOL: lalal,
            ID_PRODUCENT: lala1
        }
    ).save();
*/

    console.log(productData.ID_PODZESPOL);

    knex('PRODUKT').insert(
        {
            ID_PRODUKT: PRODUKT_SEQ.NEXTVAL,
            NAZWA: productData.productName,
            ID_PODZESPOL: productData.ID_PODZESPOL,
            ID_PRODUCENT: productData.ID_PRODUCENT
        }
    )

};

module.exports.getData = () =>
{
    return new productModel().fetchAll();
}