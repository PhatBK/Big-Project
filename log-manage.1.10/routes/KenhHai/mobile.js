var express = require('express');
var router = express.Router();
var functionUtils = require('../../commons/functions');

let totalRequested  = 0;
const path_log_datas = 'cron_tasks/all-data/kenh-hai/';

/* Post home page. */
router.post('/event/log-datas', function(req, res, next) {
    // console.log(req.headers);
    console.log(req.body);
    let mediaInfos = JSON.parse(req.body.mediaInfos);
    
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;
    
    if (service_name !== 'undefined' && service_type !== 'undefined') {
        let allLogsPath = path_log_datas + functionUtils.dateNormalFormat(new Date()) + '.txt';
        if (functionUtils.checkFileExists(allLogsPath)) {
            console.log("File already exist");
        } else {
            console.log("File undefine");
            functionUtils.createNewFile(allLogsPath);
        }
        
        functionUtils.writeAppendFileRestNormal(
            allLogsPath,
            req.headers['service_token'],
            service_name,
            service_type,
            req.body.userID,
            mediaInfos.mediaID,
            JSON.stringify(mediaInfos.mediaName),
            JSON.stringify(mediaInfos.mediaCategory),
            JSON.stringify(req.body.userAgent),
            JSON.stringify(req.body.errorMessage),
            req.body.ipPublic,
            req.body.ipPrivate,
            req.body.time,
            req.body.connectType,
            req.body.bitrateNetwork,
            req.body.seekCount,
            req.body.pauseCount,
            req.body.bufferCount,
            req.body.suspendCount,
            req.body.initialLoadTime,
            mediaInfos.mediaDuration,
            req.body.watchedDuration,
            req.body.bufferDuration,
            req.body.errorCode,
        );
        res.status(200).json({
            'status': 'Successed',
            'data': req.body,
            'totalRequested': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'all-event-tracking',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not allow',
            'totalRequested': totalRequested,
        });
    }
    
});

module.exports = router;