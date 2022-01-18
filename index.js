/* RULES */
//To win, one's value must be less than or equal to 21 and also more than the opponent's value
//User can add as many cards as possible to their desire and benefit
//If player has natural or blackjack(2 cards with 1 A and 1 10-valued card), they win even if the opponent has a total of 21-valued card

const compCard = $("#computer-card");
const userCard = $("#user-card");
const startBtn = $("#start");
const hitBtn = $("#hit");
const standBtn = $("#stand");
const actionBtn = $("#action");
const score = $("#score");
const comp = $("#computer-title");
const user = $("#user-title");

const deck = [];
const compTakenCards = [];
const compTakenVal = [];
const userTakenCards = [];
const userTakenVal = [];

/*LISTEN TO MULTIPLE CLICK EVENTS - START, HIT, STAND, REPLAY*/

//when start button is clicked and the game begins
startBtn.click(() => {
  //start button disappear
  startBtn.css("visibility", "hidden");
  startBtn.innerHTML = "";

  //reset everything to inital state
  userCard.html("");
  compCard.html("");
  score.html("");
  comp.text("Computer");
  user.text("User");

  //call newGame function to kick start the card handling
  setTimeout(newGame, 1000);
});

function newGame() {
  //reset both players' array to empty
  compTakenCards.splice(0);
  compTakenVal.splice(0);
  userTakenCards.splice(0);
  userTakenVal.splice(0);

  //prepare a suffled the deck
  newDeck();

  //remove 4 cards from the deck, add cards and card values to designated array
  takeCard(compTakenCards, compTakenVal);
  takeCard(userTakenCards, userTakenVal);
  takeCard(compTakenCards, compTakenVal);
  takeCard(userTakenCards, userTakenVal);

  //2 cards will be handed to each side on display
  //1st card to user, 2nd card to computer, 3rd card to user and 4th card to computer
  for (let i = 0; i < userTakenCards.length; i++) {
    let card = userTakenCards[i];
    setTimeout(() => {
      userCard.append(
        `<img src="images/cards/${card}.png" class="card front" alt="poker-card"/>`
      );
    }, i * 600);
  }
  setTimeout(addCardForComp, 400);
  setTimeout(addCardForComp, 1500);

  //if any player has a "natural 21" or "blackjack", they win immediately
  const compTotal = sumOfCardsVal(compTakenVal);
  const userTotal = sumOfCardsVal(userTakenVal);
  if (userTotal === 21 && compTotal !== 21) {
    showCardForComp();
    setTimeout(() => {
      user.html("User won 🏆");
      score.html(`<h4>${compTotal} - ${userTotal}</h4>`);
      startBtn.css("visibility", "visible");
      startBtn.html("Replay");
    }, 3000);
  } else if (compTotal === 21 && userTotal !== 21) {
    showCardForComp();
    setTimeout(() => {
      comp.html("Computer won 🏆");
      score.html(`<h4>${compTotal} - ${userTotal}</h4>`);
      startBtn.css("visibility", "visible");
      startBtn.html("Replay");
    }, 3000);
  } else if (compTotal === 21 && userTotal === 21) {
    showCardForComp();
    setTimeout(() => {
      score.html(`<h4>${compTotal} - ${userTotal}</h4>`);
      score.append("<h4>It's a Tie 🤝</h4>");
      startBtn.css("visibility", "visible");
      startBtn.html("Replay");
    }, 3000);
  } else {
    //else, once both players have their 2 initial cards, "hit" and "stand" button will appear for user's next step
    setTimeout(() => {
      hitBtn.css("visibility", "visible");
      standBtn.css("visibility", "visible");
    }, 2500);
  }
}

//when user clicks "hit" button
hitBtn.click(() => {
  //user takes a new card and the new card and the value of new card will be added to user's arrays
  takeCard(userTakenCards, userTakenVal);

  //display new card and hide action buttons
  let card = userTakenCards[userTakenCards.length - 1];
  userCard.append(
    `<img src="images/cards/${card}.png" class="card front" alt="poker-card"/>`
  );
});

//when user clicks "stand" button
standBtn.click(() => {
  //action buttons disappear
  hitBtn.css("visibility", "hidden");
  standBtn.css("visibility", "hidden");

  //give comp a common sense to add card when its value is less than 13
  while (sumOfCardsVal(compTakenVal) < 13) {
    takeCard(compTakenCards, compTakenVal);
    setTimeout(addCardForComp, 500);
  }

  //once comp has taken enough cards, the covered side of the cards will be removed and replaced with the front side of the cards
  showCardForComp();

  //
  setTimeout(function () {
    const max = 21;
    const compTotal = sumOfCardsVal(compTakenVal);
    const userTotal = sumOfCardsVal(userTakenVal);
    score.html(`<h4>${compTotal} - ${userTotal}</h4>`);

    //if comp's value larger than user and it's smaller or equal to 21 OR user bursts,  comp wins
    if (
      compTotal === max ||
      (compTotal > userTotal && compTotal <= max) ||
      userTotal > max
    ) {
      comp.html("🏆 Computer won");
      //if user's value larger than comp and it's smaller or equal to 21 OR comp bursts,  user wins
    } else if (
      compTotal === max ||
      (compTotal < userTotal && userTotal <= max) ||
      compTotal > max
    ) {
      user.html("User won 🏆");
      //if both has the same value (blackjack/ burst/ 21 or below), they have a time
    } else {
      score.append("<h4>It's a Tie 🤝</h4>");
    }
    //replay button is shown once the game ends
    startBtn.css("visibility", "visible");
    startBtn.html("Replay");
  }, 3000);
});

/*FUNCTIONS*/

//add new covered card picture to disply
function addCardForComp() {
  compCard.append(
    '<img src="images/poker-card-back.png" class="card back" alt="poker-card"/>'
  );
}

//reveal comp's cards
function showCardForComp() {
  setTimeout(function () {
    compCard.html("");
    for (let card of compTakenCards) {
      compCard.append(
        `<img src="images/cards/${card}.png" class="card front" alt="poker-card"/>`
      );
    }
  }, 2000);
}

// make new deck
function newDeck() {
  //make sure deck is an empty array
  deck.splice();

  //poker cards consist of 13 types of value and 4 types of suit, make a total of 52 different cards
  const cardValue = [2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K", "A"];
  const cardSuit = ["clubs", "spades", "hearts", "diamonds"];

  //add all the 52 cards to deck
  for (let val of cardValue) {
    for (let suit of cardSuit) {
      deck.push(`${val}_of_${suit}`);
    }
  }

  //suffle the deck array
  //reference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

//card is removed from the deck and store in player's array
function takeCard(playerCardArr, playerValArr) {
  //remove 1st card from deck
  const card = deck.shift();
  playerCardArr.push(card);

  let cardVal = card[0];

  //all picture card has value of 10; all card[0] === "1" is also 10 because only 10 starts with "1"
  if (
    cardVal === "1" ||
    cardVal === "J" ||
    cardVal === "Q" ||
    cardVal === "K"
  ) {
    cardVal = 10;
  }
  //cases of A will be taken care in sumOfCardsVal function
  if (cardVal === "A") {
    playerValArr.push(cardVal);
  } else {
    //turn all the cardVal to interger and store in the passed-in value array
    cardVal = parseInt(cardVal);
    playerValArr.push(cardVal);
  }
}

//calculate the sum of cards' value
function sumOfCardsVal(playerCardVal) {
  let sum = 0;
  let sumOfA = 0;

  //loop tru the cards' value and add them together if it's a number
  playerCardVal.forEach((val) => {
    // if it's an A aka a string, record it seperately
    if (typeof val === "string") {
      sumOfA++;
    } else {
      sum += val;
    }
  });

  //A can be either a 1 or 11
  if (sumOfA >= 1) {
    //if the sum already has less or equal to 10, 1 A should be 11 and other As should be 1 in order to meets winning condition (e.g 2As would be 22 and burst already)
    if (sum <= 10) {
      sum += 11 + sumOfA - 1;
      //else, A should be treated as 1 because A as 11 doesn't benefit the value of sum that is 11 or above (e.g 11(sum) + 11(A) = 22 (burst!))
    } else {
      sum += sumOfA;
    }
  }

  return sum;
}
