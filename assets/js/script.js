$(document).ready(initializeApp);

var cardObject = {
  'allCards' : $('.card'),
  'cardBackClass': $('.cardBack'),
  'firstCardClicked' : null,
  'secondCardClicked' : null,
  'firstCardFront' : null,
  'secondCardFront' : null,
  'firstCardBack' : null,
  'secondCardBack' : null
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

var modalObject = {
  'modalContainer' : $('.modalContainer'),
  'resetButton' : $('.resetButton')
}

var backgroundArray = [
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/react-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/react-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/css-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/css-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/html-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/html-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/js-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/js-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/mysql-logo.jpg',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/mysql-logo.jpg',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/node-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/node-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/php-logo.jpeg',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/php-logo.jpeg',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/docker-logo.jpg',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/docker-logo.jpg',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/gitHub-logo.png',
  '/Users/kevinakahoshi/lfz/memory_match/assets/images/gitHub-logo.png'
];

var backgroundArrayCopy = [];

function initializeApp() {
  cardObject.allCards.on('click', handleCardClick);
  modalObject.resetButton.on('click', resetStats);
  // generateCards();
}

function handleCardClick(event) {
  var theCard = $(event.currentTarget);
  if (cardObject.firstCardClicked === null) {
    cardObject.firstCardClicked = theCard;
    cardObject.firstCardFront = cardObject.firstCardClicked.find('.cardFront').css('background-image');
    cardObject.firstCardBack = theCard.find('.cardBack');
    cardObject.firstCardBack.addClass('hidden');
  } else {
    cardObject.secondCardClicked = theCard;
    if (cardObject.secondCardClicked.is(cardObject.firstCardClicked)) {
      cardObject.secondCardClicked = null;
    } else {
      statsArea.attempts++;
      cardObject.secondCardFront = $(event.currentTarget).find('.cardFront').css('background-image');
      cardObject.secondCardBack = theCard.find('.cardBack');
      cardObject.secondCardBack.addClass('hidden');
      if (cardObject.firstCardFront === cardObject.secondCardFront) {
        cardObject.firstCardClicked.addClass('noMoreClicks');
        cardObject.secondCardClicked.addClass('noMoreClicks');
        statsArea.matches++;
        cardObject.firstCardClicked = null;
        cardObject.secondCardClicked = null;
        if (statsArea.matches === statsArea.max_matches) {
          modalObject.modalContainer.removeClass('hidden');
          statsArea.games_played++;
        }
      } else {
        // Removes option to click on other cards before the timeout is up
        cardObject.allCards.unbind('click');
        setTimeout(function() {
          cardObject.firstCardBack.removeClass('hidden');
          cardObject.secondCardBack.removeClass('hidden');
          cardObject.firstCardClicked = null;
          cardObject.secondCardClicked = null;
          cardObject.allCards.on('click', handleCardClick);
        }, 1500);
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

function resetStats() {
  statsArea.matches = null;
  statsArea.attempts = null;
  statsArea.games_played++;
  cardObject.allCards.removeClass('noMoreClicks');
  cardObject.cardBackClass.removeClass('hidden');
  modalObject.modalContainer.addClass('hidden');

  displayStats();
  statsArea.dynamicAttempts.text('0');
  statsArea.dynamicAccuracy.text('0.00%');
}

// Function to create cards dynamically.  Assigns all appropriate classes.
function generateCards() {
  createArrayCopy();
  for (var numberOfCardsIndex = 0; numberOfCardsIndex < backgroundArray.length; numberOfCardsIndex++) {
    var generateParentCardDiv = $('<div>');
    var generateCardBack = $('<div>');
    var generateCardFront = $('<div>');
    var cardIndex = numberOfCardsIndex + 1;

    generateParentCardDiv.addClass('card containerContents').addClass('card' + cardIndex);
    generateCardBack.addClass('cardBack background');
    generateCardFront.addClass('cardFront background');

    $('.row').append(generateParentCardDiv);
    $(generateParentCardDiv).append(generateCardFront);
    $(generateParentCardDiv).append(generateCardBack);
  }
}

function generateRandomIndexes() {
  var imageArrayIndex = Math.floor((Math.random() * backgroundArray.length));
  return imageArrayIndex;
}

// Makes a copy of the background image array to preserve
function createArrayCopy() {
  for (var backgroundArrayCopyIndex = 0; backgroundArrayCopyIndex < backgroundArray.length; backgroundArrayCopyIndex++) {
    backgroundArrayCopy.push(backgroundArray[backgroundArrayCopyIndex]);
  }
}
