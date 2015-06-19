var Player = React.createClass({displayName: "Player",
	render() {
		return (
			React.createElement("div", null, 
				React.createElement(PlayerPanel, null), 
				React.createElement(PlayerPlaylist, null)
			)
		);
	}
});