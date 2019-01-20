// khởi tạo một đối tượng player
// let player = videojs('videojs-event-tracking-player');

// sét thời gian tự động gửi dữ liệu
let TIMEOUT = 10000;

// idefine token of service
let service_code = {
    //'token': '8b82c96c6de5739a6a1979b634711087bfb1d3290001',
    'token': null,
};
// service name
const serviceApp = {
    'name': 'KenhHai',
    'type': 'web',
};
// host of server recivce data log
const logging_host = {
    //'host': 'http://192.168.1.17:9001/web/all/event/log-datas',
    'host': 'http://192.168.146.77:9001/web/all/event/log-datas',
    'getToken': 'http://192.168.146.77:9001/api/util-service/call-service/help-me/token/web',
};
// all event of media element in html5
const event_labels = {
    'abort': 'abort',
    'emptied': 'emptied',
    'ended': 'ended',
    'error': 'error',
    'interruptbegin': 'interruptbegin',
    'interruptend': 'interruptend',
    'loadeddata': 'loadeddata',
    'loadedmetadata': 'loadedmetadata',
    'loadstart': 'loadstart',
    'load': 'load',
    'loadend': 'loadend',
    'mozaudioavailable': 'mozaudioavailable',
    'pause': 'pause',
    'play': 'play',
    'playing': 'playing',
    'progress': 'progress',
    'ratechange': 'ratechange',
    'seeked': 'seeked',
    'seeking': 'seeking',
    'suspend': 'suspend',
    'timeupdate': 'timeupdate',
    'volumechange': 'volumechange',
    'waiting': 'waiting',
};
// resolution
const resolutions = {
    'CD': [
        [352, 240],
        [352, 288],
    ],
    'SD480': [
        [352, 480],
        [528, 480],
        [544, 480],
        [640, 480],
        [704, 480],
        [720, 480],
    ],
    'SD576': [
        [480, 576],
        [544, 576],
        [704, 576],
        [720, 576],
    ],
    'DVD': [
        [720, 480],
        [720, 576],
    ],
    'HD': [
        [1280, 720],
        [1366, 768 ],
    ],
    'FHD': [
        [1440, 1080],
        [1920, 1080],
    ],
    '4K': [
        [3840, 2160],
    ],
    '8K': [
        [7680, 4320],
    ],
    '16K': [
        [15360, 8640],
    ],
};

// all media information of service
const media_infos = {
    'current_uri': window.location.pathname,
    'media_id': 0,
    'media_category': null,
    'media_name': null,
    'media_like_count': 0,
    'media_viewed': null,
    'media_duration': 0,
};

const dataLogs = {
    'mediaInfos': {
        'mediaID': null,
        'mediaName': null,
        'mediaCategory': null,
        'mediaDuration': 0,
    },
    'userID': null,
    'ipPublic': null,
    'ipPrivate': null,
    'userAgent': null,
    'time': null,
    'bitrateNetwork': 0,
    'connectType': null,

    'seekCount': 0,
    'pauseCount': 0,
    'bufferCount': 0,
    'suspendCount': 0,

    'initialLoadTime': 0,
    'watchedDuration': 0,
    'bufferDuration': 0,
    'currentTime': 0,
    'watchingTime': 0,

    'errorCode': -1,
    'errorMessage': null,
    'status': null,
    'event': null,
    'bufferInfinite': false,
};

let host = logging_host.host;
let UserID = null;
const user_agent = navigator.userAgent;

let timer = null;
let countASC = 0;
let performanceFlag = false;
let endedFlag = false;
let backupObject = null;


window.onload = function(event) {
    if (service_code.token === null) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            }
        });
        $.ajax({
            url: logging_host.getToken,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                'request': 'token',
                'type': serviceApp.type,
                'service': serviceApp.name,
            }),
            dataType: "json",
            cache: false, 
            success : function(response) {
                service_code.token = response.token;
                console.log('service token reciveced...');
            },
            error : function(error) {
                console.log(error);
            }
        });
    } else {
        console.log('Service Token Already...');
    }
};

const resetDataLogs = () => {
  
    dataLogs.seekCount = 0;
    dataLogs.pauseCount = 0;
    dataLogs.bufferCount = 0;
    dataLogs.suspendCount = 0;
    dataLogs.initialLoadTime = 0;
    dataLogs.watchedDuration = 0;
    dataLogs.bufferDuration = 0;
    dataLogs.currentTime = 0;
    dataLogs.watchingTime = 0;
};

const TimeNormalFormat = (time) => {
    let normal = time.getFullYear() + "-" 
                + (time.getMonth() + 1) + "-" 
                + time.getDate() + "T" 
                + time.getHours() + ":"
                + time.getMinutes() + ":"
                + time.getSeconds() + "Z";
    return normal;
};

const findCookie = (cname) => {
    var result = null;
    var allCookie = document.cookie.split(';');
    for (var i = 0; i < allCookie.length; i++) {
        if(allCookie[i].split('=')[0] === cname) {
            result = allCookie[i].split('=')[1];
        }
    }
    return result;
};

function checkUserID() {
    if (findCookie('user_id') === null) {
        var user_name = 'KenhHai' + Math.floor((Math.random() * 1000000) + 1);
        UserID = "8866phatnh" + Math.floor(Math.random() * 1000000) + 1 +"kenh_hai_web",
        document.cookie = "user_id= " + UserID + "; expires=Thu, 18 Dec 2020 12:00:00 UTC";
        document.cookie = "username=" + user_name + "; expires=Thu, 18 Dec 2020 12:00:00 UTC";
    } else {
        UserID = findCookie('user_id');
    }
};
// check cookie của user xem đã tồn tại hay chưa
checkUserID();
// new function send data log for nodejs server
function newAjaxSendDataNodejs(url, data) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'service_token': service_code.token,
        }
    });
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        cache: false, 
        success : function(response) {
            TIMEOUT = response.TIMEOUT;
            console.log(TIMEOUT);
            console.log(response);
        },
        error : function(error) {
            console.log(error);
        }
    });
};

// get total duration of media element
player.on('loadedmetadata', function() {
    media_infos.media_duration = player.duration().toFixed(0);
    dataLogs.mediaInfos.mediaDuration = parseInt(player.duration().toFixed(0));
    dataLogs.mediaInfos.mediaID = '12345';
    dataLogs.mediaInfos.mediaName = 'Laravel';
    dataLogs.mediaInfos.mediaCategory = 'Hoat Hinh';
});
// add plugin tracking event 
player.eventTracking({
    performance: function(data) {
        dataLogs.pauseCount = data.pauseCount;
        dataLogs.seekCount = data.seekCount;
        dataLogs.bufferCount = data.bufferCount;
        dataLogs.suspendCount = data.suspendCount;
        dataLogs.initialLoadTime = data.initialLoadTime;
        dataLogs.bufferDuration = data.bufferDuration;
        dataLogs.watchedDuration = data.watchedDuration;

        performanceFlag = true;
        dataLogs.status = 'success';
        dataLogs.event = 'performance';
    }
});

player.on('tracking:resolution', function(e, data) {
    dataLogs.bitrateNetwork = data.bitrateNetwork;
    dataLogs.connectType = data.connectionType;
});

player.on('tracking:error', function(e, data) {
    dataLogs.errorCode = data.errorCode;
    dataLogs.errorMessage = data.errorMessage;
    dataLogs.status = 'success';
    dataLogs.event = 'error';
    let url = logging_host.host;
    newAjaxSendDataNodejs(url, dataLogs);
    clearInterval(timer);
    resetDataLogs();
    console.log('Player error...');
});

player.on('tracking:firstplay', function(e, data) {
    if (findCookie('user_id') === null) {
        var user_name = 'KenhHai' + Math.floor((Math.random() * 1000000) + 1);
        UserID = "8866phatnh" + Math.floor(Math.random() * 1000000) + 1 + "kenh_hai_web";
        document.cookie = "user_id= " + UserID + "; expires=Thu, 18 Dec 2020 12:00:00 UTC";
        document.cookie = "username=" + user_name + "; expires=Thu, 18 Dec 2020 12:00:00 UTC";
    } else {
        UserID = findCookie('user_id');
    }
    dataLogs.userID = UserID;
    dataLogs.initialLoadTime = data.secondsToLoad;
    dataLogs.ipPrivate = ip_private;
    dataLogs.ipPublic = ip_public;
    dataLogs.userAgent = user_agent;
});

player.on('tracking:seek', function(e, data) {
    dataLogs.seekCount = data.seekCount;
    dataLogs.watchingTime = parseFloat(data.watchedTime);
    dataLogs.watchedDuration = parseFloat(data.watchedTime);
});

player.on('tracking:performance', function(e, data) {
   dataLogs.pauseCount = data.pauseCount;
   dataLogs.seekCount = data.seekCount;
   dataLogs.bufferCount = data.bufferCount;
   dataLogs.suspendCount = data.suspendCount;
   dataLogs.initialLoadTime = data.initialLoadTime;
   dataLogs.bufferDuration = data.bufferDuration.toFixed(3);
   dataLogs.watchedDuration = data.watchedDuration;
   performanceFlag = true;
   dataLogs.status = 'success';
   dataLogs.event = 'performance';
});

player.on('tracking:buffered', function(e, data) {
    dataLogs.currentTime = data.currentTime;
    dataLogs.bufferDuration += (+data.secondsToLoad.toFixed(3));
    dataLogs.bufferCount = data.bufferCount;
    dataLogs.watchingTime = parseFloat(data.watchedTime);
    dataLogs.watchedDuration = parseFloat(data.watchedTime);
    dataLogs.event = 'buffered';
});

player.on('tracking:suspend', function(e, data) {
    dataLogs.suspendCount = data.suspendCount;
    dataLogs.event = 'suspend';
});

player.on('tracking:pause', function(e, data) {
   dataLogs.pauseCount = data.pauseCount;
   dataLogs.watchingTime = parseFloat(data.watchedTime);
   dataLogs.watchedDuration = parseFloat(data.watchedTime);
});
// play video
player.on('play', function() {
    timer = window.setInterval(function() {
        player.on('tracking:watched-time', function(e, data) {
            dataLogs.watchingTime = parseFloat(data.watchedTime);
            dataLogs.watchedDuration = parseFloat(data.watchedTime);
        });
        
        dataLogs.time = TimeNormalFormat(new Date());
        let url = logging_host.host;
        newAjaxSendDataNodejs(url, dataLogs);
        countASC++;
    }, TIMEOUT);
    console.log('Set Timer Object when player play...');
});

player.on('pause', function() {
    clearInterval(timer);
    console.log("Clear Timer Object when player Pause...");
});

player.on('ended', function() {
    if (performanceFlag) {
        let url = logging_host.host;
        dataLogs.status = 'success';
        dataLogs.event = 'ended';
        newAjaxSendDataNodejs(url, dataLogs);
        clearInterval(timer);
        resetDataLogs();
        console.log('Destroy Send Data...');
    }
    endedFlag = true;
});

player.on('dispose', function() {
    dataLogs.status = 'success';
    dataLogs.event = 'dispose';
    clearInterval(timer);
    resetDataLogs();

});

player.on('stalled ', function(data) {
    let url = logging_host.host;
    dataLogs.status = 'idle';
    dataLogs.event = 'stalled';
    newAjaxSendDataNodejs(url, dataLogs);
    clearInterval(timer);
    resetDataLogs();
});

// lưu dữ liệu xuống local stogre của người dùng
const backupDataFunction = (source, callback) => {
    callback = Object.assign({}, source);
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("beforeData", JSON.stringify(callback));
        console.log('Saved data to local storge html5');
    } else {
        console.log('Not saved data');
    }
    return callback;
};
var finalSendData = function finalSendData(event) {

    let url = logging_host.host;
    dataLogs.status = 'success';
    dataLogs.event = event;
    newAjaxSendDataNodejs(url, dataLogs);
    clearInterval(timer);
    resetDataLogs();
};
window.onbeforeunload = function(evt) {
    if (!endedFlag) {
        finalSendData('beforeunload');
    }
};
