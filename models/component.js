const bookshelf = require('../config/bookshelf');


const componentModel = bookshelf.Model.extend(
    {
        tableName: 'PODZESPOLY'
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
    return new componentModel().fetchAll();
}