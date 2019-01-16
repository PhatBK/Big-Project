/**
 * videojs-smart-tracking
 * @version 0.6.1
 * @copyright 2018 Sergey Gromkov <sgromkov@gmail.com>
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
	typeof define === 'function' && define.amd ? define(['video.js'], factory) :
	(global.videojsSmartTracking = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

var version = "0.6.1";

/* eslint camelcase: ["error", {properties: "never"}] */

// Default options for the plugin.
var defaults = {
  params: {
    /**
     * @param {number} playeri
     *        Quality index.
     *        Defined each time.
     */
    playeri: null,
    /**
     * @param {string} player_version
     *        Player version.
     *        Get version from player.VERSION once when plugin load.
     */
    player_version: null,
    /**
     * @param {number} has_a_block
     *        Is adblock detected.
     *        Defined each time.
     */
    has_a_block: null,
    /**
     * @param {number} mid
     *        Serial number of the video being played during the session.
     *        Incremented when switching to another video within a session.
     */
    mid: 1,
    /**
     * @param {number} n
     *        Serial number of the log line within the session.
     *        Incremented before the postracking request is sent.
     */
    n: 0,
    /**
     * @param {number} curr_ts
     *        The current second of the video at the time of logging.
     *        Defined each time.
     */
    curr_ts: 0,
    /**
     * @param {string} edge
     *        Edge server's hostname.
     *        Defined each time.
     *        Example: "live-301.media-t.ru" from "https://live-301.media-t.ru/LIVE/.../chunklist.m3u8"
     */
    edge: null,
    /**
     * @param {number} birt
     *        Current bitrate.
     *        Defined each time.
     */
    birt: null,
    /**
     * @param {number} bw
     *        Current bandwidth.
     *        Defined each time.
     */
    bw: null
  },
  trackers: {
    player_show: false,
    video_start: false,
    err: false,
    reb_start: false,
    reb_end: false,
    seek: false,
    new_bitrate: false,
    pause: false,
    resume: false,
    play_ping: false,
    a_err: false,
    a_no: false,
    a_view_start: false,
    a_view_end: false,
    reb: false,
    pause_resume: false
  },
  videoUrl: null,
  serverUrl: null,
  site: null,
  version: 1
};

/**
 * Create XMLHttpRequest and send json data to server.
 *
 * @function sendXMLHttpRequest
 * @param {string} url
 *        Page url
 * @param {Object} data
 *        Event params
 */
var sendXMLHttpRequest = function sendXMLHttpRequest(url, data) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.withCredentials = true;
  xhr.send(JSON.stringify(data));
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Will return glue encode params.
 *
 * @function getStickedParams
 * @param {Object} commonParams
 *        Plugin common params from options.params
 * @param {Object} individualParams
 *        Event individual params
 * @param {string} actionName
 *        Event name
 * @return {Object}
 *          Glue encode params
 */
var getStickedParams = function getStickedParams(commonParams, individualParams) {
  var params = _extends({}, commonParams, individualParams);
  var data = {};

  for (var key in params) {
    if (params.hasOwnProperty(key) && params[key] !== null) {
      data[key] = encodeURIComponent(params[key]);
    }
  }

  return data;
};

/**
 * Will return hostname from URL.
 *
 * @function getHostName
 * @param {string} url
 *        Media url
 * @return {string}
 *          Hostname
 */
var getHostName = function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

  return match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0 ? match[2] : null;
};

/**
 * Will return correct server url for exact action.
 *
 * @function getHostName
 * @param {string} server
 *        Domain name
 * @param {string} site
 *        Site id
 * @param {string} action
 *        Action name
 * @param {string} version
 *        Log version
 * @return {string}
 *         Url
 */
var getUrl = function getUrl(server, site, action, version) {
  return server + '/' + site + '/' + action + '/v' + version;
};

/**
 * Tracks once when the video is played at least 3 second.
 *
 * @function videoStartTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var videoStartTracking = function videoStartTracking() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var interval = null;
  var startedTime = options.time && options.time > 0 ? options.time / 1000 : 0;

  /**
   * @param {number} initialTime
   *        A current time in miliseconds when player was started
   */
  var initialTime = 0;

  var setInitialTime = function setInitialTime() {
    initialTime = _this.player.currentTime();
  };

  var videoStarted = function videoStarted() {
    var currentTime = _this.player.currentTime();

    return currentTime >= initialTime + startedTime;
  };

  var videoStartEventChecker = function videoStartEventChecker() {
    interval = setInterval(function () {
      var player = _this.player;
      var additionalParams = {};
      var duration = null;

      if (videoStarted()) {
        clearInterval(interval);

        duration = player.duration();
        if (!isFinite(duration)) {
          duration = -2;
        }

        additionalParams.dur = duration;

        _this.postTrackingEvent('video_start', additionalParams);
      }
    }, 1000);
  };

  this.player.one('play', function () {
    setInitialTime();
    videoStartEventChecker();
  });
};

/**
 * Tracks once when the player is loaded.
 *
 * @function playerShowTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var playerShowTracking = function playerShowTracking() {
  var _this = this;

  this.player.one('loadstart', function () {
    _this.postTrackingEvent('player_show', { file: _this.options.videoUrl || null });
  });
};

/**
 * Tracks when the video is paused or resumed by user.
 *
 * @function pauseResumeTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var pauseResumeTracking = function pauseResumeTracking() {
  var _this = this;

  var player = this.player;
  var paused = false;
  var resumed = false;

  var onUserPlayPauseClick = function onUserPlayPauseClick() {
    if (player.paused()) {
      paused = true;
      resumed = false;
      _this.postTrackingEvent('pause');
    } else if (paused && !resumed) {
      paused = false;
      resumed = true;
      _this.postTrackingEvent('resume');
    }
  };

  player.controlBar.playToggle.on('click', onUserPlayPauseClick);

  player.tech_.el().addEventListener('click', onUserPlayPauseClick);

  // When user changed video quality:
  player.on('resolutionchange', onUserPlayPauseClick);
};

/**
 * Tracks when the video player is marked as buffering
 * and waits until the player has made some progress.
 *
 * @function bufferingTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var bufferingTracking = function bufferingTracking() {
  var _this = this;

  var timer = null;
  var scrubbing = false;
  var bufferPosition = false;
  var bufferStart = false;
  var bufferEnd = false;
  var resolutionChanged = false;

  var reset = function reset() {
    if (timer) {
      clearTimeout(timer);
    }
    scrubbing = false;
    bufferPosition = false;
    bufferStart = false;
    bufferEnd = false;
    resolutionChanged = false;
  };

  var onPause = function onPause() {
    bufferStart = false;

    if (_this.player.scrubbing()) {
      scrubbing = true;
      timer = setTimeout(function () {
        scrubbing = false;
      }, 200);
    }
  };

  var onResolutionChange = function onResolutionChange() {
    resolutionChanged = true;
  };

  var onPlayerWaiting = function onPlayerWaiting() {
    if (resolutionChanged === false && bufferStart === false && scrubbing === false && _this.player.currentTime() > 0) {
      bufferStart = new Date();
      bufferPosition = +_this.player.currentTime().toFixed(0);

      _this.postTrackingEvent('reb_start');
    }
  };

  var onTimeUpdate = function onTimeUpdate() {
    var curTime = +_this.player.currentTime().toFixed(0);

    if (bufferStart && curTime !== bufferPosition) {
      bufferEnd = new Date();

      var timeToLoad = bufferEnd - bufferStart;

      bufferStart = false;
      bufferPosition = false;

      _this.postTrackingEvent('reb_end', { dur2: timeToLoad });
    }
  };

  this.player.on('dispose', reset);
  this.player.on('loadstart', reset);
  this.player.on('ended', reset);
  this.player.on('pause', onPause);
  this.player.on('waiting', onPlayerWaiting);
  this.player.on('timeupdate', onTimeUpdate);
  this.player.on('resolutionchange', onResolutionChange);
};

/**
 * Tracks when the error event fired.
 *
 * @function errorTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var errorTracking = function errorTracking() {
  var _this = this;

  var player = this.player;

  player.on('error', function (event) {
    event.stopImmediatePropagation();

    var error = player.error();
    var params = {};

    if (error) {
      /* eslint camelcase: ["error", {properties: "never"}] */
      params = {
        err_type: 'player',
        err_code: error.code,
        err_msg: error.message
      };
    }

    _this.postTrackingEvent('err', params);
  });
};

/**
 * Tracks when the player change quality.
 *
 * @function newBitrateTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var newBitrateTracking = function newBitrateTracking() {
  var _this = this;

  this.player.one('resolutionchange', function () {
    _this.postTrackingEvent('new_bitrate');
  });
};

/**
 * Timer instance.
 * Contains time information to calculate the seconds viewed.
 */
var timer = {
  _started: 0,
  _total: 0,
  _sended: 0
};

Object.defineProperty(timer, 'started', {
  get: function get() {
    return this._started;
  },
  set: function set(value) {
    this._started = value;
  }
});

Object.defineProperty(timer, 'total', {
  get: function get() {
    return this._total;
  },
  set: function set(value) {
    var startedTime = this.started;
    var measuredTime = value - startedTime;

    if (measuredTime > 0) {
      this._total += measuredTime;
    }
  }
});

Object.defineProperty(timer, 'sended', {
  get: function get() {
    return this._sended;
  },
  set: function set(value) {
    this._sended = value;
  }
});

/**
 * Tracks every 30 seconds and save the time viewed by the user.
 *
 * @function playPingTracking
 * @param {Object} [options={}]
 *        A plain object containing options for the tracker
 */
var playPingTracking = function playPingTracking() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var interval = null;
  var intervalDuration = options.time && options.time > 0 ? options.time : 30000;

  var stopPlayPingTimer = function stopPlayPingTimer() {
    clearInterval(interval);
    interval = null;
  };

  var startPlayPingTimer = function startPlayPingTimer() {
    interval = setInterval(function () {
      var currentTime = Date.now();
      var sendedTime = timer.sended;
      var fullTime = 0;
      var resultTime = 0;
      var resultSeconds = 0;
      var differenceTime = 0;

      if (!_this.player.paused()) {
        timer.total = currentTime;
        timer.started = currentTime;
      }

      fullTime = timer.total;
      resultTime = fullTime - sendedTime;
      resultSeconds = Math.floor(resultTime / 1000);

      if (resultSeconds > 0) {
        differenceTime = resultTime % 1000;
        timer.sended = fullTime - differenceTime;
        _this.postTrackingEvent('play_ping', { secs: resultSeconds });
      }

      if (_this.player.ended()) {
        stopPlayPingTimer();
      }
    }, intervalDuration);
  };

  var onPLayerPlaying = function onPLayerPlaying(time) {
    timer.started = time;
    if (interval === null) {
      startPlayPingTimer();
    }
  };

  var onPlayerPause = function onPlayerPause(time) {
    timer.total = time;
  };

  this.player.on('playing', function () {
    onPLayerPlaying(Date.now());
  });

  this.player.on('pause', function () {
    onPlayerPause(Date.now());
  });

  this.player.on('resolutionchange', function () {
    onPlayerPause(Date.now());
  });

  this.player.on('ima', function (event, data) {
    var currentTime = Date.now();
    var google = window.google;

    if (data.type === 'overlay' || !google) {
      return;
    }

    switch (data.event) {
      case google.ima.AdEvent.Type.STARTED:
        if (data.type === 'preroll') {
          timer.started = currentTime;
        }
        onPlayerPause(currentTime);
        break;
      case google.ima.AdEvent.Type.COMPLETE:
        onPLayerPlaying(currentTime);
        break;
    }
  });
};

/* eslint camelcase: ["error", {properties: "never"}] */

var trackerHandler = function () {
  var trackers = {
    player_show: function player_show(options) {
      playerShowTracking.call(this, options);
    },
    video_start: function video_start(options) {
      videoStartTracking.call(this, options);
    },
    err: function err(options) {
      errorTracking.call(this, options);
    },
    reb: function reb(options) {
      bufferingTracking.call(this, options);
    },
    seek: function seek(options) {},
    new_bitrate: function new_bitrate(options) {
      newBitrateTracking.call(this, options);
    },
    pause_resume: function pause_resume(options) {
      pauseResumeTracking.call(this, options);
    },

    // reb_start(options) {
    //   bufferingTracking.call(this, options);
    // },
    // reb_end(options) {
    //   bufferingTracking.call(this, options);
    // },
    // pause(options) {
    //   pauseResumeTracking.call(this, options);
    // },
    // resume(options) {
    //   pauseResumeTracking.call(this, options);
    // },
    play_ping: function play_ping(options) {
      playPingTracking.call(this, options);
    },
    a_err: function a_err(options) {},
    a_no: function a_no(options) {},
    a_view_start: function a_view_start(options) {},
    a_view_end: function a_view_end(options) {}
  };

  return {
    facade: function facade(smartTracker) {
      var trackerList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      for (var key in trackerList) {
        if (trackerList.hasOwnProperty(key) && trackerList[key] !== false && trackers.hasOwnProperty(key)) {
          var options = _typeof(trackerList[key]) === 'object' ? trackerList[key] : {};

          trackers[key].call(smartTracker, options);
        }
      }
    }
  };
}();

/* eslint camelcase: ["error", {properties: "never"}] */

/**
 * Tracker instance.
*/
var smartTracker = {
  /**
   * @param {Player} player
   *        A Video.js player object
   */
  player: null,

  /**
   * @param {Object} [options={}]
   *        A plain object containing options for the plugin
   */
  options: null,

  /**
   * Will return the current version of the player if it exists.
   *
   * @function getPlayerVersion
   * @return {string}
   *          Player version
   */
  getPlayerVersion: function getPlayerVersion() {
    return this.player.hasOwnProperty('VERSION') ? this.player.VERSION : null;
  },


  /**
   * Set values of the params that should be initialized when loading the player.
   *
   * @function setInitialParams
   */
  setInitialParams: function setInitialParams() {
    var params = this.options.params;

    if (!params.hasOwnProperty('player_version') || params.player_version === null) {
      params.player_version = this.getPlayerVersion();
    }

    if (!params.hasOwnProperty('mid') || params.mid === null) {
      params.mid = 1;
    }
  },


  /**
   * Returns updated params with values of the params
   * that should be updated every tracking event.
   *
   * @function getUpdatedParams
   * @return {Object}
   *         params wich should be sends to server.
   * @todo make params definition
   *
   * {number} null
   * has_a_block: 0,
   *
   * Порядковый номер проигрываемого видео в рамках сессии (pid),
   * инкрементируется при переходе к другому видео в рамках сессии (pid)
   * {number} 1
   * mid: 1,
   */
  getUpdatedParams: function getUpdatedParams() {
    var player = this.player;
    var params = this.options.params;
    var currentTime = Math.floor(player.currentTime());
    var hostName = null;
    var videoBitrate = null;
    var measuredBitrate = null;
    var resolution = null;
    var quality = null;
    var playlist = null;
    var hls = null;

    if (player.tech_.hls) {
      hls = player.tech_.hls;
      if (hls.playlists && typeof hls.playlists.media === 'function') {
        playlist = hls.playlists.media();
        if (playlist) {
          if (playlist.uri) {
            hostName = getHostName(playlist.uri);
          }
          if (playlist.attributes && playlist.attributes.BANDWIDTH) {
            videoBitrate = Math.floor(playlist.attributes.BANDWIDTH / 1000);
          }
        }
      }
      if (hls.bandwidth) {
        measuredBitrate = Math.floor(hls.bandwidth / 1000);
      }
    }

    if (typeof player.currentResolution === 'function') {
      resolution = player.currentResolution();
      if (resolution && resolution.hasOwnProperty('sources') && resolution.sources.length > 0) {
        quality = resolution.sources[0].res;
      }
    }

    params.birt = videoBitrate;
    params.bw = measuredBitrate;
    params.edge = hostName;
    params.playeri = quality;
    params.curr_ts = currentTime;
    params.n++;

    return params;
  },


  /**
   * Will send tracking event data to server
   *
   * @function postTrackingEvent
   * @param    {string} actionName
   *           Event name
   * @param    {Object} individualParams
   *           Event individual params
   */
  postTrackingEvent: function postTrackingEvent(actionName) {
    var individualParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var server = this.options.serverUrl;
    var site = this.options.site;
    var version = this.options.version;
    var commonParams = this.getUpdatedParams();
    var url = getUrl(server, site, actionName, version);
    var data = getStickedParams(commonParams, individualParams);

    sendXMLHttpRequest(url, data);
  },


  /**
   * Will set event listeners
   *
   * Should be called when tracker is init
   *
   * @function startTracking
   */
  startTracking: function startTracking() {
    trackerHandler.facade(this, this.options.trackers);
  },


  /**
   * Should be called when player is ready
   *
   * @function init
   * @param    {Player} player
   *           A Video.js player object.
   * @param    {Object} [options={}]
   *           A plain object containing options for the plugin.
   */
  init: function init(player, options) {
    this.player = player;
    this.options = options;
    this.setInitialParams();
    this.startTracking();
  }
};

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
var onPlayerReady = function onPlayerReady(player, options) {
  videojs.log('smartTracking Plugin ENABLED!', options);

  player.addClass('vjs-videojs-smart-tracking');

  smartTracker.init(player, options);
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function smartTracking
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var smartTracking = function smartTracking(options) {
  onPlayerReady(this, videojs.mergeOptions(defaults, options));
};

// Register the plugin with video.js.
registerPlugin('smartTracking', smartTracking);

// Include the version number.
smartTracking.VERSION = version;

return smartTracking;

})));
