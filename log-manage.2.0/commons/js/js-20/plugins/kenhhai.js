function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}
$(document).ready(function () {
    initPlayer();
    callBackEndVideo();
    eventClickResolution();
    autoPlayVideo();
    onPlayerReady();

});
function onPlayerReady() {
    $(".vjs-big-play-button").click();
}
var player = null;
var isPlaying = false;
var pauseTimes = 0;
var seekTimes = 0;
var waitTimes = 0;
var durationWatching = 0;
var durationBuffering = 0;
var beforeTime = 0;
var currentTime = 0;
function resizeend() {
    if (new Date() - rtimeResizeend < deltaResizeend) {
        setTimeout(resizeend, deltaResizeend);
    } else {
        //set width, height
        displayVideoResponsive()
    }
}
function displayVideoResponsive() {
    var winWidth = $(window).width();
    if (winWidth >= 360) {
        $('.youtube .vjs-time-divider').css('display', 'block');
        $('.youtube .vjs-duration').css('display', 'block');
    } else {
        $('.youtube .vjs-time-divider').css('display', 'none');
        $('.youtube .vjs-duration').css('display', 'none');
    }
}
function initPlayer() {
//-- START TRACE

    // var streamUrl = $('#url').val();
    var streamUrl = "videos/larva.mp4";
    var options = {
        html5: {
            nativeAudioTracks: false,
            nativeVideoTracks: false,
            hls: {
                enableLowInitialPlaylist: true,
                overrideNative: true
            }
        },
        flash: {
            hls: {
                enableLowInitialPlaylist: true
            }
        },
        inactivityTimeout: 0,
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
        controlBar: {
            playToggle: {},
            currentTimeDisplay: {},
            timeDivider: {},
            durationDisplay: {},
            remainingTimeDisplay: false,
            progressControl: {},
            volumePanel: {},
            subsCapsButton: false,
            subtitlesButton: false,
            playbackRateMenuButton: false,
            audioTrackButton: false,
            fullscreenToggle: {}
        }
    };
    player = videojs('videojs-event-tracking-player', options);
    player.src({
        src: streamUrl,
        type: 'application/x-mpegURL',
    });
    player.poster($('#poster').val());
    var qLevels = [];
    player.qualityLevels().on('addqualitylevel', function (event) {
        var quality = event.qualityLevel;
        if (quality.height !== undefined && $.inArray(quality.height, qLevels) === -1) {
            quality.enabled = true;
            qLevels.push(quality.height);
            if (!$('.quality_ul').length) {
                var h = '<div class="quality_setting vjs-menu-button vjs-menu-button-popup vjs-control vjs-button">' +
                        '<button class="vjs-menu-button vjs-menu-button-popup vjs-button" type="button" aria-live="polite" aria-disabled="false" title="Quality" aria-haspopup="true" aria-expanded="false">' +
                        '<span aria-hidden="true" class="vjs-icon-placeholder vjs-icon-cog"></span>' +
                        '<span class="vjs-control-text">Quality</span></button>' +
                        '<div class="vjs-menu"><ul class="quality_ul vjs-menu-content" role="menu"></ul></div></div>';
                $(".vjs-fullscreen-control").before(h);
            } else {
                $('.quality_ul').empty();
            }

            qLevels.sort(function (a, b) {
                return b - a
            });
            qLevels.reverse();
            var j = 0;
            $.each(qLevels, function (i, val) {
                $(".quality_ul").append('<li class="vjs-menu-item" tabindex="' + i + '" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="false" bitrate="' + val +
                        '"><span class="vjs-menu-item-text">' + val + 'p</span></li>');
                j = i;
            });
            $(".quality_ul").append('<li class="vjs-menu-item vjs-selected" tabindex="' + (j + 1) + '" role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="true" bitrate="auto">' +
                    '<span class="vjs-menu-item-text">Auto</span></li>');
        }
    });
    player.on('ready', function (event) {
        displayVideoResponsive();
    });
    // -- ADD EVENT TRACE
    player.on(['loadeddata'], function () {
        isPlaying = false;
    });
    player.on(['waiting'], function () {
        isPlaying = false;
        needSendTrace = true;
        waitTimes++;
        startBuffering = performance.now();
        console.log("Waitting|" + startBuffering);
    });
    player.on("seeking", function (e) {
        console.log("Seeking: " + player.currentTime());
        currentTime = player.currentTime();
        beforeTime = currentTime;
    });
    player.on("seeked", function (e) {
        needSendTrace = true;
        seekTimes++;
        currentTime = player.currentTime();
        beforeTime = currentTime;
        //calc buffer time
        stopBuffer = performance.now();
        if (startBuffering > 0) {
            durationBuffering += stopBuffer - startBuffering;
        }
        //reset buffer
        startBuffering = 0;
    });
    player.on('timeupdate', function () {
        needSendTrace = true;
        //console.log( player.currentTime() );
        if (isPlaying) {
            beforeTime = currentTime;
            currentTime = player.currentTime();
            if ((currentTime > beforeTime && (currentTime - beforeTime < 5))) {
                durationWatching += (currentTime - beforeTime);
            }
        }
        //console.log("Duration Watching = "+ durationWatching);
    });
    player.on(['pause'], function () {
        isPlaying = false;
        needSendTrace = true;
        currentTime = player.currentTime();
        beforeTime = currentTime;
        pauseTimes++;
        console.log("Pause");
        //calc buffer time
        stopBuffer = performance.now();
        if (startBuffering > 0) {
            durationBuffering += stopBuffer - startBuffering;
        }
        //reset buffer
        startBuffering = 0;
    });
    player.on('playing', function () {
        isPlaying = true;
        needSendTrace = true;
        console.log("Playing");
        //calc buffer time
        stopBuffer = performance.now();
        if (startBuffering > 0) {
            durationBuffering += stopBuffer - startBuffering;
        }
        //reset buffer
        startBuffering = 0;
        //console.log("Duration Buffering="+durationBuffering);
    });
    player.on('ended', function () {
        isPlaying = false;
        needSendTrace = true;
        console.log("Ended");
    });
    player.ready(function () {
        this.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
    });
}
function callBackEndVideo() {
    if (player && $('#next-video').val()) {
        player.on('ended', function () {
            var name = '<p class="name-video">' + $('#next-name-video').val() + '</p>';
            $('.over-next-video').append(name);
            $('.auto-next-play').show();
            var count = 5;
            var x = setInterval(function () {
                count = count - 1;
                if (count == 0) {
                    clearInterval(x);
                    var stopNext = $('#stop-next-video').val();
                    if (stopNext == 0) {
                        window.location.href = $('#next-video').val();
                    }
                }
            }, 1000);
        });
    }
}
function stopNextVideo() {
    $('.auto-next-play').hide();
    $('#stop-next-video').val('1');
}
function nextVideo() {
    window.location.href = $('#next-video').val();
}
function eventClickResolution() {

    $("body").on("click", ".quality_ul li", function () {
        $(".quality_ul li").removeClass("vjs-selected");
        $(".quality_ul li").prop("aria-checked", "false");
        $(this).addClass("vjs-selected");
        $(this).prop("aria-checked", "true");
        var val = $(this).attr("bitrate");
        var qualityLevels = player.qualityLevels();
        for (var i = 0; i < qualityLevels.length; i++) {
            qualityLevels[i].enabled = (val == "auto" || (val != "auto" && qualityLevels[i].height == val));
        }
        $('.quality_setting .vjs-menu-button-popup').attr('aria-expanded', 'false');
        $('.quality_setting .vjs-menu').removeClass('vjs-lock-showing');
    });
    $("body").on("click", ".quality_setting .vjs-menu-button-popup", function () {
        var isShowed = $(this).attr('aria-expanded');
        if (typeof isShowed !== typeof undefined && isShowed !== false) {
            isShowed = !(isShowed.toUpperCase() === 'TRUE');
            $(this).attr('aria-expanded', isShowed);
            if (isShowed) {
                $('.quality_setting .vjs-menu').addClass('vjs-lock-showing');
            } else {
                $('.quality_setting .vjs-menu').removeClass('vjs-lock-showing');
            }
        }
    });
}
function autoPlayVideo() {

    var isAutoPlay = getCookie("isAutoPlay");
    if (isAutoPlay == "") {
        setCookie("isAutoPlay", 1, 7);
        isAutoPlay = 1;
    }
    if (isAutoPlay == 1) {
        $(".switch svg:first-child").addClass("active");
        $(".switch svg:last-child").removeClass("active");
        $("#autoPlay").val(1);
    } else {
        $(".switch svg:first-child").removeClass("active");
        $(".switch svg:last-child").addClass("active");
        $("#autoPlay").val(0);
    }

    $('.switch').click(function (e) {

        if ($('#autoPlay').val() == 1) {
            $('#autoPlay').val(0);
            setCookie("isAutoPlay", 0, 7);
            isAutoPlay = 0;
        } else {
            $('#autoPlay').val(1);
            setCookie("isAutoPlay", 1, 7);
            isAutoPlay = 1;
        }

        if (isAutoPlay == 1) {
            $(".switch svg:first-child").addClass("active");
            $(".switch svg:last-child").removeClass("active");
        } else {
            $(".switch svg:first-child").removeClass("active");
            $(".switch svg:last-child").addClass("active");
        }
    });
}
 