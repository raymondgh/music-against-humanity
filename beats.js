var clientId = "43ffka3tjsw8au4qt9b2abm2"
	baseAPIUrl = "https://partner.api.beatsmusic.com/v1",
	playlist = [
		"pl181970440342732800"
	],
	player = null,
	accessToken = null;

BeatsService = {

	initPlayer : function () {
		player = new BeatsAudioManager("myBeatsPlayer");
		player.on("ready", this.handleReady);
		player.on("error", this.handleError);
	},

	getPlayer : function () { return player; },

	handleReady : function(value) {
        player.clientId = "43ffka3tjsw8au4qt9b2abm2";
        //bam.authentication = {access_token:"3cxsbaubpvtx57b2vkmrzkku", user_id:"musicagainsthumanity"};
        //player.identifier = "tr26746665";
        
        player.authentication = {access_token : accessToken, user_id : 'musicagainsthumanity'};
        //player.load();
        
    },
    playSongFromStart : function () {
    	player.load();
    },
    loadSong : function (trackId) {
    	player.stop();
    	player.identifier = trackId;
    },
    loadAndPlay : function (trackId) {
    	this.loadSong(trackId);
    	player.load();
    },
    handleError : function () {},
	getPlaylist : function (playlistId, callback, user) {
		$.ajax(baseAPIUrl + '/api/playlists/' + playlistId + "?client_id=43ffka3tjsw8au4qt9b2abm2&access_token=" + accessToken)
		.done(function (res) {
			var ids = [];
			if (res.data) {
				if (res.data.refs) {
					for (var i = 0; i < res.data.refs.tracks.length; i++) {
						ids.push(res.data.refs.tracks[i].id);
					}
				}
			}

			callback(ids, user);
		})
		.fail(function () { callback(null) });
	},
	getTrackInfo : function (trackId, callback) {
		$.ajax(baseAPIUrl + '/api/tracks/' + trackId + "?client_id=" + clientId)
		.done(function (res) {
			if (res.data) {
				callback(res.data);
			} else {
				callback(res.data);
			}

		})
		.fail(function () { callback(null) });
	},
	getAccessToken : function () {
		authWindow = window.open("https://partner.api.beatsmusic.com/oauth2/authorize?"+
                    "client_id=43ffka3tjsw8au4qt9b2abm2&scope=umMa&"+
                    "response_type=token&"+
                    "redirect_uri=http://127.0.0.1/oauthCallback.html",
                    "authpop",'height=400,width=600'
            );
        if (window.focus) {authWindow.focus()}
        return false;
	},
	setOAuth2AccessToken : function (token) {
		console.log(token);
		this.initPlayer();
		accessToken = token;
        
	},
	sendImplicitAccessToken : function (params, errorCallback, successCallback) {
	    if(params.access_token){
	        successCallback();
	    } else {
	        errorCallback();
	    }
	}
};
/*
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getCookie(name) {
 	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
*/
$(document).on('ready', function() {

	
});