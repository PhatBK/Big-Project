var express = require('express');
var router = express.Router();
// var IdefineService = require('../../commons/idefine_service');
var functionUtils = require('../../commons/functions');

// path save data all folder
const path_log_datas = 'cron_tasks/all-data/kenh-hai/';

// path save data one folder
let totalRequested  = 0;

let clientWatchedDuration = [];
let clientMediaDuration = [];

/**
 * Post Router for receive data log from browser of client wathcing video
 */
router.post('/event/log-datas', function(req, res, next) {

    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;
    totalRequested++;
    if (req.body.watchedDuration !== 0 && 
        (
            req.body.event === 'performance' ||
            req.body.event === 'ended' ||
            req.body.event === 'error' ||
            req.body.errorCode > -1 ||
            req.body.event === 'dispose' ||
            req.body.event === 'stalled' || 
            req.body.event ===  'beforeunload'
        )
    ) {
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
            req.body.mediaInfos.mediaID,
            JSON.stringify(req.body.mediaInfos.mediaName),
            JSON.stringify(req.body.mediaInfos.mediaCategory),
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
            req.body.mediaInfos.mediaDuration,
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