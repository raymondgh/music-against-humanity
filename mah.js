	$(document).ready(function(){
		$('#nameInput').keypress(function (e) {
	        if (e.keyCode == 13) {
	          var name = $('#nameInput').val();
	          createGame(name);
	        }
	    });

	    // startRound();
	});
	/**
	 * creator - owner string name
	 * example - "Ray"
	 */
	function createGame(creator) {
		var hostRef = new Firebase('https://mah.firebaseio.com/host');
		hostRef.set(creator);
		var statusRef = new Firebase('https://mah.firebaseio.com/status');
		statusRef.set('waiting');
		var statusRef = new Firebase('https://mah.firebaseio.com/playing');
		statusRef.set(-1);
		var roundsRef = new Firebase('https://mah.firebaseio.com/rounds');

		statusRef.once('value', function(snapshot) {
			var roundCount = snapshot.val() ;
			console.log(roundCount);
			roundCount++;
			if ( roundCount >= 0 ) {
				var round = {};
				// round[roundCount] = {"active": true};
				round[roundCount] = {"active": true};

				console.log("round is " + round);
				roundsRef.set(round);	
				statusRef.set(roundCount);

			} 
		});
	}

	function joinGame(name) {

	}
	/**
	 * add songs to PlayList and add player to Player
	 * 
	 * 		songs : [
	 * 			{
	 *				owner : "Ray",
	 *	 			musicURL : "someUrl",
	 *	 			coverImgURL : "someUrl"
	 *	 		},...{}
	 *		]
	 * }
	 */
	function joinGame(playerName, songs) {
		// TODO add playname into song object
		// var playlistRef = new Firebase('https://mah.firebaseio.com/PlayList');
		// playListRef.push(songs);

	}

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

	function startGame() {
		// set status to started
		var playingRef = new Firebase('https://mah.firebaseio.com/playing');
		playingRef.set(-1);
		// console.log(playingRef.val());
		// if ( typeof roundsRef.val() === "undefined" ) {
		// 	var round = {};
		// 	round[0] = {"active": true};
		// 	console.log("round is " + round);
		// 	roundsRef.set(round);
		// } else {
		// 	var rounds = roundsRef.val();
		// 	console.log(rounds.length);
		// 	rounds.push({"active":true});
		// 	roundsRef.set(rounds);
		// }
		// var obj = roundsRef.child('0');
		// console.log(obj);

		// console.log(obj.va);
		// if ( typeof obj.va === "undefined" ) {
		// 	var round = {};
		// 	round[0] = {"active": true};
		// 	console.log(round);
		// 	roundsRef.set(round);
		// } else {
		// 	console.log("hi");
		// }
		// console.log(roundsRef.child());
		roundsRef.on('value', function(snapshot) {
			// var obj = snapshot.val();
			// var round = {};

			// if ( typeof obj === "undefined" ) {
			// 	round[0] = "";
			// 	// round[0] = {"active": true};
			// } else {
			// 	round[obj.size] = "";
			// }
			// console.log(round);
			// roundsRef.push(round);

			// if ( snapshot.val() === null ) {
			// 	var round = {};
			// 	round[0] = {"active": true};
			// 	console.log("round is " + round);
			// 	roundsRef.set(round);
			// } else {
			// 	var rounds = snapshot.val();
			// 	console.log(rounds.length);
			// 	rounds.push({"active":true});
			// 	roundsRef.set(rounds);
			// }
		});

	}

	function startRound() {
		var roundsRef = new Firebase('https://mah.firebaseio.com/rounds');
		var roundCount = 0;
		roundsRef.on('value', function(snapshot) {
			snapshot.val();

		});

		var baseRef = new Firebase('https://mah.firebaseio.com/');
		baseRef.on('value', function(snapshot) {
		  	// alert('Status: ' + snapshot.val());
		  	var obj = snapshot.val();

			if ( obj.status == "started" ) {
				// update 'playing'
				// 
				// pick next song, update
			}
		});
		// if ( statusRef )
	}

	function submitAnswer(player, answer) {


	}

	