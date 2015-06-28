(function () {
	'use strict';

	var ControlPanel = React.createClass({displayName: "ControlPanel",
		render: function () {
			return (
				React.createElement("div", null, 
					React.createElement("button", {onClick: this.props.onPlay}, "play"), 
					React.createElement("button", {onClick: this.props.onPrev}, "prev"), 
					React.createElement("button", {onClick: this.props.onNext}, "next")
				)
			);
		}
	});

	var PlaylistItem = React.createClass({displayName: "PlaylistItem",

		propTypes: {
			name: React.PropTypes.string.isRequired,
			src: React.PropTypes.string.isRequired
		},

		render: function () {
			return (
				React.createElement("p", {onClick: this.props.onSelect}, this.props.name)
			);
		}
	});

	var Playlist = React.createClass({displayName: "Playlist",

		render: function () {
			return (
				React.createElement("ul", null, 
					this.props.playlist.map(function(item, i) {
						return (React.createElement(PlaylistItem, {key: i, name: item.name, src: item.src, onSelect: this.props.onSelect}));
					}, this)
				)
			);
		}
	});

	var Player = React.createClass({displayName: "Player",

		getInitialState: function() {
			return {
				isPlayed: false
			};
		},

		handleOnPlay: function () {
			console.log('play');
		},

		handlePrev: function () {
			console.log('prev');
		},

		handleNext: function () {
			console.log('next');
		},

		handleSelect: function (value) {
			console.log(value);
		},

		render: function () {
			return (
				React.createElement("div", null, 
					React.createElement(ControlPanel, {onPlay: this.handleOnPlay, onPrev: this.handlePrev, onNext: this.handleNext}), 
					React.createElement(Playlist, {onSelect: this.handleSelect, playlist: this.props.playlist})
				)
			);
		}
	});

	window.Playeros = function (element, playlist) {

		React.render(React.createElement(Player, {playlist: playlist}), element);

	};

}());