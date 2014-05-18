	var globalPlaylist = null;
	$(document).ready(function(){

		$('#getAuthKey').click(function (e){
	    	BeatsService.getAccessToken();
	    });

		init();
		createGame('Sasi');
		joinGame('Tan');
		joinGame('Ray');
		joinGame('Michel');
		startRound();


		$(".choice").click(function(e) {
			console.log(e);
			answer = $(e.target).attr("id");
			answer = answer.split('-');
			answer = answer[1];
			console.log(answer);
			submitAnswer('Sasi', answer);  	
			$("#answer").text(answer);
			endRound();
			var winRef = new Firebase('https://mah.firebaseio.com/rounds/0/winners');
			winRef.once('value', function(snapshot) { 
				// if ( $.inArray(answer, snapshot.val()) ) {
					$('.image-playing').attr("src", "Tan.png");
				// }
			});
		});
	});


	function createPlayers() {
		var players = {};
		players["Ray"] = {
			"status" : "inactive",
			"score" : 0,
			"image": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t1.0-1/c1.0.148.148/p148x148/10153124_10152034868947124_4493190993143905922_n.jpg"};
		players["Sasi"] = {
			"status" : "inactive",
			"score" : 0,
			"image": "https://scontent-b-sjc.xx.fbcdn.net/hprofile-ash2/l/t1.0-1/c31.0.148.148/p148x148/10007032_10152266803177937_365546827_n.jpg"};
		players["Tan"] = {
			"status" : "inactive",
			"score" : 0,
			"image": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/t1.0-1/c41.30.372.372/s148x148/76725_1665291162374_4704204_n.jpg"};
		players["Michel"] = {
			"status" : "inactive",
			"score" : 0,
			"image": "https://scontent-a-sjc.xx.fbcdn.net/hphotos-frc3/t1.0-9/10372123_10152405557367937_7944549406127823943_n.jpg"};
		var playersRef = new Firebase('https://mah.firebaseio.com/players');
		playersRef.set(players);

	}

	function getPlayers() {
		var playersRef = new Firebase('https://mah.firebaseio.com/players');
		return playersRef;
	}


	function init() {
		var playingRef = new Firebase('https://mah.firebaseio.com/playing');
		playingRef.set(-1);
		var roundsRef = new Firebase('https://mah.firebaseio.com/rounds');
		roundsRef.remove();
		var playlistRef = new Firebase('https://mah.firebaseio.com/playlist');
		playlistRef.remove();
		var hostRef = new Firebase('https://mah.firebaseio.com/host');
		hostRef.remove();
		var statusRef = new Firebase('https://mah.firebaseio.com/status');
		statusRef.remove();

		createPlayers();

		playingRef.on('value', function(snapshot) { 
			var playing = snapshot.val();
			var statusRef = new Firebase('https://mah.firebaseio.com/status');
			statusRef.once('value', function(statusSnap) {
				var status = statusSnap.val();
				if ( status == 'ready' ) {
					console.log("Push default guesses to Round");
					submitDefaultAnswer(playing);

				} else if ( status == 'end' ) {
					console.log("Call Start Round");
					// startRound();
				} else if ( status == 'over' ) {
					console.log("Display final result");
				}
			});


		});
	}
	
	function createGame(creator) {
		var hostRef = new Firebase('https://mah.firebaseio.com/host');
		hostRef.set(creator);
		var statusRef = new Firebase('https://mah.firebaseio.com/status');
		statusRef.set('start');
		joinGame(creator);
		
	}

	function joinGame(name) {
		var pStatusRef = new Firebase('https://mah.firebaseio.com/players/'+name+'/status');
		pStatusRef.set('active');	

	}


	function startRound() {
		var statusRef = new Firebase('https://mah.firebaseio.com/status');
		statusRef.set('ready');
		var playingRef = new Firebase('https://mah.firebaseio.com/playing');
		playingRef.once('value', function(snapshot) { 
			var playing = snapshot.val();
			playing++;
			console.log("Playing " + playing);
			playingRef.set(playing);
			if ( playing == 2 ) {
				statusRef.set('over');	
			}
		});
	}

	function submitDefaultAnswer() {
		var guesses = [];
		guesses['Ray'] = 'Ray';
		guesses['Tan'] = 'Tan';
		guesses['Sasi'] = 'Sasi';
		guesses['Michel'] = 'Michel';

		var roundsRef = new Firebase('https://mah.firebaseio.com/rounds');
		var rounds = [];
		roundsRef.once('value', function(snapshot) {
			rounds = snapshot.val();
			if ( rounds === null ) {
				rounds = [];
			}

			var round = {};
			round = {'guesses': guesses};
			rounds.push(round);
			console.log("total rounds : " + rounds);
			roundsRef.set(rounds);

		});
		
	}

	function submitAnswer(player, answer) {
		var statusRef = new Firebase('https://mah.firebaseio.com/status');
		var playingRef = new Firebase('https://mah.firebaseio.com/playing');
		var scoreRef = new Firebase('https://mah.firebaseio.com/players/'+player+'/score');


		statusRef.once('value', function(sSnapshot) {
			var status = sSnapshot.val();
			if ( status == 'ready' ) {
				playingRef.once('value', function(pSnapshot) {
					var playing = pSnapshot.val();
					var roundsRef = new Firebase('https://mah.firebaseio.com/rounds/'+playing+'/guesses/'+player);
					var winRef = new Firebase('https://mah.firebaseio.com/rounds/'+playing+'/winners');
					roundsRef.set(answer) ;

					scoreRef.once('value', function(scoreSnapshot) {
						var score = scoreSnapshot.val();
						if ( getOwner() == answer ) {
							scoreRef.set(score++);
							winRef.once('value', function(wSnapshot) {
								var winners = winRef.val();
								if ( winners === null ) {
									winners = [];
								}
								winners.push(player);
								winRef.set(winners);
							});
						}
					});
					
				});
			}
		});
	}

	function getOwner() {
		var playingRef = new Firebase('https://mah.firebaseio.com/playing');
		playingRef.once('value', function(pSnapshot) {
			var playing = pSnapshot;
			var playlist = getPlaylist();
			var owner = playlist[playing]['owner'];
			console.log("Playlist Track " + owner);
			return owner; 
		});
	}



	function getPlaylist() {
		BeatsService.fetchAllPlaylist(function (data) { globalPlaylist = data; });
		globalPlaylist = BeatsService.shufflePlaylist(globalPlaylist);
	}

	function endRound() {
		var statusRef = new Firebase('https://mah.firebaseio.com/status');
		statusRef.set('end');
	}
	
	function getToken(callback) {
		oAuthCallback = callback;
		BeatsService.getAccessToken();
	}

	