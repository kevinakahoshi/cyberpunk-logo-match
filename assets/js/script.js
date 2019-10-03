$(document).ready(initializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var firstCardFront = null;
var secondCardFront = null;
var firstCardBack = null;
var secondCardBack = null;
var matches = null;
var attempts = null;
var modalContainer = $('.modalContainer');
var cardBackClass = $('.cardBack');
var games_played = 0;
var max_matches = 9;

var cardObject = {
  'allCards' : $('.card')
}

function initializeApp() {
  var resetButton = $('.resetButton');
  cardObject.allCards.on('click', handleCardClick);
  resetButton.on('click', resetStats);
}

function handleCardClick(event) {
  var theCard = $(event.currentTarget);

  if (firstCardClicked === null) {
    firstCardClicked = theCard;
    firstCardFront = firstCardClicked.find('.cardFront').css('background-image');
    firstCardBack = theCard.find('.cardBack');
    firstCardBack.addClass('hidden');
  } else {

    secondCardClicked = theCard;
    console.log(attempts);

    if (secondCardClicked.is(firstCardClicked)) {
      secondCardClicked = null;
      displayStats();
    } else {
      attempts++;
      secondCardFront = $(event.currentTarget).find('.cardFront').css('background-image');
      secondCardBack = theCard.find('.cardBack');
      secondCardBack.addClass('hidden');

      if (firstCardFront === secondCardFront) {
        matches++;
        firstCardClicked = null;
        secondCardClicked = null;
        if (matches === max_matches) {
          modalContainer.removeClass('hidden');
          games_played++;
        }
      } else {
        // Encountered bug when clicking on other choices immediately after making wrong selection.  Unbinding the click handler temporarily fixes this.
        cardObject.allCards.unbind('click');
        attempts++;
        setTimeout(function() {
          firstCardBack.removeClass('hidden');
          secondCardBack.removeClass('hidden');
          firstCardClicked = null;
          secondCardClicked = null;
          cardObject.allCards.on('click', handleCardClick);
        }, 1500);
      }
      displayStats();
    }
  }
}

function calculateAccuracy() {
  var accuracy = matches / attempts;
  if (matches === null || attempts === null) {
    attempts = 0;
    accuracy = 0.00;
  }
  return accuracy;
}

function displayStats() {
  var displayAccuracy = calculateAccuracy();
  $('.dynamicGamesPlayed h6').text(games_played);
  $('.dynamicAttempts h6').text(attempts);
  $('.dynamicAccuracy h6').text((displayAccuracy * 100).toFixed(2) + '%');
}

function resetStats() {
  matches = null;
  attempts = null;
  games_played++;
  cardBackClass.removeClass('hidden');
  modalContainer.addClass('hidden');
  displayStats();
}
