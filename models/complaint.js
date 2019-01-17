const bookshelf = require('../config/bookshelf');

const complaintModel = bookshelf.Model.extend(
    {
        tableName: 'REKLAMACJE'
    }
);


module.exports.create = (userApp) =>
{
    return new complaintModel(
        {
            INFO: userApp.complaintInfo,
            ID_ZAMOWIENIE: userApp.ID_ZAMOWIENIE
        }
    ).save();
};



module.exports.getData = () =>
{
    return new complaintModel().fetchAll();
}