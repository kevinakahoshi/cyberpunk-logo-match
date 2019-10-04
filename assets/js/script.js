$(document).ready(initializeApp);

var modalContainer = $('.modalContainer');
var cardBackClass = $('.cardBack');

var cardObject = {
  'allCards' : $('.card'),
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

function initializeApp() {
  var resetButton = $('.resetButton');
  cardObject.allCards.on('click', handleCardClick);
  resetButton.on('click', resetStats);
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
          modalContainer.removeClass('hidden');
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
  cardObject.allCards.removeClass('noMoreClicks');
  statsArea.matches = null;
  statsArea.attempts = null;
  statsArea.games_played++;
  cardBackClass.removeClass('hidden');
  modalContainer.addClass('hidden');

  displayStats();
  statsArea.dynamicAttempts.text('0');
  statsArea.dynamicAccuracy.text('0.00%');
}
