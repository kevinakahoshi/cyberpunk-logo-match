$(document).ready(initializeApp);

var cardObject = {
  'firstCardParent' : null,
  'secondCardParent' : null,
  'firstCardFront' : null,
  'secondCardFront' : null,
  'firstCardBack' : null,
  'secondCardBack' : null,
  'row' : $('.row')
}

var statsArea = {
  'matches' : null,
  'attempts' : null,
  'games_played' : 0,
  'max_matches' : 9,
  'dynamicGamesPlayed' : $('.dynamicGamesPlayed h6'),
  'dynamicAttempts' : $('.dynamicAttempts h6'),
  'dynamicAccuracy' : $('.dynamicAccuracy h6')
}

var domElements = {
  'input' : $('input'),
  'inputValue' : $('input').val(),
  'submitButton' : $('.submitButton'),
  'startButton' : $('.startButton'),
  'resetButton' : $('.resetButton'),
  'modalHeading' : $('.modalHeading'),
  'modalHeadingBox' : $('.headingBox'),
  'modalContainer' : $('.modalContainer'),
  'enterModalContainer' : $('.enterModalContainer'),
  'largeText' : $('.largeText'),
  'name' : $('#name'),
  'countDown' : 150,
  'countDownInterval' : null,
  'countDownTimer' : $('.countDownTimer')
}

var backgroundArray = [
  'allure',
  'alphabet',
  'amazon',
  'blackMesa',
  'disney',
  'gila',
  'mastercard',
  'mcDonalds',
  'zhi',
];

var backgroundArrayCopy = shuffleArray(backgroundArray);

var backgroundAudio = new Audio();
backgroundAudio.volume = .7;
backgroundAudio.src = '/Users/kevinakahoshi/lfz/memory_match/assets/media/audio/212025_71257-lq.mp3';
backgroundAudio.loop = true;

var clickSounds = new Audio();
clickSounds.src = '/Users/kevinakahoshi/lfz/memory_match/assets/media/audio/GUI_Scroll_Sound_8.wav';

var correctSound = new Audio();
correctSound.src = '/Users/kevinakahoshi/lfz/memory_match/assets/media/audio/GUI_Notification_03.wav';

var incorrectSound = new Audio();
incorrectSound.src = '/Users/kevinakahoshi/lfz/memory_match/assets/media/audio/GUI_Scroll_Sound_30.wav';

var selectionSound = new Audio();
selectionSound.src = '/Users/kevinakahoshi/lfz/memory_match/assets/media/audio/GUI_Scroll_Sound_8.wav';

var tenSecondSound = new Audio();
tenSecondSound.src = '/Users/kevinakahoshi/lfz/memory_match/assets/media/audio/GUI_Tally_Up_12.wav';
tenSecondSound.loop = true;

function initializeApp() {
  domElements.resetButton.on('click', resetGame);
  domElements.submitButton.on('click', getName)
  domElements.startButton.on('click', startGame);
  domElements.input.on('keypress', pressedEnter);
}

function getName() {
  var inputValue = $('input').val();
  domElements.inputValue = inputValue;
  domElements.name.text(domElements.inputValue);
  domElements.modalHeading.text('Unauthorized Access').css('color', '#4c0707').fadeIn('fast');
  domElements.modalHeadingBox.css('background', '#a00000').fadeIn('fast');
  domElements.input.addClass('hidden').fadeOut('fast');
  domElements.submitButton.addClass('hidden').fadeOut('fast');
  domElements.largeText.removeClass('hidden').fadeIn('fast');
  domElements.startButton.removeClass('hidden').fadeIn('fast');
}

function pressedEnter(enter) {
  if (enter.which === 13) {
    getName();
  }
}

function startGame() {
  backgroundAudio.play();
  domElements.enterModalContainer.addClass('hidden');
  domElements.countDownInterval = setInterval(timer, 100);
  $('.allBodyContent').removeClass('hidden blur');
  generateCards();
}

function timer() {
  if (domElements.countDown <= 0) {
    clearInterval(domElements.countDownInterval);
  }

  if (domElements.countDown <= 100) {
    tenSecondSound.play();
    domElements.countDownTimer.css('color', '#a00000');
  }

  if (domElements.countDown === 0) {
    tenSecondSound.pause();
  }

  domElements.countDownTimer.html((domElements.countDown / 10).toFixed(1));
  --domElements.countDown;
}

function handleCardClick(event) {
  var theCard = $(event.currentTarget);

  if (cardObject.firstCardParent === null) {
    cardObject.firstCardParent = theCard;
    cardObject.firstCardFront = cardObject.firstCardParent.find('.cardFront').css('background-image');
    cardObject.firstCardBack = theCard.find('.cardBack');
    cardObject.firstCardBack.addClass('hidden');
    selectionSound.play();
  } else {
    cardObject.secondCardParent = theCard;
    // Prevents users from clicking the same card twice and breaking the game.
    if (cardObject.secondCardParent.is(cardObject.firstCardParent)) {
      cardObject.secondCardParent = null;
    } else {
      statsArea.attempts++;
      cardObject.secondCardFront = $(event.currentTarget).find('.cardFront').css('background-image');
      cardObject.secondCardBack = theCard.find('.cardBack');
      cardObject.secondCardBack.addClass('hidden');
      if (cardObject.firstCardFront === cardObject.secondCardFront) {
        correctSound.play();
        // Removes pointer events for cards that are matches, preventing users from clicking on the same card multiple times to break the game or cheat.
        cardObject.firstCardParent.addClass('noMoreClicks');
        cardObject.secondCardParent.addClass('noMoreClicks');
        statsArea.matches++;
        cardObject.firstCardParent = null;
        cardObject.secondCardParent = null;
        if (statsArea.matches === statsArea.max_matches) {
          domElements.modalContainer.removeClass('hidden');
          statsArea.games_played++;
        }
      } else {
        // Removes option to click on other cards before the timeout is up
        cardObject.allCards.unbind('click');

        incorrectSound.play();

        setTimeout(function() {
          cardObject.firstCardBack.removeClass('hidden');
          cardObject.secondCardBack.removeClass('hidden');
          cardObject.firstCardParent = null;
          cardObject.secondCardParent = null;
          cardObject.allCards.on('click', handleCardClick);
        }, 500);
      }
      displayStats();
    }
  }
}

function calculateAccuracy() {
  var accuracy = statsArea.matches / statsArea.attempts;

  return accuracy;
}

function displayStats() {
  var displayAccuracy = calculateAccuracy();

  statsArea.dynamicGamesPlayed.text(statsArea.games_played);
  statsArea.dynamicAttempts.text(statsArea.attempts);
  statsArea.dynamicAccuracy.text((displayAccuracy * 100).toFixed(2) + '%');
}

// Resets game/stats
function resetGame() {
  statsArea.matches = null;
  statsArea.attempts = null;
  statsArea.games_played++;
  cardObject.allCards.removeClass('noMoreClicks');
  cardObject.cardBackClass.removeClass('hidden');
  domElements.modalContainer.addClass('hidden');

  displayStats();

  statsArea.dynamicAttempts.text('0');
  statsArea.dynamicAccuracy.text('0.00%');

  destroyCards();
  generateCards();
}

// Creates cards dynamically based on the length of the array of images.  Assigns all appropriate CSS classes.
function generateCards() {
  for (var numberOfCardsIndex = 0; numberOfCardsIndex < backgroundArrayCopy.length; numberOfCardsIndex++) {
    var generateParentCardDiv = $('<div>');
    var generateCardBack = $('<div>');
    var generateCardFront = $('<div>');

    generateParentCardDiv.addClass('card containerContents').attr('loading', 'lazy');
    generateCardBack.addClass('cardBack background');
    generateCardFront.addClass('cardFront background ' + backgroundArrayCopy[numberOfCardsIndex]);

    cardObject.row.append(generateParentCardDiv);
    generateParentCardDiv.append(generateCardFront);
    generateParentCardDiv.append(generateCardBack);
  }

  cardObject.allCards = $('.card');
  cardObject.cardBackClass = $('.cardBack');
  cardObject.allCards.on('click', handleCardClick);
}

// Function takes in array, doubles the values within the array, and returns a shuffled version.
function shuffleArray(backgroundArray) {
  var doubledArray = [];

  for (var doubleArrayLengthIndex = 0; doubleArrayLengthIndex < backgroundArray.length; doubleArrayLengthIndex++) {
    doubledArray.push(backgroundArray[doubleArrayLengthIndex]);
    doubledArray.push(backgroundArray[doubleArrayLengthIndex]);
  }

  var currentIndex = doubledArray.length;
  var temporaryIndex = null;
  var randomIndex = null;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryIndex = doubledArray[currentIndex];
    doubledArray[currentIndex] = doubledArray[randomIndex];
    doubledArray[randomIndex] = temporaryIndex;
  }

  return doubledArray;
}

// Resets the game by removing all the original HTML elements and replacing them with new ones.
function destroyCards() {
  cardObject.row.html('');
  backgroundArrayCopy = shuffleArray(backgroundArray);
}
