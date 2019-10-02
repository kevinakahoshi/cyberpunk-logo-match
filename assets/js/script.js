$(document).ready(initializeApp);

function initializeApp() {
  $('.card').on('click', handleCardClick);
}

function handleCardClick(event) {
  var theCardElement = $(event.currentTarget.lastElementChild);
  theCardElement.toggleClass('hidden');
}
