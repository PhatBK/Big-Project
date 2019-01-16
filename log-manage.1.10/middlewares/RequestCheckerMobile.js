const Utils = require('../commons/functions');

module.exports = function(req,res,next) {
    
    if(
        req.method === 'POST' &&
        req.headers['service_token'] !== undefined &&
        req.body.mediaInfos !== undefined &&
        req.body.userID !== undefined &&
        req.body.ipPublic !== undefined &&
        req.body.ipPrivate !== undefined &&
        req.body.userAgent !== undefined &&
        req.body.time !== undefined &&
        req.body.bitrateNetwork !== undefined &&
        req.body.connectType !== undefined &&
        req.body.seekCount !== undefined &&
        req.body.pauseCount !== undefined &&
        req.body.bufferCount !== undefined &&
        req.body.suspendCount !== undefined &&
        req.body.initialLoadTime !== undefined &&
        req.body.watchedDuration !== undefined &&
        req.body.bufferDuration !== undefined &&
        req.body.errorCode !== undefined &&
        req.body.errorMessage !== undefined
    ) {

        let serviceIdefine = Utils.serviceIdefine(req.headers['service_token'], 4);
        if (
            serviceIdefine.service_name !== 'undefined' &&
            serviceIdefine.service_type !== 'undefined'
        ) {
            // check xem media info có null hay không
            let mediaInfos = JSON.parse(req.body.mediaInfos);
            if (
                mediaInfos.mediaID !== null &&
                mediaInfos.mediaName !== null &&
                mediaInfos.mediaCategory !== null &&
                mediaInfos.mediaDuration !== 0 &&
                req.body.userID !== null
            ) {
                 // check thời gian từ client gửi lên xem có giống với thời gian của server không
                let server_Date = Utils.timeNormalFormat(new Date());
                if (req.body.time !== null) {
                    if (!Utils.compareTime(req.body.time, server_Date)) {
                        req.body.time = server_Date;
                    }
                }
                if (req.body.time === null) {
                    req.body.time = server_Date;
                }
                if (req.body.ipPrivate === null) {
                    req.body.ipPrivate = '192.168.1.1';
                }
                if (req.body.ipPublic === null) {
                    req.body.ipPublic = '1.1.1.1';
                }
                if (req.body.userAgent === null) {
                    req.body.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
                }
                if (req.body.connectType === null) {
                    req.body.connectType = Utils.connectionNormal(0, 3, req.body.bitrateNetwork);
                }
                if (req.body.errorMessage === null) {
                    req.body.errorMessage = 'undefined';
                }
                console.log('Mobile passed');
                next();
            }
        } else {
            console.log('Mobile Bad request');
            res.status(400).json({
                'status': 'Faulure',
                'message': 'Request not allowed',
            });
        }

    } else {
        console.log('Mobile Bad request');
        res.status(400).json({
            'status': 'Faulure',
            'message': 'Request not allowed',
        });
    }
};