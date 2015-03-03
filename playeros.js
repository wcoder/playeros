(function (w) {
    'use strict';

    var helper = {
        durationToStringConverter: function (v) {
            var s = parseInt(v % 60);
            var m = parseInt((v / 60) % 60);
            return m + '.' + s + 'min';
        },
        createElement: function (tagName, className, parentElement) {
            var e = document.createElement(tagName);
            e.className = className;
            if (typeof parentElement != 'undefined') {
                parentElement.appendChild(e);
            }
            return e;
        }
    };

    function ControlPanel(playCallback, prevCallback, nextCallback)
    {
        /* private */

        var self = this,
            panel = helper.createElement('div', 'playeros-panel'),
            play = helper.createElement('button', 'playeros-play', panel),
            prev = helper.createElement('button', 'playeros-prev', panel),
            next = helper.createElement('button', 'playeros-next', panel),
            progress = helper.createElement('div', 'playeros-progress', panel),
            progressProcess = helper.createElement('div', 'playeros-progress-process', progress),
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
        };
        this.changeComposition = function (value) {
            composition.innerText = value;
        };
        this.setCurrentTime = function (value) {
            currentTime.innerText = value;
        };
        this.setEndTime = function (value) {
            endTime.innerText = value;
        };
    }


    /**
     * Class for create custom HTML5 audio player
     * @author Evgeniy Pakalo <evgeniy.pakalo[g]gmail.com>
     * @param element
     * @param sources
     * @param options
     * @constructor
     */
    w.Playeros = function (element, sources, options) {

        var currentSourceIndex = 0,
            isPlayed = false,
            settings = {
                volume: 0.5
            },
            panel = new ControlPanel(play, prev, next),
            player = createPlayer();

        (function init() {
            _.extend(settings, options);

            changeCurrentSource();

            element.appendChild(panel.panel);
        }());


        function createPlayer() {
            var p = helper.createElement('audio');
            p.preload = 'metadata';
            p.type = 'audio/mpe';
            p.volume = settings.volume;
            p.onplaying = playerStart;
            p.ontimeupdate = playerProgress;
            p.onended = next;
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
            if (currentSourceIndex == 0) {
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

        function playCurrentSource() {
            changeCurrentSource();
            player.play();
            panel.play();
        }

        function changeCurrentSource() {
            var source = sources[currentSourceIndex];
            panel.changeComposition(source.name);
            player.src = source.file;
        }

        function playerProgress() {
            panel.progress((player.currentTime * 100) / player.duration);
            panel.setCurrentTime(helper.durationToStringConverter(player.currentTime));
        }

        function playerStart() {
            panel.setEndTime(helper.durationToStringConverter(player.duration));
        }
    };

}(window));