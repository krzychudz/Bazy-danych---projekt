const bookshelf = require('../config/bookshelf');


const addressModel = bookshelf.Model.extend(
    {
        tableName: 'MIASTO'
    }
);

/*
module.exports.create = (userApp) =>
{
    return new addressModel(
        {
            KOD_POCZTOWY: ,
            MIEJSCOWOSC: userApp.hdd,
            GPU: userApp.gpu
        }
    ).save();
};
*/


module.exports.getData = () =>
{
    return new addressModel().fetchAll();
}