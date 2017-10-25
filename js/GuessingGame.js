function generateWinningNumber(){
	return Math.floor(Math.random()*100)+1; 
}

function shuffle(arr){
//https://bost.ocks.org/mike/shuffle/
	var current;
	var last;
	var lastNotShuffled = arr.length;

	while(lastNotShuffled){
		current = Math.floor(Math.random()*lastNotShuffled--);
		last = arr[lastNotShuffled];
		arr[lastNotShuffled] = arr[current];
		arr[current] = last;
	}
	return arr;
}


function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	var pg = this.playersGuess;
	var wn = this.winningNumber;
	return (pg > wn) ? (pg - wn) : (wn - pg);
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber;
}

Game.prototype.checkGuess = function(n){
	var dif = this.difference();
	if(n === this.winningNumber){
		$('#hint', '#submit').prop('disabled', true);
		$('#title').text('-YOU WIN!-')
		$('#subtitle').text('Press Reset to play again!');
		return 'You Win!'
	}else{
		if(this.pastGuesses.indexOf(n) === -1){
			this.pastGuesses.push(n);
			$('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
			if(this.pastGuesses.length === 5){
				$('#hint', '#submit').prop('disabled', true);
				$('#title').text('-YOU LOSE!-')
				$('#subtitle').text('Press Reset to play again!');
				return 'You Lose.'
			}else{
				if(this.isLower()){
					$('#subtitle').text('Guess Higher');
				}else{
					$('#subtitle').text('Guess Lower');
				}
				if(dif < 10){return 'You\'re burning up!'};
				if(dif < 25){return 'You\'re lukewarm.'};
				if(dif < 50){return 'You\'re a bit chilly.'};
				if(dif < 100){return 'You\'re ice cold!'};
			}			
		}else{
			return 'You have already guessed that number.';
		}
	}		
}

Game.prototype.playersGuessSubmission = function(n){

	if(typeof n !== 'number' || n<1 || n>100){
		throw "That is an invalid guess.";
	}else{
		this.playersGuess = n;
	}	
	return '' + this.checkGuess(n);
}

Game.prototype.provideHint = function(){
	return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}


function newGame(){
	return new Game();
}


// JQUERY

function submit(game){
	var playerInput = +$('#player-input').val();
	$('#player-input').val('');
	var output = game.playersGuessSubmission(playerInput);
	$('#title').text(output);
}

$(document).ready(function() {

	var game = new Game();
	game;

	$('#submit').on('click', function(){
		submit(game);
	});

	$('#player-input').on('keyup', function(event){
		if(event.which === 13){
			submit(game);
		}
	});

	$('#reset').on('click', function(){
		game = newGame();
		$('#title').text('-THE GUESSING GAME-');
		$('#subtitle').text('How many burgers did Wimpy not pay?');
		$('#guesses li').text('-');
		$('#hint', '#submit').prop('disabled', false);
	});

	$('#hint').on('click', function(){
		var hints = game.provideHint();
		$('#title').text('The winning number is '+hints[0]+', '+hints[1]+' or '+hints[2])
	});

});




