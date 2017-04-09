// ORIGINAL CODE TO WORK WITH MULTI-PLAYER. HISTORICAL ONLY. NO LONGER USED.

// Use the module pattern to wrap all of your JavaScript code into a single
// global variable or an immediately invoked function.
(function () {
	// game play variables
	let currentPlayer = 1;
	let playerName = '';
	const squares = $('li.box');
	const winningSquares = [[0, 1, 2],
							[3, 4, 5],
							[6, 7, 8],
							[0, 3, 6],
							[1, 4, 7],
							[2, 5, 8],
							[0, 4, 8],
							[2, 4, 6]];
	
	/* BEGIN VARIABLES FOR MINIMAX */
	let currentSquares = [];
	
	// begin game by hiding the board
	$('#board').hide();
	$('#finish').hide();
	
	// Add programming, so that when the player clicks the start button the start screen disappears
	// the board appears, and the game begins.
	$('#start a').on('click', () => { newGame(); });
	
	// Add programming so that when a player pushes the "New Game" button, the board appears again,
	// empty, and a new game begins.
	$('#finish a').on('click', () => { newGame(); });
	
	// When the current player mouses over an empty square on the board, it's symbol the X or O should appear
	// on the square.
	squares.hover( function() {
		let image = '';
		currentPlayer === 1 ? image = 'o.svg' : image = 'x.svg';
		// only show image if square is unoccupied
		if (!$( this ).is('[class*="box-filled"]')) {
    		$( this ).css('background-image', 'url("img/' + image + '")');
		}
	}, function() {
		$( this ).css('background-image', '');
	});
	
	
	squares.on('click', function() {
		setSquare(this);
	});
	
	// sets current box with the appropriate class for either X or O
	const setSquare = listItem => {
		const boxFilled = 'box-filled-' + currentPlayer;
		const thisSquare = squares.index(listItem);
		// Players can only click on empty squares. When the player clicks on an empty square,
		// attach the class box-filled-1 (for O) or box-filled-2 (for X) to the square
		if (!$(listItem).is('[class*="box-filled"]')) {
			$(listItem).addClass(boxFilled);
			// set currentSquares array with player value; 1 = O and 2 = X.
			currentSquares[thisSquare] = currentPlayer;
			checkGameStatus(thisSquare, boxFilled);
		}
	}
	
	// check winningSquares array to see if there's a winner
	const checkGameStatus = (currentBox, boxFilled) => {
		let winner = false;
		for (let i = 0; i < winningSquares.length; i++) {
			// check to see if array contains the current index value.
			if (jQuery.inArray(currentBox, winningSquares[i]) !== -1) {
				let j = 0;
				let squareArray = winningSquares[i];
				do {
					winner = $(squares[squareArray[j]]).hasClass(boxFilled);
					console.log(winner + " : " + squareArray[j]);
					++j;
				} while (winner && j < squareArray.length);
				
				if (winner) {
					break;
				}
			}
		}
		if (winner) {
			// Add programming so that when the game ends, the board disappears and the game end screen appears.
			winGame();
		} else {
			checkTieGame() ? tieGame() : setCurrentPlayer(false);
		}
	};
	
	const modifyStartScreen = () => {
		// On the start screen, prompt the user add their name before the game starts
		let player_name = '<input type="text" id="player-name" class="name" placeholder="What\'s your name?"><br>';
		$('#start a').before(player_name);
	}
	
	// reset game to initial state
	const newGame = () => {
		for (let i = 0; i < squares.length; i++) {
			$(squares[i]).removeClass('box-filled-1').removeClass('box-filled-2');
		}
		
		// set player name if set to an empty string
		if (playerName === '') {
			playerName = $('#player-name').val();
		}
		
		// Display the player’s name on the board screen during game play
		// only display name if one is supplied
		if (playerName !== '') {
			let display_name = '<p id="display-name">' + playerName + '</p>';
			//let computer_player = '<a href="#" id="computer-player" class="button">Computer Opponent</a>';
			$('#player1').after(display_name);
			//$('div#board').after(computer_player);
		}
		
		setCurrentPlayer(true);
		$('#start').hide();
		$('#finish').removeClass('screen-win-one').removeClass('screen-win-two').removeClass('screen-win-tie').hide();
		$('#board').show();
	};
	
	// Add the appropriate class for the winning screen. screen-win-one for player 1
	// screen-win-two for player two, or screen-win-tie if the game ends with no winner
	const winGame = () => {
		let winClass = '';
		currentPlayer === 1 ? winClass = 'screen-win-one' : winClass = 'screen-win-two';
		setStatusScreen('Winner!');
		$('#start').hide();
		$('#board').hide();
		$('#finish').addClass(winClass).show();
	}
	
	const tieGame = () => {
		setStatusScreen('It\'s a Tie!');
		$('#start').hide();
		$('#board').hide();
		$('#finish').addClass('screen-win-tie').show();
	}
	
	const checkTieGame = () => {
		return $('[class*="box-filled"]').length === squares.length;
	}
	
	// Show the word "Winner" or the phrase "It's a Tie!"
	const setStatusScreen = message => {
		$('.message').text(message);
	}
	
	// Play alternates between X and O.
	const setCurrentPlayer = newGame => {
		// The current player is indicated at the top of the page 
		// the box with the symbol O or X is highlighted for the current player.
		
		// if it's a new game, reset current player to 1 and set active class attributes
		if (newGame) {
			currentPlayer = 1;
			$('#player' + currentPlayer).addClass('active');
			$('#player2').removeClass('active');
		} else {
			// sets the inactive player. playerId % 0 returns either 0 or 1
			// indicating the inactive player
			let inactivePlayerId = (currentPlayer % 2) + 1;
			$('#player' + currentPlayer).removeClass('active');
			$('#player' + inactivePlayerId).addClass('active');
			currentPlayer = inactivePlayerId;
		}	
	}
	
	const loadInitialPage = () => {
		modifyStartScreen();
	}
	
	/* MINIMAX FUNCTIONS */
	
	const emptyIndexies = () => {
		return $('li.box').filter(':not([class*="box-filled"])');
	}
	
	const winning = boxFilled => {
		let winner = false;
		for (let i = 0; i < winningSquares.length; i++) {
			// check to see if array contains the current index value.
			if (jQuery.inArray(currentBox, winningSquares[i]) !== -1) {
				let j = 0;
				let squareArray = winningSquares[i];
				do {
					winner = $(squares[squareArray[j]]).hasClass(boxFilled);
					console.log(winner + " : " + squareArray[j]);
					++j;
				} while (winner && j < squareArray.length);
				
				if (winner) {
					break;
				}
			}
		}
	}
	
	
	loadInitialPage();
}());