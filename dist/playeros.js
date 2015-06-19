var Player = React.createClass({displayName: "Player",
	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement(PlayerControlPanel, null), 
				React.createElement(PlayerPlaylist, null)
			)
		);
	}
});
var PlayerControlPanel = React.createElement({

	render: function () {
		return (
			React.createElement("div", null
			)
		);
	}

});
var PlayerPlaylist = React.createElement({
	render: function() {
		return (React.createElement(PlayerPaylistItem, null));
	}
});
var PlayerPlaylistItem = React.createClass({displayName: "PlayerPlaylistItem",
	render: function () {
		return (React.createElement("p", null));
	}
})