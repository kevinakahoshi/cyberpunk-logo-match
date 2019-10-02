$(document).ready(initializeApp);

var allCards = null;
var firstCardClicked = null;
var secondCardClicked = null;
var firstCardBack = null;
var secondCardBack = null;
var matches = null;

function initializeApp() {
  $('.card').on('click', handleCardClick);
  allCards = $('.card');
}

function handleCardClick(event) {
  var theCardBack = $(event.currentTarget.lastElementChild);
  theCardBack.addClass('hidden');

  if (firstCardClicked === null) {
    firstCardClicked = theCardBack;
    firstCardBack = $(event.currentTarget).find('.cardFront').css('background-image');
  }
  else if (firstCardClicked !== null) {
    secondCardClicked = theCardBack;
    secondCardBack = $(event.currentTarget).find('.cardFront').css('background-image');
    if (firstCardBack === secondCardBack) {
      console.log('Cards Match');
      matches++
      firstCardClicked = null;
      secondCardClicked = null;
    } else {
      allCards.attr('disabled', 'true');
      setTimeout(function() {
        firstCardClicked.removeClass('hidden');
        secondCardClicked.removeClass('hidden');
        firstCardClicked = null;
        secondCardClicked = null;
        allCards.removeAttr('disabled');
        }, 1500);
    }
  }
}
