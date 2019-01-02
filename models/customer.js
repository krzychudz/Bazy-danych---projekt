const bookshelf = require('../config/bookshelf');


const customerModel = bookshelf.Model.extend(
    {
        tableName: 'KLIENT'
    }
);


module.exports.create = (userApp) =>
{

    return new customerModel(
        {
            IMIE: userApp.customerFirstname,
            NAZWISKO: userApp.customerLastname,
            TELEFON: userApp.customerTel,
            ID_ADRESKLIENT: userApp.ID_ADRESKLIENT
        }
    ).save();
};



module.exports.getData = () =>
{
    return new customerModel().fetchAll();
}