const bookshelf = require('../config/bookshelf');

const producerAddress = bookshelf.Model.extend(
    {
        tableName: 'ADRES_PRODUCENT'
    }
);


module.exports.create = (userApp) =>
{
    return new producerAddress(
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