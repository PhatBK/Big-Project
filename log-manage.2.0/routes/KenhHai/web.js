var express = require('express');
var router = express.Router();
// var IdefineService = require('../../commons/idefine_service');
var functionUtils = require('../../commons/functions');

// path save data all folder
const path_data_buffer = 'cron_tasks/all-data/buffered/';
const path_data_error = 'cron_tasks/all-data/error/';
const path_data_first_load = 'cron_tasks/all-data/first-load/';
const path_data_pause = 'cron_tasks/all-data/pause/';
const path_data_performance = 'cron_tasks/all-data/performance/';
const path_data_seek= 'cron_tasks/all-data/seek/';
const path_data_percentile = 'cron_tasks/all-data/percentile/';
const path_data_quality = 'cron_tasks/all-data/quality/';
// path save data one folder
const path_buffered = 'cron_tasks/kenh-hai/buffered/';
const path_error = 'cron_tasks/kenh-hai/error/';
const path_first_load = 'cron_tasks/kenh-hai/first-load/';
const path_pause = 'cron_tasks/kenh-hai/pause/';
const path_performance = 'cron_tasks/kenh-hai/performance/';
const path_seek = 'cron_tasks/kenh-hai/seek/';
const path_quarter = 'cron_tasks/kenh-hai/percentile/';
const path_quality = 'cron_tasks/kenh-hai/quality/';

let totalRequested  = 0;

/**
 * Post Router for receive data log from browser of client wathcing video
 */
router.post('/event/log-datas', function(req, res, next) {
    console.log(req.body);
    res.status(200).json({
        'status': "Successed"
    });
})
// errors event
router.post('/event/errors', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let errors = path_error + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(errors)) {
        console.log("File already exist");
    } else {
        console.log("File undefine");
        functionUtils.createNewFile(errors);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.error_code !== undefined &&
        req.body.data.error_type !== undefined &&
        req.body.data.error_message !== undefined &&


        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(errors,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,
            req.body.time,

            req.body.data.error_code,
            req.body.data.error_type,
            JSON.stringify(req.body.data.error_message),
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            service_name,
            service_type,
        );
        res.status(200).json(
        {
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });

    } else {
        res.status(405).json({
            'event': 'Errors',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }
});
// first play event
router.post('/event/first-play', function(req, res, next) {
    // check service name and service type used
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let first_play = path_first_load + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(first_play)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(first_play);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.secondsToLoad !== undefined &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        if (req.body.data.secondsToLoad > req.body.media_duration) {
            req.body.data.secondsToLoad = req.body.media_duration / 2;
        }
        totalRequested += 1;
        functionUtils.writeAppendFileRestNormal(first_play,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.secondsToLoad,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            service_name,
            service_type,
        );
        res.status(200).json(
        {
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'First-Play',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }
});
// first quarter event
router.post('/event/first-quarter', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let first_quarter = path_quarter + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(first_quarter)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(first_quarter);
    }

    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.seekCount !== undefined &&
        req.body.data.pauseCount !== undefined &&
        req.body.data.currentTime !== undefined &&
        req.body.data.duration !== undefined && req.body.data.duration !== 0 &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(first_quarter,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.seekCount,
            req.body.data.pauseCount,
            req.body.data.currentTime,
            req.body.data.duration,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            "FIRST",
            service_name,
            service_type,
        );
        res.status(200).json(
        {
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'First-quarter',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }

});
// second quarter event
router.post('/event/second-quarter', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let second_quarter = path_quarter + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(second_quarter)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(second_quarter);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.seekCount !== undefined &&
        req.body.data.pauseCount !== undefined &&
        req.body.data.currentTime !== undefined &&
        req.body.data.duration !== undefined && req.body.data.duration !== 0 &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(second_quarter,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.seekCount,
            req.body.data.pauseCount,
            req.body.data.currentTime,
            req.body.data.duration,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            "SECOND",
            service_name,
            service_type,
        );
        res.status(200).json(
        {
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'Second-quarter',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }
});
// third quarter event
router.post('/event/third-quarter', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let third_quarter = path_quarter + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(third_quarter)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(third_quarter);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.seekCount !== undefined &&
        req.body.data.pauseCount !== undefined &&
        req.body.data.currentTime !== undefined &&
        req.body.data.duration !== undefined && req.body.data.duration !== 0 &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(third_quarter,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.seekCount,
            req.body.data.pauseCount,
            req.body.data.currentTime,
            req.body.data.duration,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            "THIRD",
            service_name,
            service_type,
        );
        res.status(200).json(
        {
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'Third-quarter',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }

});
// fourth quarter event
router.post('/event/fourth-quarter', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let fourth_quarter = path_quarter + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(fourth_quarter)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(fourth_quarter);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.seekCount !== undefined &&
        req.body.data.pauseCount !== undefined &&
        req.body.data.currentTime !== undefined &&
        req.body.data.duration !== undefined && req.body.data.duration !== 0 &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(fourth_quarter,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.seekCount,
            req.body.data.pauseCount,
            req.body.data.currentTime,
            req.body.data.duration,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            "FOURTH",
            service_name,
            service_type,
        );
        res.status(200).json(
        {
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'Fourth-quarter',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }
    
});
// buffered event
router.post('/event/buffered', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let buffered = path_buffered + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(buffered)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(buffered);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.currentTime !== undefined &&
        req.body.data.readyState !== undefined &&
        req.body.data.secondsToLoad !== undefined &&
        req.body.data.bufferCount !== undefined &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined && 

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(buffered,
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.currentTime,
            req.body.data.readyState, 
            req.body.data.secondsToLoad, 
            req.body.data.bufferCount,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            service_name,
            service_type,
        );
        res.status(200).json({
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'Buffered',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }

});
// seek event
router.post('/event/seek', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let seek = path_seek + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(seek)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(seek);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.seekCount !== undefined &&
        req.body.data.seekTo !== undefined &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined && 

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined

    ) {
        functionUtils.writeAppendFileRestNormal(seek, 
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,
            
            req.body.data.seekCount, 
            req.body.data.seekTo,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            service_name,
            service_type,
        );
        res.status(200).json({
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'Seek',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }

});
// performance event
router.post('/event/performance', function(req, res, next) {
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;

    let performance = path_performance + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(performance)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(performance);
    }
    totalRequested++;
    if (req.headers['service_token'] !== undefined &&
        req.body.user_id !== undefined &&
        req.body.current_uri !== undefined &&
        req.body.ip_public !== undefined &&
        req.body.ip_private !== undefined &&

        req.body.data.pauseCount !== undefined &&
        req.body.data.seekCount !== undefined &&
        req.body.data.bufferCount !== undefined &&
        req.body.data.totalDuration !== undefined && 
        req.body.data.totalDuration !== 0 &&
        req.body.data.watchedDuration !== undefined &&
        req.body.data.bufferDuration !== undefined &&
        req.body.data.initialLoadTime !== undefined &&

        req.body.time !== undefined &&
        req.body.user_agent !== undefined &&

        req.body.media_id !== undefined &&
        req.body.media_name !== undefined && 
        req.body.media_category !== undefined &&
        req.body.media_like_count !== undefined &&
        req.body.media_viewed !== undefined &&
        req.body.media_duration !== undefined &&
        req.body.data.suspendCount !== undefined
    ) {
        functionUtils.writeAppendFileRestNormal(performance, 
            req.headers['service_token'],
            req.body.user_id,
            req.body.current_uri,
            req.body.ip_public,
            req.body.ip_private,

            req.body.data.pauseCount, 
            req.body.data.seekCount, 
            req.body.data.bufferCount, 
            req.body.data.totalDuration, 
            req.body.data.watchedDuration, 
            req.body.data.bufferDuration, 
            req.body.data.initialLoadTime,

            req.body.time,
            JSON.stringify(req.body.user_agent),

            req.body.media_id,
            JSON.stringify(req.body.media_name),
            req.body.media_category,
            req.body.media_like_count,
            req.body.media_viewed,
            req.body.media_duration,

            req.body.data.suspendCount,
            service_name,
            service_type,

        );
        res.status(200).json({
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        console.log('Request not allowed...');
        res.status(405).json({
            'event': 'Performance',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }
    
});
// quality change
router.post('/event/quality-change', function(req, res, next) {
    totalRequested++;
    let services = functionUtils.serviceIdefine(req.headers['service_token'], 4);
    let service_name = services.service_name;
    let service_type = services.service_type;
    
    let quality = path_quality + functionUtils.dateNormalFormat(new Date()) + '.txt';
    if (functionUtils.checkFileExists(quality)) {
        console.log("File already exist");
    } else {
        console.log("File not created yet");
        functionUtils.createNewFile(quality);
    }
    if (req) {

        res.status(200).json({
            'status': "Successed",
            'data': req.body,
            'number_req': totalRequested,
        });
    } else {
        res.status(405).json({
            'event': 'Quality Change',
            'status': 'Failure',
            'error_code': 405,
            'message': 'Request not container full field...',
        });
    }
});


module.exports = router;