const bookshelf = require('../config/bookshelf');


const componentModel = bookshelf.Model.extend(
    {
        tableName: 'PODZESPOLY'
    }
);


module.exports.create = (userApp) =>
{
    return new componentModel(
        {
            PROCESOR: userApp.processor,
            RAM: userApp.ram,
            HDD: userApp.hdd,
            GPU: userApp.gpu
        }
    ).save();
};



module.exports.getData = () =>
{
    return new componentModel().fetchAll();
}