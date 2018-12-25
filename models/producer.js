const bookshelf = require('../config/bookshelf');

const producerModel = bookshelf.Model.extend(
    {
        tableName: 'PRODUCENT'
    }
);

/*
module.exports.create = (userApp) =>
{
    return new userModel(
        {
            KOD_POCZTOWY: userApp.KOD_POCZTOWY,
            MIEJSCOWOSC: userApp.MIEJSCOWOSC
        }
    ).save();
};
*/


module.exports.getData = () =>
{
    return new producerModel().fetchAll();
}