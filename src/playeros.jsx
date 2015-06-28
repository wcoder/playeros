(function () {
	'use strict';

	var ControlPanel = React.createClass({
		render: function () {
			return (
				<div>
					<button onClick={this.props.onPlay}>play</button>
					<button onClick={this.props.onPrev}>prev</button>
					<button onClick={this.props.onNext}>next</button>
				</div>
			);
		}
	});

	var PlaylistItem = React.createClass({

		propTypes: {
			name: React.PropTypes.string.isRequired,
			src: React.PropTypes.string.isRequired
		},

		render: function () {
			return (
				<p onClick={this.props.onSelect}>{this.props.name}</p>
			);
		}
	});

	var Playlist = React.createClass({

		render: function () {
			return (
				<ul>
					{this.props.playlist.map(function(item, i) {
						return (<PlaylistItem key={i} name={item.name} src={item.src} onSelect={this.props.onSelect} />);
					}, this)}
				</ul>
			);
		}
	});

	var Player = React.createClass({

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
				<div>
					<ControlPanel onPlay={this.handleOnPlay} onPrev={this.handlePrev} onNext={this.handleNext} />
					<Playlist onSelect={this.handleSelect} playlist={this.props.playlist} />
				</div>
			);
		}
	});

	window.Playeros = function (element, playlist) {

		React.render(<Player playlist={playlist} />, element);

	};

}());