let stones = 7;
let currentPlayer = "Team A";

function throwBall() {
  stones--;
  document.getElementById("status").innerText =
    `${currentPlayer} hit a stone! Remaining: ${stones}`;

  if (stones === 0) {
    alert(currentPlayer + " wins!");
  }
}
