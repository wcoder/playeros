(function (w, _) {
    'use strict';

    var helper = {
        durationToStringConverter: function (v) {
            var m = parseInt((v / 60) % 60);
            var s = parseInt(v % 60);
            return m + '.' + s;
        },
        createElement: function (tagName, className, parentElement) {
            var e = document.createElement(tagName);
            e.className = className;
            if (typeof parentElement !== 'undefined') {
                parentElement.appendChild(e);
            }
            return e;
        },
        createRangeElement: function (className, parentElement) {
            var e = this.createElement('input', className + ' playeros-spinner', parentElement);
            e.type = 'range';
            e.max = 100;
            e.min = 0;
            e.step = 0.01;
            e.value = 0;
            return e;
        }
    };

    w.Playeros = {
        panel: ControlPanel,
        playlist: Playlist,
        createAudioPlayer: createAudioPlayer
    };

    function ControlPanel(playCallback, prevCallback, nextCallback, rewindCallback)
    {
        /* private */

        var self = this,
            panel = helper.createElement('div', 'playeros-panel'),
            play = helper.createElement('button', 'playeros-play', panel),
            prev = helper.createElement('button', 'playeros-prev', panel),
            next = helper.createElement('button', 'playeros-next', panel),
            progress = helper.createElement('div', 'playeros-progress', panel),
            progressBuffer = helper.createElement('div', 'playeros-progress-buffer', progress),
            progressProcess = helper.createElement('div', 'playeros-progress-process', progress),
            progressRange = helper.createRangeElement('playeros-progress-spinner', progress),
            composition = helper.createElement('div', 'playeros-composition', panel),
            time = helper.createElement('div', 'playeros-time', panel),
            currentTime = helper.createElement('div', 'playeros-time-current', time),
            endTime = helper.createElement('div', 'playeros-time-end', time);

        play.addEventListener('click', function (e) {
            playCallback(self, e);
        });
        prev.addEventListener('click', function (e) {
            prevCallback(self, e);
        });
        next.addEventListener('click', function (e) {
            nextCallback(self, e);
        });
        progressRange.addEventListener('input', function (e) {
            rewindCallback(self, e.target.value);
        });

	    play.title = 'Play/Pause';
        time.style.visibility = 'hidden';

        /* public */

        this.panel = panel;

        this.play = function () {
            play.className = 'playeros-play playeros-play-pause';
        };
        this.pause = function () {
            play.className = 'playeros-play';
        };
        //this.stop = function () {
        //    play.className = 'playeros-play playeros-play-stop';
        //};
        this.progress = function (percent) {
            progressProcess.style.width = percent + '%';
            progressRange.value = percent;
        };
        this.buffer = function(percent) {
            progressBuffer.style.width = percent + '%';
        };
        this.changeComposition = function (value) {
            composition.innerText = value;
        };
        this.setCurrentTime = function (value) {
            currentTime.innerText = value;
        };
        this.setEndTime = function (value) {
            time.style.visibility = 'visible';
            endTime.innerText = value;
        };
    }

    function Playlist(sources, selectItemCallback) {

        /* private */

        var self = this,
            playlist = helper.createElement('ul', 'playeros-playlist');

        /* public */

        this.playlist = playlist;

        this.addItem = function (item) {
            var elem = helper.createElement('li', 'playeros-playlist-item', playlist);
            var index = playlist.children.length - 1;
            elem.addEventListener('click', function (e) {
                selectItemCallback(self, e);
            });
            elem.textContent = item.name;
            elem.attributes['data-index'] = index;
        };
        this.setList = function (list) {
            _(list).forEach(function(item) {
                self.addItem(item);
            });
        };
        this.markItemByIndex = function (index, err) {
            var classError = 'playeros-playlist-item-error',
                classItem = 'playeros-playlist-item',
                classItemError = 'playeros-playlist-item ' + classError,
                classCurrentItem = classItem + ' playeros-playlist-item-current',
                classCurrentItemError = classItem +' playeros-playlist-item-current ' + classError;

            _(playlist.children).forEach(function(item, itemIndex) {
                if (itemIndex === index) {
                    item.className = !!err ? classCurrentItemError : classCurrentItem;
                } else {
                    item.className = (item.className.indexOf(classError) > -1) ? classItemError : classItem;
                }
            });
        };

        this.setList(sources);
    }


    /**
     * Class for create custom HTML5 audio player
     * @author Evgeniy Pakalo <evgeniy.pakalo[g]gmail.com>
     * @param element
     * @param sources
     * @param options
     * @constructor
     */
    function createAudioPlayer(element, sources, options) {

        var currentSourceIndex = 0,
            isPlayed = false,
            settings = {
                volume: 0.5
            },
            panel = new w.Playeros.panel(play, prev, next, rewind),
            playlist = new w.Playeros.playlist(sources, selectItem),
            player = createPlayer();

        (function init() {
            _.extend(settings, options);

            changeCurrentSource();

            element.appendChild(panel.panel);
            element.appendChild(playlist.playlist);
            element.className = 'playeros';
        }());


        function createPlayer() {
            var p = helper.createElement('audio');
            p.preload = 'metadata';
            p.type = 'audio/mpe';
            p.volume = settings.volume;
            p.onplaying = playerStart;
            p.ontimeupdate = playerTimeUpdate;
            p.onprogress = playerProgress;
            p.onended = next;
            p.onerror = playerError;
            return p;
        }

        function play(panel) {
            if (isPlayed) {
                player.pause();
                panel.pause();
            } else {
                player.play();
                panel.play();
            }
            isPlayed = !isPlayed;
        }

        function prev() {
            if (currentSourceIndex === 0) {
                currentSourceIndex = sources.length - 1;
            } else {
                currentSourceIndex--;
            }
            playCurrentSource();
        }

        function next() {
            if (currentSourceIndex < sources.length - 1) {
                ++currentSourceIndex;
            } else {
                currentSourceIndex = 0;
            }
            playCurrentSource();
        }

        function rewind(panel, value) {
            if (player.duration) {
                player.currentTime = (value * player.duration) / 100;
            } else {
				value = 0;
            }
	        panel.progress(value);
        }

        function selectItem(o, e) {
            currentSourceIndex = e.target.attributes['data-index'];
            isPlayed = true;
            playCurrentSource();
        }

        function playCurrentSource() {
            changeCurrentSource();

            if (isPlayed) {
                player.play();
                panel.play();
            }
        }

        function changeCurrentSource() {
            var source = sources[currentSourceIndex];
            panel.changeComposition(source.name);
            playlist.markItemByIndex(currentSourceIndex, false);
            panel.progress(0);
	        panel.buffer(0);
            player.src = source.file;    
        }

        function playerTimeUpdate() {
            if (player.duration > 0) {
                panel.progress((player.currentTime / player.duration) * 100);
                panel.setCurrentTime(helper.durationToStringConverter(player.currentTime));
            }
        }

        function playerProgress() {
            if (player.duration > 0) {
                panel.buffer((player.buffered.end(player.buffered.length - 1) / player.duration) * 100);
            }
        }

        function playerStart() {
            panel.setEndTime(helper.durationToStringConverter(player.duration));
        }

        function playerError(e) {
            playlist.markItemByIndex(currentSourceIndex, e);
            player.pause();
            panel.pause();
        }
    }

}(window, window._));