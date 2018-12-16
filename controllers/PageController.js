const bookshelf = require('../config/bookshelf');

const miastoModel = bookshelf.Model.extend(
    {
        tableName: 'MIASTO'
    }
);

const getDB = () =>
{
    return new miastoModel().fetchAll();
}

exports.home = (req, res) =>
{

    var data = getDB().then(function (resData) {

        console.log(resData.serialize());

    });

    res.render('home');
};
