const bookshelf = require('../config/bookshelf');


const orderModel = bookshelf.Model.extend(
    {
        tableName: 'ZAMOWIENIA'
    }
);


module.exports.create = (userApp) =>
{

    console.log(userApp.DATA_START);
    console.log(userApp.DATA_KONIEC);
    console.log(userApp.ID_PRODUKT);
    console.log(userApp.ID_KLIENT);
    console.log(userApp.AMOUNT);

    return new orderModel(
        {
            DATA_START: userApp.DATA_START,
            DATA_KONIEC: userApp.DATA_KONIEC,
            ID_PRODUKT: userApp.ID_PRODUKT,
            KLIENT_ID: userApp.ID_KLIENT,
            ILOSC: userApp.AMOUNT
        }
    ).save();
};



module.exports.getData = () =>
{
    return new orderModel().fetchAll();
}