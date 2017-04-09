/*
	Minimax code taken and adapted from article posted on freecodecamp.com by ahmad abdolsaheb:

	https://medium.freecodecamp.com/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37

	The code can be found here: https://github.com/ahmadabdolsaheb/minimaxarticle

	After looking through various sites, this version provided the best and simplest implementation. I updated the code to
	bypass the minimax strategy when first starting. Execution times were extreme and frankly not worth it. Instead I opted for
	an optimal strategy to occupy either a corner or the center.

	Here is an interesting article on tic-tac-toe strategy that provides some insight into possible outcomes based on player starting positions: https://mindyourdecisions.com/blog/2015/06/02/the-best-strategy-for-tic-tac-toe-game-theory-tuesdays/
*/


// Use the module pattern to wrap all of your JavaScript code into a single
// global variable or an immediately invoked function.

(function () {
	// game play variables
	let currentPlayer = 2;
	let playerName = '';
	let difficulty = 'expert';
	const squares = $('li.box');
	
	/* BEGIN VARIABLES FOR MINIMAX */
	
	let computerPlayer = false;
	// in each square the O image is visible because of box-filled-1 class
	// while the X image because of box-filled-2
	const computer = 'box-filled-1';
	const human = 'box-filled-2';
	
	/* BEGIN BASIC BOARD ACTIONS */
	
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
		if ($( this ).is(':not([class*="box-filled"])')) {
    		$( this ).css('background-image', 'url("img/' + image + '")');
		}
	}, function() {
		$( this ).css('background-image', '');
	});
	
	
	squares.on('click', function() {
		setSquare(this);
	});
	
	/* MINIMAX FUNCTIONS  */
	
	// the minimax function
	const minimax = (newBoard, player) => {
		
		// check for available spots
		let availableSpots = emptyIndexies(newBoard);
		
		// used only on opening sequence
		let optimalOpeningMoves = [4, 0, 2, 6, 8];
		
		// don't waste computing power if game is starting.
		// optimal strategy dictates that we should occupy either the  
		// corner or center
		if (availableSpots.length === 8) {
			let bestOption = {};
			bestOption.index = 0;
			for (let i = 0; i < optimalOpeningMoves.length; i++) {
				if (!$(squares[optimalOpeningMoves[i]]).is('[class*="box-filled"]')) {
					bestOption.index = optimalOpeningMoves[i];
					return bestOption;	
				}
			}
		}
		
		// check for terminal states - win, lose, draw
		if (winning(newBoard, human)) {
			return {score: -10};
		}
		else if (winning(newBoard, computer)) {
			return {score: 10};
		}
		else if (availableSpots.length === 0) {
			return {score: 0};
		}
		
		// an array to collect all the move objects we'll create
		let moves = [];
		
		// loop through the available spots
		for (let i = 0; i < availableSpots.length; i++) {
			// create an object for each and store it's index
			let move = {};
			move.index = newBoard.index(availableSpots[i]);
			
			// set empty spot to current player
			$(newBoard[move.index]).addClass(player);
			
			// collect the score resulted from calling minimax on the opponent of the current player
			if (player == computer) {
				let result = minimax(newBoard, human);
				move.score = result.score;
			} else {
				let result = minimax(newBoard, computer);
				move.score = result.score;
			}
			
			// reset the spot to empty
			$(newBoard[move.index]).removeClass(player);
			
			// push the object to the array
			moves.push(move);
		}
		
		// if it is the computer's turn, loop over the moves and choose the move with the highest score
		let bestMove;
		
		if (player == computer) {
			let bestScore = -10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			let bestScore = 10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}
		
		// return the chose move
		return moves[bestMove];
	}
	
	const emptyIndexies = board => {
		return board.filter(':not([class*="box-filled"])');
	}
	
	const randomMove = () => {
		let move = {};
		let availableSpots = emptyIndexies(squares);
		let randomNum = Math.floor(Math.random() * availableSpots.length);
		
		move.index = $(squares).index(availableSpots[randomNum]);
		
		return move;
	}
	
	const winning = (board, player) => {
		if (
			($(board[0]).hasClass(player) && $(board[1]).hasClass(player) && $(board[2]).hasClass(player)) ||
			($(board[3]).hasClass(player) && $(board[4]).hasClass(player) && $(board[5]).hasClass(player)) ||
			($(board[6]).hasClass(player) && $(board[7]).hasClass(player) && $(board[8]).hasClass(player)) ||
			($(board[0]).hasClass(player) && $(board[3]).hasClass(player) && $(board[6]).hasClass(player)) ||
			($(board[1]).hasClass(player) && $(board[4]).hasClass(player) && $(board[7]).hasClass(player)) ||
			($(board[2]).hasClass(player) && $(board[5]).hasClass(player) && $(board[8]).hasClass(player)) ||
			($(board[0]).hasClass(player) && $(board[4]).hasClass(player) && $(board[8]).hasClass(player)) ||
			($(board[2]).hasClass(player) && $(board[4]).hasClass(player) && $(board[6]).hasClass(player))
		)
		{
			return true;
		} else {
			return false;
		}		
	}
	
	const bestSpot = () => {
		let computerMove;
		// return best computer move and set class accordingly
		if (difficulty == 'expert') {
		 	computerMove = minimax(squares, computer);
		} else {
			computerMove = randomMove();
		}
		
		$(squares[computerMove.index]).addClass(computer);
	}
	
	/*  END MINIMAX SPECIFIC CODE*/
	
	
	// sets current box with the appropriate class for either X or O
	const setSquare = listItem => {
		const boxFilled = 'box-filled-' + currentPlayer;
		const thisSquare = squares.index(listItem);
		// Players can only click on empty squares. When the player clicks on an empty square,
		// attach the class box-filled-1 (for O) or box-filled-2 (for X) to the square
		if (!$(listItem).is('[class*="box-filled"]')) {
			$(listItem).addClass(boxFilled);
		} else {
			return false;
		}
		
		// check to see if this was a winning move
		isWinner(squares, boxFilled);
			
		if (computerPlayer) {
			bestSpot();
			isWinner(squares, computer);
		}
	}
	
	// checks if there is a winner or a tie and then calls appropriate function
	const isWinner = (board, player) => {
		// check to see if this was a winning move
		if (winning(board, player)) {
			winGame();
		} else {
			checkTieGame() ? tieGame() : setCurrentPlayer(false);
		}
	}
	
	// remove any previously created versions of computer player button and recreate
	// for start or finish divs
	const addAIButton = page => {
		// clean up any existing buttons
		$('#ai-buttons').remove();
		$('#difficulty-buttons').remove();
		
		let computer_player = '<div id="ai-buttons"><a href="#" id="computer-player" class="button">Click to Play the Computer</a>'
		+ '<div id="difficulty-buttons"><a href="#" id="easy" class="button skill">Easy</a>'
		+ '<a href="#" id="expert" class="button skill">Expert</a></div></div>';
		page === 'start' ? $('#start a').before(computer_player) : $('#finish a').before(computer_player);
		$('#computer-player').on('click', function() { 
			$( this ).toggleClass('ai');
			$('.skill').addClass('skill-active')
		});
		$('#easy').on('click', function() { 
			$( this ).toggleClass('ai');
			$('#expert').removeClass('ai');
		});
		$('#expert').on('click', function() {
			$( this ).toggleClass('ai'); 
			$('#easy').removeClass('ai');
		});
	}
	
	const modifyStartScreen = () => {
		// On the start screen, prompt the user add their name before the game starts
		let player_name = '<input type="text" id="player-name" class="name" placeholder="What\'s your name?"><br>';
		$('#start a').before(player_name);
		addAIButton('start');
	}
	
	// reset game to initial state
	const newGame = () => {
		for (let i = 0; i < squares.length; i++) {
			$(squares[i]).removeClass('box-filled-1 box-filled-2');
		}
		
		// set player name if set to an empty string
		if (playerName === '') {
			playerName = $('#player-name').val();
		}
		
		// Display the player’s name on the board screen during game play
		// only display name if one is supplied
		if (playerName !== '') {
			let display_name = '<h3 id="display-name" class="players2">' + playerName + '</h3>';
			$('#player2').after(display_name);
		}
		
		computerPlayer = isAI();
		
		if (computerPlayer) {
			getDifficultyLevel();
		}
		
		setCurrentPlayer(true);
		$('#start').hide();
		$('#finish').removeClass('screen-win-one screen-win-two screen-win-tie').hide();
		$('#board').show();
	};
	
	// set if human player wants to play computer
	const isAI = () => {
		return $('#computer-player').hasClass('ai');
	}
	
	const getDifficultyLevel = () => {
		$('#easy').hasClass('ai') ? difficulty = 'easy' : 'expert';
	}
	
	// Add the appropriate class for the winning screen. screen-win-one for player 1
	// screen-win-two for player two, or screen-win-tie if the game ends with no winner
	const winGame = () => {
		let winClass = '';
		currentPlayer === 1 ? winClass = 'screen-win-one' : winClass = 'screen-win-two';
		if (playerName !== '' && currentPlayer === 2) {
			setStatusScreen(playerName + ' You Won!');
		} else {
			setStatusScreen('Winner!');
		}
		addAIButton('finish');
		$('#start').hide();
		$('#board').hide();
		$('#finish').addClass(winClass).show();
	}
	
	const tieGame = () => {
		setStatusScreen('It\'s a Tie!');
		addAIButton('finish');
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
			currentPlayer = 2;
			$('#player' + currentPlayer).addClass('active');
			$('#player1').removeClass('active');
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
	
	
	loadInitialPage();
}());