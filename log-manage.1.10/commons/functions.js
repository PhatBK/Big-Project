const fs = require('fs');
const util = require('util');
var IdefineService = require('./idefine_service');

// write data to file, type: append + Ansysc
const writeAppendFileAnsysc = (file, data) => {
    fs.appendFile(file, data, (err) => {
        if (err) throw err;
        console.log('The data appended file:'+file);
    });
};

const writeAppendFileAnsyncPromise = (file, ...data) => {
    return new Promise((resolve, reject) => {
        data.reduce((data_write) => {
            fs.appendFile(file, data_write, (err) => {
                if (err) reject(err);
                resolve('The data appended file:'+file);
            });
        });
        fs.appendFile(file, '\r\n');
    });
};

const writeAppendFileReduce = (file, ...data) => {
    data.reduce((data_write) => {
        fs.appendFile(file, data_write + ' ', (err) => {
            if (err) throw err;
            console.log('The data appended file:'+file);
        });
    });
    fs.appendFile(file, '\r\n');
};

// write data to file, type: append + Sync
const writeAppendFileArray = (file, labels, ...data) => {
    let count = data.length;
    for(let i = 0; i < count; i++) {
        let data_write = labels[i] + '  ' + JSON.stringify(data[i]) + '  ';
        fs.appendFileSync(file, data_write, (err) => {
            if (err) throw err;
            console.log('The data appended file:'+file);
        });
    }
    fs.appendFileSync(file, '\r\n');
};

const writeAppendFileRestNormal = (file, ...data) => {
    let count = data.length;
    for(let i = 0; i < count; i++) {
        let data_write = data[i] + ' ';
        fs.appendFileSync(file, data_write, (err) => {
            if (err) throw err;
            console.log('The data appended file:'+file);
        });
    }
    fs.appendFileSync(file, '\r\n');
};

const writeAppendFileRest = (file, ...data) => {
    let count = data.length;
    for(let i = 0; i < count; i++) {
        let data_write = data[i] + ' ';
        if(i == count -1) {
            data_write = JSON.stringify(data[i]) + ' ';
        }
        fs.appendFileSync(file, data_write, (err) => {
            if (err) throw err;
            console.log('The data appended file:'+file);
        });
    }
    fs.appendFileSync(file, '\r\n');
};

const writeAppendFileRestError = (file, ...data) => {
    let count = data.length;
    for(let i = 0; i < count; i++) {
        let data_write = data[i] + ' ';
        if((i == count -1) || (i == count -2)) {
            data_write = JSON.stringify(data[i]) + ' ';
        }
        fs.appendFileSync(file, data_write, (err) => {
            if (err) throw err;
            console.log('The data appended file:'+file);
        });
    }
    fs.appendFileSync(file, '\r\n');
};

const writeAppendFileSync = (file, data) => {
    let data_write = JSON.stringify(data);
    fs.appendFileSync(file, data_write);
    fs.appendFileSync(file, '\r\n');
};
// Write data to file, type: append + async
const writeFilePromise = (path, data, options = 'utf8') => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, error => {
            if (error) reject(error);
            resolve('File was saved Promise...');
        });
    });
};

const timeNormalFormat = (time) => {
    let normal = time.getFullYear() + "-" 
                + (time.getMonth()+1) + "-" 
                + time.getDate() + "T" 
                + time.getHours() + ":"
                + time.getMinutes() + ":"
                + time.getSeconds() + "Z";
    return normal;
};

const dateNormalFormat = (time) => {
    let normal = time.getFullYear() + "-" 
                + (time.getMonth()+1) + "-" 
                + time.getDate();
    return normal;
};

const compareTime = (date_client, date_server) => {
    let result = false;
    if (
        (date_client.getFullYear === date_server.getFullYear) &&
        (date_client.getMonth === date_server.getMonth) &&
        (date_client.getDate === date_server.getDate)
    ) {
        result = true;
    } else {
        result = false;
    }
    return result;
};

const createNewFile = (name) => {
    fs.open(name, 'wx', (err, fd) => {
        if (err) {
          if (err.code === 'EEXIST') {
            //console.error('File already exists');
            return;
          }
          throw err;
        } else {
            //console.log('Created file successfuly');
        }
    });
};

const checkFileExists = (path) => {
    let flag = null;
    try {
        if (fs.existsSync(path)) {
            flag = true;
        }
    } catch(err) {
        flag = false;
    }
    return flag;
};

const serviceIdefine = (client_token, offset) => {
    let length_c = client_token.length;
    let client_token_alias = client_token.substring(length_c - offset, length_c);
    
    let service_name = null;
    let service_type = null;
    let result = {};

    if (client_token_alias === IdefineService.kenh_hai_alias) {
        service_name = 'Kenh_Hai';
        if (client_token === IdefineService.KenhHai.web) {
            service_type = 'web';
        }
        if (client_token === IdefineService.KenhHai.wap) {
            service_type = 'wap';
        }
        if (client_token === IdefineService.KenhHai.webos) {
            service_type = 'webos';
        }
        if (client_token === IdefineService.KenhHai.android_mobile) {
            service_type = 'android_mobile';
        }
        if (client_token === IdefineService.KenhHai.android_tv) {
            service_type = 'android_tv';
        }
        if ( client_token === IdefineService.KenhHai.ios) {
            service_type = 'ios';
        }
    }

    if (client_token_alias === IdefineService.my_clip_alias) {
        service_name = 'My_Clip';
        if (client_token === IdefineService.MyClip.web) {
            service_type = 'web';
        }
        if (client_token === IdefineService.MyClip.wap) {
            service_type = 'wap';
        }
        if (client_token === IdefineService.MyClip.webos) {
            service_type = 'webos';
        }
        if (client_token === IdefineService.MyClip.android_mobile) {
            service_type = 'android_mobile';
        }
        if (client_token === IdefineService.MyClip.android_tv) {
            service_type = 'android_tv';
        }
        if ( client_token === IdefineService.MyClip.ios) {
            service_type = 'ios';
        }
    }

    if (client_token_alias === IdefineService.video_hay_alias) {
        service_name = 'Video_Hay';
        if (client_token === IdefineService.VideoHay.web) {
            service_type = 'web';
        }
        if (client_token === IdefineService.VideoHay.wap) {
            service_type = 'wap';
        }
        if (client_token === IdefineService.VideoHay.webos) {
            service_type = 'webos';
        }
        if (client_token === IdefineService.VideoHay.android_mobile) {
            service_type = 'android_mobile';
        }
        if (client_token === IdefineService.VideoHay.android_tv) {
            service_type = 'android_tv';
        }
        if ( client_token === IdefineService.VideoHay.ios) {
            service_type = 'ios';
        }
    }

    if (client_token_alias === IdefineService.five_d_max_alias) {
        service_name = 'Five_D_Max';
        if (client_token === IdefineService.FiveDMax.web) {
            service_type = 'web';
        }
        if (client_token === IdefineService.FiveDMax.wap) {
            service_type = 'wap';
        }
        if (client_token === IdefineService.FiveDMax.webos) {
            service_type = 'webos';
        }
        if (client_token === IdefineService.FiveDMax.android_mobile) {
            service_type = 'android_mobile';
        }
        if (client_token === IdefineService.FiveDMax.android_tv) {
            service_type = 'android_tv';
        }
        if ( client_token === IdefineService.FiveDMax.ios) {
            service_type = 'ios';
        }
    }

    if (service_name !== null && service_type !== null) {
        result = {
            'service_name': service_name,
            'service_type': service_type,
        };
    }
    if (service_name === null || service_type === null) {
        result = {
            'service_name': 'undefined',
            'service_type': 'undefined',
        };
    }
    
    return result;
};
const connectionNormal = (min, max, bitrate) => {
    bitrate = Math.abs(bitrate);
    let connect_type = null;
    if (bitrate < 3) {
        connect_type = "2g";
    } else if (bitrate < 6) {
        connect_type = "3g";
    } else if (bitrate < 12) {
        connect_type = '4g';
    } else {
        connect_type = 'wifi';
    }
    // let connectList = ['2G', '3G', '4G'];
    // let number = Math.floor(Math.random() * (max - min)) + min;
    return connect_type;
};
const allDataLogs = {
    'mediaInfos': {
        'mediaID': null,
        'mediaName': null,
        'mediaURI': null,
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

    'errorCode': null,
    'errorMessage': null,
}


// Export module
module.exports.writeAppendFileArray = writeAppendFileArray;
module.exports.writeAppendFileSync = writeAppendFileSync;
module.exports.writeFilePromise = writeFilePromise;
module.exports.writeAppendFileRest = writeAppendFileRest;
module.exports.writeAppendFileRestError = writeAppendFileRestError;
module.exports.timeNormalFormat = timeNormalFormat;
module.exports.writeAppendFileRestNormal = writeAppendFileRestNormal;
module.exports.writeAppendFileAnsysc = writeAppendFileAnsysc;
module.exports.writeAppendFileAnsyncPromise = writeAppendFileAnsyncPromise;
module.exports.writeAppendFileReduce = writeAppendFileReduce;
module.exports.dateNormalFormat = dateNormalFormat;
module.exports.createNewFile = createNewFile;
module.exports.checkFileExists = checkFileExists;
module.exports.serviceIdefine = serviceIdefine;
module.exports.compareTime = compareTime;
module.exports.connectionNormal = connectionNormal;
module.exports.allDataLogs = allDataLogs;
