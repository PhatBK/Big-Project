/**
 * Created by hoangl on 10/25/2017.
 */
(function () {
  /* jshint eqnull: true*/
  /* global require */
  'use strict';
  var videojs = null;

  if (typeof window.videojs === 'undefined' && typeof require === 'function') {
    videojs = require('video.js');
  } else {
    videojs = window.videojs;
  }

  (function (window, videojs) {
    'use strict';

    var defaults = {};

    /**
     * Return MenuButton's MenuItems.
     *
     * @method MenuButton.getItems
     * @return MenuItem[]
     */
    var MenuButton = videojs.getComponent('MenuButton');

    /**
     * Set current level.
     * This provides interface to either Player tech.
     *
     * @method setLevel
     * @param  {Number} level
     * @return Levels[]
     */
    videojs.getComponent('Player').prototype.setLevel = function (level) {
      var current_list = player.hls.playlists.master.playlists;
      player.hls.representations().forEach(function (rep) {
        if (rep.bandwidth === level) {
          // player.handleTechWaiting_();
          current_list.forEach(function (list, index) {
            if (list.attributes.BANDWIDTH === level) {
              // console.log(player.hls.playlists.master.playlists[index]);
              player.hls.playlists.media(player.hls.playlists.master.playlists[index]);
            }
          });
          rep.enabled(true);
          // player.hls.bandwidth = level;
        } else {
          rep.enabled(false);
        }
      });
      player.handleTechPlaying_();
      // this.getTech().setLevel(level);
    };

    var MenuItem = videojs.getComponent('MenuItem');

    videojs.MenuItemTest = videojs.extend(MenuItem, {

      constructor: function (player, options, onClickListener) {
        this.onClickListener = onClickListener;

        // Call the parent constructor
        MenuItem.call(this, player, options);
        this.on('click', this.onClick);
        this.on('touchstart', this.onClick);

      },
      onClick: function () {
        this.onClickListener(this);
        var selected = this.options_.el.value;
        console.log(this.options_.el.value);
        player.setLevel(selected);
        $('.vjs-menu-button-levels ')
      }
    });

    /**
     * LevelsMenuButton
     */
    videojs.levelsMenuButton = videojs.extend(MenuButton, {

      className: 'vjs-menu-button-levels ',

      init: function (player, options) {
        videojs.getComponent('MenuButton').call(this, player, options);
        this.controlText('Quality');
        var staticLabel = document.createElement('span');
        staticLabel.classList.add('vjs-levels-button-staticlabel');
        this.el().appendChild(staticLabel);
      },

      buildCSSClass: function buildCSSClass() {
        return 'vjs-menu-button-levels ' + videojs.getComponent('MenuButton').prototype.buildCSSClass.call(this);
      },

      buildWrapperCSSClass: function buildCSSClass() {
        return 'vjs-menu-button-levels ' + videojs.getComponent('MenuButton').prototype.buildWrapperCSSClass.call(this);
      },

      createItems: function () {
        var component = this;
        var player = component.player();
        var fetch_levels = player.qualityLevels();
        console.log(fetch_levels);
        var levels = fetch_levels.levels_;
        var item;
        var menuItems = [];

        if (!levels.length) {
          return [];
        }

        // Prepend levels with 'Auto' item
        levels = [{
          name: 'Auto',
          index: -1
        }].concat(levels);

        var onClickUnselectOthers = function (clickedItem) {
          menuItems.map(function (item) {
            if ($(item.el()).hasClass('vjs-selected')) {
              $(item.el()).removeClass('vjs-selected');
            }
          });
          $(clickedItem.el()).addClass('vjs-selected');
        };

        return levels.map(function (level, index) {
          // Select a label based on available information
          // name and height are optional in manifest
          var levelName;
          if (level.name) {
            levelName = level.name;
          } else if (level.height) {
            levelName = level.height + 'p';
          } else {
            //levelName = Math.round(level.bitrate / 1000) + ' Kbps';
            if (level.bitrate) {
              levelName = (Math.round(level.bitrate / 1024) + 'kb');
            } else {
              return null;
            }
          }

          item = new videojs.MenuItemTest(player, {
            el: videojs.getComponent('Component').prototype.createEl('li', this, {
              label: levelName,
              value: level.bitrate,
              class: 'vjs-menu-item'
              //tabIndex: 0,
            })
          }, onClickUnselectOthers);

          /**
           * Store MenuButton's MenuItems.
           * @return object
           */
          menuItems.push(item);
          if (level.name === 'Auto') {
            $(item.el()).addClass('vjs-selected');
          }
          $(item.el()).html(levelName);
          return item;
        });
      }

    });

    // register the plugin
    videojs.registerPlugin('levels', function (options) {

      var settings = videojs.mergeOptions(defaults, options);
      var player = this;
      var button = null;

      player.on('loadedmetadata', function (evt) {
        if (button) {
          button.dispose();
        }
        button = new videojs.levelsMenuButton(player, settings);
        button.el().classList.add('vjs-menu-button-levels');

        player.controlBar.addChild(button);
      });
    });

  })(window, videojs);

})();