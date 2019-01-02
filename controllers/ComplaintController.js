const complaint = require('../models/complaint');
//const { check, validationResult } = require('express-validator/check');
//const pagesController = require('./PageController');

exports.store = (req, res) =>
{
    const Complaint = complaint.create(
        {
            'complaintInfo': req.body.complaintInfo,
            'ID_ZAMOWIENIE': req.body.orderList
        }
    ).then(function ()
    {
        req.flash('statusComplaint','Reklamacja została dodana do bazy dancyh!');
        res.redirect('/complaintCreate');
    }, function()
    {
        req.flash('statusComplaint','Reklamacja nie została dodana do bazy danych!');
        res.redirect('/complaintCreate');
    });

};