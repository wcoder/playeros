(function (w) {
    'use strict';

    /**
     * Class for create custom HTML5 audio player
     * @author Evgeniy Pakalo <evgeniy.pakalo[g]gmail.com>
     * @param element
     * @param sources
     * @constructor
     */
    w.Playeros = function (element, sources) {

        var currentSource = 0;
        var played = false;

        var play = element.querySelector('.playeros-play');
        var volume = element.querySelector('.playeros-range');
        var progress = element.querySelector('.playeros-progress');
        var currentTime = element.querySelector('.playeros-currenttime');
        var endTime = element.querySelector('.playeros-endtime');
        var composition = element.querySelector('.playeros-composition');
        var back = element.querySelector('.playeros-back');
        var next = element.querySelector('.playeros-next');
        var player = element.querySelector('.playeros-player');

        var playCurrentSource = function () {
            var source = sources[currentSource];
            composition.innerText = source.name;
            player.src = source.file;
            player.play();
        };

        var nextSource = function () {
            if (currentSource < sources.length - 1) {
                ++currentSource;
            } else {
                currentSource = 0;
            }
        };

        var durationToStringConverter = function (v) {
            var s = parseInt(v % 60);
            var m = parseInt((v / 60) % 60);
            return m + '.' + s + 'sec';
        };

        play.onclick = function () {
            if (!played) {
                playCurrentSource();
                play.innerText = '||';
            } else {
                player.pause();
                play.innerText = '>';
            }
            played = !played;
        };

        volume.onchange = function () {
            player.volume = parseFloat(volume.value / 10);
        };

        back.onclick = function () {
            if (currentSource == 0) {
                currentSource = sources.length - 1;
            } else {
                currentSource--;
            }
            playCurrentSource();
        };

        next.onclick = function () {
            nextSource();
            playCurrentSource();
        };

        player.onplaying = function () {
            player.volume = 0.5;
            endTime.innerText = durationToStringConverter(player.duration);
        };

        player.ontimeupdate = function () {
            progress.max = Math.floor(player.duration);
            progress.value = Math.floor(player.currentTime);
            currentTime.innerText = durationToStringConverter(player.currentTime);
        };

        player.onended = function () {
            nextSource();
            playCurrentSource();
        };
    };

}(window));