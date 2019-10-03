$(document).ready(initializeApp);

var allCards = null;
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardBack = null;
var secondCardBack = null;
var matches = null;
var attempts = null;
var modalContainer = $('.modalContainer');
var cardBackClass = $('.cardBack');
var games_played = 0;
var max_matches = 9;

function initializeApp() {
  var resetButton = $('.resetButton');
  allCards = $('.card');
  allCards.on('click', handleCardClick);
  resetButton.on('click', resetStats);
}

function handleCardClick(event) {
  var theCardBack = $(event.currentTarget.lastElementChild);
  theCardBack.addClass('hidden');

  if (firstCardClicked === null) {
    firstCardClicked = theCardBack;
    firstCardBack = $(event.currentTarget).find('.cardFront').css('background-image');
  } else {
    attempts++
    secondCardClicked = theCardBack;
    secondCardBack = $(event.currentTarget).find('.cardFront').css('background-image');
    if (firstCardBack === secondCardBack) {
      matches++
      firstCardClicked = null;
      secondCardClicked = null;
      if (matches === max_matches) {
        modalContainer.removeClass('hidden');
        games_played++
      }
    } else {
      // Encountered bug when clicking on other choices immediately after making wrong selection.  Unbinding the click handler temporarily fixes this.
      allCards.unbind('click');
      setTimeout(function() {
        firstCardClicked.removeClass('hidden');
        secondCardClicked.removeClass('hidden');
        firstCardClicked = null;
        secondCardClicked = null;
        allCards.on('click', handleCardClick);
      }, 1500);
    }
    displayStats();
  }
}

function calculateAccuracy() {
  var accuracy = matches / attempts;
  if (matches === null || attempts === null) {
    attempts = 0;
    accuracy = 0;
  }
  return accuracy;
}

function displayStats() {
  var displayAccuracy = calculateAccuracy();
  $('.dynamicGamesPlayed h6').text(games_played);
  $('.dynamicAttempts h6').text(attempts);
  $('.dynamicAccuracy h6').text(displayAccuracy * 100 + '%');
}

function resetStats() {
  matches = null;
  attempts = null;
  games_played++;
  cardBackClass.removeClass('hidden');
  modalContainer.addClass('hidden');
  displayStats();
}
