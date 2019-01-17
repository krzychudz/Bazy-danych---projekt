const bookshelf = require('../config/bookshelf');

const producerModel = bookshelf.Model.extend(
    {
        tableName: 'PRODUCENT'
    }
);


module.exports.create = (userApp) =>
{

    return new producerModel(
        {
            TELEFON: userApp.TELEFON,
            ID_ADRESPRODUCENT: userApp.ID_ADRESPRODUCENT,
            NAZWA: userApp.NAZWA
        }
    ).save();
};



module.exports.getData = () =>
{
    return new producerModel().fetchAll();
}