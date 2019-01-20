var express = require('express');
var sizeof = require('object-sizeof');
var router = express.Router();
var functionUtils = require('../../commons/functions');

// path save data all folder
const path_log_datas = 'cron_tasks/all-data/kenh-hai/';
const timerProcessRequest = 1 * 60 * 1000; // 5 phút xử lý hàng đợi request một lần

let clientRequestMap = new Map();
let clientRequestIdSet = new Set();
/**
 * Post Router for receive data log from browser of client wathcing video
 */
router.post('/event/log-datas', function(req, res, next) {
    console.log(req.body);
    clientRequestIdSet.add(req.body.userID);
    clientRequestMap.set(req.body.userID + '@' + req.body.mediaInfos.mediaID + '@' + req.body.time, req.body);

    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;
    let TIMEOUT = 0;
    
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
        if (req.body.mediaInfos.mediaDuration < 300) {
            TIMEOUT = 10000;
        } else if (req.body.mediaInfos.mediaDuration < 3600) {
            TIMEOUT = 20000;
        } else if (req.body.mediaInfos.mediaDuration < 10800) {
            TIMEOUT = 60000;
        } else {
            TIMEOUT = 300000;
        }
        res.status(200).json({
            'status': 'Successed',
            'code': 200,
            'TIMEOUT': TIMEOUT,
        });
        //res.status(200).end();
    } else {
        if (req.body.mediaInfos.mediaDuration < 300) {
            TIMEOUT = 10000;
        } else if (req.body.mediaInfos.mediaDuration < 3600) {
            TIMEOUT = 20000;
        } else if (req.body.mediaInfos.mediaDuration < 10800) {
            TIMEOUT = 60000;
        } else {
            TIMEOUT = 300000;
        }
        res.status(405).json({
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not process',
            'TIMEOUT': TIMEOUT,
        });
        //res.status(405).end();
    }
});
const xah_map_to_obj = ( aMap) => {
    const obj = {};
    aMap.forEach ((v,k) => { obj[k] = v });
    return obj;
};


// setInterval(function() {
//     console.log(clientRequestMap);
//     console.log('--------------------');
//     console.log(clientRequestMap.size);
//     console.log('--------------------');
//     console.log(clientRequestIdSet);
//     console.log(clientRequestIdSet.size);
   
//     if (clientRequestMap.size > 100000) {
//         clientRequestMap.clear();
//     }
//     if (clientRequestIdSet.size > 100000) {
//         clientRequestIdSet.clear();
//     }
//     console.log(sizeof(xah_map_to_obj(clientRequestMap)));

//     const used = process.memoryUsage().heapUsed / 1024 / 1024;
//     console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

// }, timerProcessRequest);


module.exports = router;