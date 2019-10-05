$(document).ready(initializeApp);

var cardObject = {
  'firstCardParent' : null,
  'secondCardParent' : null,
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

var backgroundArrayCopy = shuffleArray(backgroundArray);

function initializeApp() {
  modalObject.resetButton.on('click', resetStats);
  generateCards();
}

function handleCardClick(event) {
  var theCard = $(event.currentTarget);
  if (cardObject.firstCardParent === null) {
    cardObject.firstCardParent = theCard;
    cardObject.firstCardFront = cardObject.firstCardParent.find('.cardFront').css('background-image');
    cardObject.firstCardBack = theCard.find('.cardBack');
    cardObject.firstCardBack.addClass('hidden');
  } else {
    cardObject.secondCardParent = theCard;
    if (cardObject.secondCardParent.is(cardObject.firstCardParent)) {
      cardObject.secondCardParent = null;
    } else {
      statsArea.attempts++;
      cardObject.secondCardFront = $(event.currentTarget).find('.cardFront').css('background-image');
      cardObject.secondCardBack = theCard.find('.cardBack');
      cardObject.secondCardBack.addClass('hidden');
      if (cardObject.firstCardFront === cardObject.secondCardFront) {
        cardObject.firstCardParent.addClass('noMoreClicks');
        cardObject.secondCardParent.addClass('noMoreClicks');
        statsArea.matches++;
        cardObject.firstCardParent = null;
        cardObject.secondCardParent = null;
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
          cardObject.firstCardParent = null;
          cardObject.secondCardParent = null;
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
  shuffleArray(backgroundArray);
  destroyCards();
  generateCards();
}

// Function to create cards dynamically.  Assigns all appropriate classes.
function generateCards() {
  for (var numberOfCardsIndex = 0; numberOfCardsIndex < backgroundArray.length; numberOfCardsIndex++) {
    var generateParentCardDiv = $('<div>');
    var generateCardBack = $('<div>');
    var generateCardFront = $('<div>');
    var cardIndex = numberOfCardsIndex + 1;

    generateParentCardDiv.addClass('card containerContents card' + cardIndex);
    generateCardBack.addClass('cardBack background');
    generateCardFront.addClass('cardFront background');

    $('.row').append(generateParentCardDiv);
    generateParentCardDiv.append(generateCardFront);
    generateParentCardDiv.append(generateCardBack);
    generateCardFront.css('background-image', 'url(' + backgroundArrayCopy[numberOfCardsIndex] + ')');
  }
  cardObject.allCards = $('.card');
  cardObject.cardBackClass = $('.cardBack');
  cardObject.allCards.on('click', handleCardClick);
}

function shuffleArray(backgroundArray) {
  var currentIndex = backgroundArray.length;
  var temporaryValue = null;
  var randomIndex = null;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = backgroundArray[currentIndex];
    backgroundArray[currentIndex] = backgroundArray[randomIndex];
    backgroundArray[randomIndex] = temporaryValue;
  }
  return backgroundArray;
}

function destroyCards() {
  $('.row').html('');
}
