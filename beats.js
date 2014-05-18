var clientId = "43ffka3tjsw8au4qt9b2abm2"
	baseAPIUrl = "https://partner.api.beatsmusic.com/v1",
	playlists = [
		{ id: "pl181970440342732800", label: 'Driving', owner: 'Tan' },
		{ id: "pl181970515685015808", label: 'Running', owner: 'Ray'},
		{ id: "pl182109085187964928", label: 'Afternoon Stroll', owner: 'Michel'},
		{ id: 'pl182107962964180992', label: 'Dance', owner: 'Sasi'}

	],
	player = null,
	accessToken = null,
	previewPlaytime = 8,
	endRound = null,
	oAuthCallback = function () {

	};

BeatsService = {
	initPlayer : function () {
		player = new BeatsAudioManager("myBeatsPlayer");
		player.on("ready", this.handleReady);
		player.on("error", this.handleError);
		player.on("timeupdate", function () {
			if (player.paused) {
				return;
			}
    		if (player.currentTime < 60) {
    			player.currentTime = 60;
			}
			if (player.currentTime > 60 + previewPlaytime) {
				if (!player.paused) {
					player.pause();
					var start = new Date().getTime(),
						milliseconds = 500;
					for (var i = 0; i < 1e7; i++) {
					    if ((new Date().getTime() - start) > milliseconds){
					    	break;
					    }
					}
					if (endRound) {
						endRound();
					}
				}

			}
				
    	});
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
    playPreview : function (trackId) {
    	
    	player.identifier = trackId;
    	player.load();
    },
    loadSong : function (trackId) {
    	player.stop();
    	player.load(trackId, false);

    },
    loadAndPlay : function (trackId) {
    	player.stop();
    	player.load(trackId, true);

    },
    handleError : function () {},
    fetchAllPlaylist: function (callback) {
    	var ids = [], j = 0, i;
    	for (i = 0; i < playlists.length; i++) {
    		var playlist = playlists[i];
    		$.ajax({
    			url: baseAPIUrl + '/api/playlists/' + playlist.id + "?client_id=43ffka3tjsw8au4qt9b2abm2&access_token=" + accessToken,
				success: function (res) {
					
					if (res.data) {
						if (res.data.refs) {
							for (var k = 0; k < res.data.refs.tracks.length; k++) {
								var owner = '';
								for (var l = 0; l < playlists.length; l++) {
									if(playlists[l].id === res.data.id) {
										owner = playlists[l].owner;
									}
								}
								ids.push({ id: res.data.refs.tracks[k].id, title: res.data.refs.tracks[k].id, owner: owner } );
							}
						}
					}

					if (j === playlists.length - 1) {
						callback(ids);
					}
					j++;
				},
				error: function () { callback(null) },
				ajax: false
			});
    	}
    	
    },

    shufflePlaylist: function (array) {
    	var currentIndex = array.length
	    , temporaryValue
	    , randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
    },

	getPlaylist : function (playlistId, callback, playlistName) {
		$.ajax(baseAPIUrl + '/api/playlists/' + playlistId + "?client_id=43ffka3tjsw8au4qt9b2abm2&access_token=" + accessToken)
		.done(function (res) {
			var ids = [];
			if (res.data) {
				if (res.data.refs) {
					for (var i = 0; i < res.data.refs.tracks.length; i++) {
						ids.push({ id: res.data.refs.tracks[i].id, title: res.data.refs.tracks[i].id});
					}
				}
			}

			callback(ids, playlistName);
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
        oAuthCallback();
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