	$(document).ready(function(){
		$('#nameInput').keypress(function (e) {
	        if (e.keyCode == 13) {
	          var name = $('#nameInput').val();
	          createGame(name);
	        }
	    });

	    // startRound();
	});


	function createPlayers() {
		var players = {};
		players["ray"] = {
			"status" : "inactive",
			"image": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t1.0-1/c1.0.148.148/p148x148/10153124_10152034868947124_4493190993143905922_n.jpg"};
		players["sasi"] = {
			"status" : "inactive",
			"image": "https://scontent-b-sjc.xx.fbcdn.net/hprofile-ash2/l/t1.0-1/c31.0.148.148/p148x148/10007032_10152266803177937_365546827_n.jpg"};
		players["tan"] = {
			"status" : "inactive",
			"image": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/t1.0-1/c41.30.372.372/s148x148/76725_1665291162374_4704204_n.jpg"};
		players["michel"] = {
			"status" : "inactive",
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

				} else if ( status == 'end' ) {
					console.log("Call Start Round");
					startRound();
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
		var guesses = {};
		guesses.push({'Ray': 'Ray'});
		var roundsRef = new Firebase('https://mah.firebaseio.com/rounds');

	}

	function submitAnswer(player, answer) {


	}

	