var express = require('express');
var router = express.Router();

var TOKEN = require('../../commons/idefine_service');

/**
 * Post Router for receive data log from browser of client wathcing video
 */
router.post('/call-service/help-me/token/web', function(req, res, next) {

    if (req.body.request === 'token' && req.body.type === 'web' && req.body.service !== null) {
        let token = null;
        if (req.body.service === 'KenhHai') {
            token = TOKEN.KenhHai.web;
        }
        if (req.body.service === 'MyClip') {
            token = TOKEN.MyClip.web;
        }
        if (req.body.service === 'VideoHay') {
            token = TOKEN.VideoHay.web;
        }
        if (req.body.service === 'FiveDMax') {
            token = TOKEN.FiveDMax.web;
        }
        res.status(200).json({
            'status': 'Successed',
            'token': token,
        });
        //res.status(200).end();
    } else {
        res.status(405).json({
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not process',
        });
        //res.status(405).end();
    }
});

router.post('/call-service/help-me/token/mobile', function(req, res, next) {

    if (req.body.request === 'token' && req.body.type === 'android_mobile' && req.body.service !== null) {
        let token = null;
        if (req.body.service === 'KenhHai') {
            token = TOKEN.KenhHai.android_mobile;
        }
        if (req.body.service === 'MyClip') {
            token = TOKEN.MyClip.android_mobile;
        }
        if (req.body.service === 'VideoHay') {
            token = TOKEN.VideoHay.android_mobile;
        }
        if (req.body.service === 'FiveDMax') {
            token = TOKEN.FiveDMax.android_mobile;
        }
        res.status(200).json({
            "responseCode": "200",
            "message": "Thành công",
            'data': token,
        });
        //res.status(200).end();
    } else {
        res.status(405).json({
            "responseCode": "405",
            "message": "Yêu Cầu Không Thành Công",
            'data': null,
        });
        //res.status(405).end();
    }
});

module.exports = router;