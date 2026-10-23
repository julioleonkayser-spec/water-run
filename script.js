// Water Run
// Jump the rocks, grab the jugs, get 12 jugs before the time runs out.

// get things from the page
var scoreDisplay = document.getElementById("score");
var timeDisplay = document.getElementById("time");
var message = document.getElementById("message");
var gameArea = document.getElementById("game-area");
var player = document.getElementById("player");
var startBtn = document.getElementById("start-btn");
var resetBtn = document.getElementById("reset-btn");

// game variables
var score = 0;
var timeLeft = 30;
var goal = 12;
var gameRunning = false;
var isJumping = false;
var items = [];
var timerInterval;
var spawnInterval;
var moveInterval;

// messages for the end of the game
var winMessages = [
  "You did it! You brought clean water home.",
  "Amazing run! Clean water is on its way to the village.",
  "Great job! Every jug counts."
];

var loseMessages = [
  "So close! Try again to bring more water home.",
  "Not enough jugs this time. Hit Start and try again!",
  "Keep going! Jump the rocks and grab more jugs."
];

// start the game
function startGame() {
  if (gameRunning) {
    return;
  }
  resetGame();
  gameRunning = true;
  startBtn.disabled = true;
  message.textContent = "Go! Grab the jugs and jump the rocks!";

  timerInterval = setInterval(countDown, 1000);
  spawnInterval = setInterval(spawnItem, 1100);
  moveInterval = setInterval(moveItems, 20);
}

// reset everything back to the start
function resetGame() {
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  clearInterval(moveInterval);

  gameRunning = false;
  isJumping = false;
  player.classList.remove("jump");

  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  message.textContent = "Press Start. Then click, tap, or press SPACE to jump.";
  startBtn.disabled = false;

  // remove the jugs and rocks that are still on the screen
  for (var i = 0; i < items.length; i++) {
    items[i].remove();
  }
  items = [];

  // remove any confetti
  var pieces = document.querySelectorAll(".confetti");
  for (var j = 0; j < pieces.length; j++) {
    pieces[j].remove();
  }
}

// the timer
function countDown() {
  timeLeft = timeLeft - 1;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

// make a new jug or rock on the right side
function spawnItem() {
  var item = document.createElement("div");

  // 70% jugs, 30% rocks
  if (Math.random() < 0.7) {
    item.className = "item jug";
  } else {
    item.className = "item rock";
  }

  item.style.left = gameArea.offsetWidth + "px";
  gameArea.appendChild(item);
  items.push(item);
}

// move every item to the left and check if the player touched it
function moveItems() {
  var playerBox = player.getBoundingClientRect();

  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i];
    var newLeft = parseInt(item.style.left) - 6;
    item.style.left = newLeft + "px";

    // gone off the screen
    if (newLeft < -50) {
      item.remove();
      items.splice(i, 1);
      continue;
    }

    // did the player touch it?
    var itemBox = item.getBoundingClientRect();
    var touching = playerBox.left < itemBox.right &&
                   playerBox.right > itemBox.left &&
                   playerBox.top < itemBox.bottom &&
                   playerBox.bottom > itemBox.top;

    if (touching) {
      if (item.classList.contains("jug")) {
        score = score + 1;
        message.textContent = "+1 jug! Nice!";
        flashScore("good");
      } else {
        // the rock takes a point away, but not below 0
        if (score > 0) {
          score = score - 1;
        }
        message.textContent = "Ouch, a rock! -1";
        flashScore("bad");
      }
      scoreDisplay.textContent = score;
      item.remove();
      items.splice(i, 1);
    }
  }
}

// make the score green or red for a moment
function flashScore(color) {
  scoreDisplay.className = color;
  setTimeout(function () {
    scoreDisplay.className = "";
  }, 300);
}

// make the player jump
function jump() {
  if (!gameRunning || isJumping) {
    return;
  }
  isJumping = true;
  player.classList.add("jump");

  setTimeout(function () {
    player.classList.remove("jump");
    isJumping = false;
  }, 700);
}

// the game is over
function endGame() {
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  clearInterval(moveInterval);
  gameRunning = false;
  startBtn.disabled = false;

  if (score >= goal) {
    var winIndex = Math.floor(Math.random() * winMessages.length);
    message.textContent = "Score: " + score + ". " + winMessages[winIndex];
    makeConfetti();
  } else {
    var loseIndex = Math.floor(Math.random() * loseMessages.length);
    message.textContent = "Score: " + score + ". " + loseMessages[loseIndex];
  }
}

// confetti when you win
function makeConfetti() {
  var colors = ["#FFC907", "#2E9DF7", "#ffffff", "#4FCB53", "#222222"];

  for (var i = 0; i < 80; i++) {
    var piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 1 + "s";
    document.body.appendChild(piece);
  }

  // take the confetti away after a few seconds
  setTimeout(function () {
    var pieces = document.querySelectorAll(".confetti");
    for (var j = 0; j < pieces.length; j++) {
      pieces[j].remove();
    }
  }, 5000);
}

// buttons
startBtn.addEventListener("click", function () {
  startGame();
  startBtn.blur();
});

resetBtn.addEventListener("click", function () {
  resetGame();
  resetBtn.blur(); // so the space bar still jumps and doesn't press reset
});

// click or tap the game area to jump
gameArea.addEventListener("click", jump);

// space bar or up arrow to jump
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    if (gameRunning) {
      event.preventDefault();
      jump();
    }
  }
});
