var express = require('express');
var router = express.Router();
// var IdefineService = require('../../commons/idefine_service');
//var functionUtils = require('../../commons/functions');
var TOKEN = require('../../commons/idefine_service');

// path save data all folder

// path save data one folder
let totalRequested  = 0;

/**
 * Post Router for receive data log from browser of client wathcing video
 */
router.post('/call-service/help-me/token', function(req, res, next) {

    totalRequested++;
    if (req.body) {
        res.status(200).json({
            'status': 'Successed',
            'token': TOKEN.KenhHai.web,
            'totalRequested': totalRequested,
        });
    } else {
        res.status(405).json({
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not allow',
            'totalRequested': totalRequested,
        });
    }
});

module.exports = router;