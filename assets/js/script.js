$(document).ready(initializeApp);

var allCards = null;
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardBack = null;
var secondCardBack = null;
var matches = null;
var max_matches = 2;

function initializeApp() {
  allCards = $('.card');
  allCards.on('click', handleCardClick);
}

function handleCardClick(event) {
  var theCardBack = $(event.currentTarget.lastElementChild);
  theCardBack.addClass('hidden');

  if (firstCardClicked === null) {
    firstCardClicked = theCardBack;
    firstCardBack = $(event.currentTarget).find('.cardFront').css('background-image');
  }
  else {
    secondCardClicked = theCardBack;
    secondCardBack = $(event.currentTarget).find('.cardFront').css('background-image');
    if (firstCardBack === secondCardBack) {
      console.log('Cards Match');
      matches++
      firstCardClicked = null;
      secondCardClicked = null;
      if (matches === max_matches) {
        $('.modalContainer').removeClass('hidden');
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
  }
}
