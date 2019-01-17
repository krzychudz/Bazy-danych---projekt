const bookshelf = require('../config/bookshelf');

const customerAddress = bookshelf.Model.extend(
    {
        tableName: 'ADRES_KLIENT'
    }
);


module.exports.create = (userApp) =>
{
    return new customerAddress(
        {
            ULICA: userApp.street,
            KOD_POCZTOWY: userApp.zipCode
        }
    ).save();
};


/*
module.exports.getData = () =>
{
    return new addressModel()
}*/