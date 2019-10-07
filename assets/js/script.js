$(document).ready(initializeApp);

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
  'max_matches' : backgroundArray.length,
  'dynamicGamesPlayed' : $('.dynamicGamesPlayed h6'),
  'dynamicAttempts' : $('.dynamicAttempts h6'),
  'dynamicAccuracy' : $('.dynamicAccuracy h6')
}

var domElements = {
  'allBodyContent' : $('.allBodyContent'),
  'input' : $('input'),
  'inputValue' : $('input').val(),
  'submitButton' : $('.submitButton'),
  'startButton' : $('.startButton'),
  'resetButton' : $('.resetButton'),
  'modalBox' : $('.modalBox'),
  'modalHeading' : $('.modalHeading'),
  'modalHeadingBox' : $('.headingBox'),
  'modalContainer' : $('.modalContainer'),
  'enterModalContainer' : $('.enterModalContainer'),
  'largeText' : $('.largeText'),
  'name' : $('#name'),
  'countDownValue' : 600,
  'countDownInterval' : null,
  'countDownTimer' : $('.countDownTimer'),
  'startingText' : $('.startingText'),
  'finishingText' : $('.finishingText'),
  'time' : $('.time'),
  'accuracy' : $('.accuracy'),
  'threshold' : $('.threshold'),
  'videoBackground' : $('.videoBackground'),
  'staticBackground' : $('.staticBackground'),
  'colorOverlay' : $('.colorOverlay')
}

var backgroundArrayCopy = shuffleArray(backgroundArray);

var backgroundAudio = new Audio();
backgroundAudio.volume = .7;
backgroundAudio.src = './assets/media/audio/212025_71257-lq.mp3';
backgroundAudio.loop = true;

var clickSounds = new Audio();
clickSounds.src = './assets/media/audio/GUI_Scroll_Sound_8.wav';

var correctSound = new Audio();
correctSound.src = './assets/media/audio/GUI_Notification_03.wav';

var incorrectSound = new Audio();
incorrectSound.src = './assets/media/audio/GUI_Scroll_Sound_30.wav';

var selectionSound = new Audio();
selectionSound.src = './assets/media/audio/GUI_Scroll_Sound_8.wav';

var fifteenSecondSound = new Audio();
fifteenSecondSound.src = './assets/media/audio/GUI_Tally_Up_13.wav';
fifteenSecondSound.volume = .25;
fifteenSecondSound.loop = true;

var tenSecondSound = new Audio();
tenSecondSound.src = './assets/media/audio/GUI_Tally_Up_12.wav';
tenSecondSound.loop = true;

var endScreenSound = new Audio();
endScreenSound.src = './assets/media/audio/GUI_Tally_Up_01.wav';
endScreenSound.loop = true;

var hoverAudioElement = new Audio();
hoverAudioElement.volume = .5;
hoverAudioElement.src = './assets/media/audio/GUI_Scroll_Sound_11.wav';

function initializeApp() {
  domElements.resetButton.on('click', resetGame);
  domElements.submitButton.on('click', getName)
  domElements.startButton.on('click', startGame);
  domElements.input.on('keypress', pressedEnter);
}

function pressedEnter(enter) {
  if (enter.which === 13) {
    getName();
    clickSounds.play();
  }
}

function getName() {
  var inputValue = $('input').val();
  if (inputValue.length > 0) {
    domElements.inputValue = inputValue;
    domElements.name.text(domElements.inputValue);
    domElements.modalBox.removeClass('whiteGlow greenGlow').addClass('redGlow');
    domElements.modalHeading.text('Access Denied // Unauthorized User');
    domElements.modalHeadingBox.addClass('accessDenied');
    domElements.startingText.removeClass('hidden');
    domElements.input.addClass('hidden');
    domElements.submitButton.addClass('hidden');
    domElements.largeText.removeClass('hidden');
    domElements.startButton.removeClass('hidden');

    clickSounds.play();
  } else {
    domElements.modalHeading.text('Invalid Entry // No Input');
    domElements.modalBox.removeClass('whiteGlow greenGlow').addClass('redGlow')
    domElements.modalHeadingBox.addClass('accessDenied');
    incorrectSound.play();
  }
  backgroundAudio.play();
}

function startGame() {
  domElements.enterModalContainer.addClass('hidden');
  domElements.countDownInterval = setInterval(timer, 100);
  domElements.allBodyContent.removeClass('hidden blur');

  clickSounds.play();
  generateCards();
}

function timer() {
  if (domElements.countDownValue <= 150) {
    fifteenSecondSound.play();
  }

  if (domElements.countDownValue <= 100) {
    tenSecondSound.play();
    domElements.countDownTimer.addClass('alertText');
  }

  if (domElements.countDownValue === 0) {
    var errorTag = $('<h3>');
    var errorMessage = 'Error: Out of Time';
    errorTag.addClass('finishingText');
    fifteenSecondSound.pause();
    tenSecondSound.pause();
    endScreenSound.play();

    domElements.modalContainer.removeClass('hidden');
    domElements.modalHeadingBox.addClass('accessDenied');
    domElements.modalBox.removeClass('whiteGlow greenGlow').addClass('redGlow')
    domElements.modalHeading.text('Access Denied // Termination Process Initiated')
    domElements.finishingText.text('User: ' + domElements.name.text());
    domElements.finishingText.append(errorTag.text(errorMessage));
    domElements.time.text('Time: ' + domElements.countDownValue.toFixed(1) + ' Seconds');
    domElements.accuracy.text('Accuracy: ' + statsArea.dynamicAccuracy.text());
    domElements.threshold.text('');
    domElements.allBodyContent.addClass('hidden');
    domElements.videoBackground.addClass('hidden');
    domElements.staticBackground.removeClass('hidden');
    domElements.colorOverlay.removeClass('hidden');

    return;
  }

  if (statsArea.matches === statsArea.max_matches) {
    fifteenSecondSound.pause();
    tenSecondSound.pause();
    return;
  }

  if (domElements.countDownValue <= 0) {
    domElements.countDownValue = 0;
    fifteenSecondSound.pause();
    tenSecondSound.pause();
    return;
  }

  domElements.countDownValue--;

  domElements.countDownTimer.text((domElements.countDownValue / 10).toFixed(1));
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
        if (statsArea.matches === statsArea.max_matches && parseInt(statsArea.dynamicAccuracy.text()) >= 50) {
          displayStats();
          domElements.allBodyContent.addClass('hidden');
          domElements.modalBox.removeClass('whiteGlow redGlow').addClass('greenGlow')
          domElements.modalContainer.removeClass('hidden');
          domElements.modalHeadingBox.removeClass('accessDenied').addClass('accessGranted');
          domElements.modalHeading.text('Access Granted //');
          domElements.finishingText.text('Challenge Completed');
          domElements.time.text('Time: ' + ((600 - domElements.countDownValue) / 10) + ' Seconds');
          domElements.accuracy.text('Accuracy: ' + statsArea.dynamicAccuracy.text());
          endScreenSound.pause();
          statsArea.games_played++;
        } else if (statsArea.matches === statsArea.max_matches && parseInt(statsArea.dynamicAccuracy.text()) < 50) {
          displayStats();
          var errorTag = $('<h3>');
          var errorMessage = 'Error: Humanoid Detected - Accuracy Below Threshold';
          errorTag.addClass('finishingText');
          domElements.modalBox.removeClass('whiteGlow greenGlow').addClass('redGlow')
          domElements.modalContainer.removeClass('hidden');
          domElements.modalHeadingBox.removeClass('accessGranted').addClass('accessDenied');
          domElements.modalHeading.text('Access Denied // Termination Process Initiated');
          domElements.finishingText.text('User: ' + domElements.name.text());
          domElements.finishingText.append(errorTag.text(errorMessage))
          domElements.time.text('Time: ' + ((600 - domElements.countDownValue) / 10) + ' Seconds');
          domElements.accuracy.text('Accuracy: ' + statsArea.dynamicAccuracy.text());
          domElements.threshold.text('Threshold: 50.0%');
          statsArea.games_played++;
          domElements.allBodyContent.addClass('hidden');
          domElements.videoBackground.addClass('hidden');
          domElements.staticBackground.removeClass('hidden');
          domElements.colorOverlay.removeClass('hidden');
          endScreenSound.play();
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
        }, 1000);
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
  statsArea.dynamicAccuracy.text((displayAccuracy * 100).toFixed(1) + '%');
}

// Resets game/stats
function resetGame() {
  statsArea.matches = null;
  statsArea.attempts = null;
  statsArea.games_played++;
  cardObject.allCards.removeClass('noMoreClicks');
  cardObject.cardBackClass.removeClass('hidden');
  domElements.modalContainer.addClass('hidden');


  if (cardObject.firstCardFront !== null) {
    cardObject.firstCardBack.removeClass('hidden');
    cardObject.firstCardParent = null;
  }

  displayStats();

  statsArea.dynamicAttempts.text('0');
  statsArea.dynamicAccuracy.text('0.00%');
  domElements.countDownTimer.text('60.0');
  domElements.countDownTimer.removeClass('alertText');
  correctSound.play();
  endScreenSound.pause();

  domElements.countDownValue = 600;
  domElements.countDownInterval;
  domElements.time.text('');
  domElements.accuracy.text('');

  domElements.colorOverlay.addClass('hidden');
  domElements.staticBackground.addClass('hidden');
  domElements.allBodyContent.removeClass('hidden');
  domElements.videoBackground.removeClass('hidden');

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
  cardObject.allCards.on('mouseover', hoverSounds);
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

// Mouse Over Sounds
function hoverSounds() {
  hoverAudioElement.currentTime = 0;
  hoverAudioElement.play();
}
