import { net } from "./net.js";
import { createInput } from "./input.js";
import { createRenderer } from "./renderer.js";

const canvas = document.getElementById("game");
const renderer = createRenderer(canvas);
const readInput = createInput();

const hud = {
  room: document.getElementById("room"),
  turn: document.getElementById("turn"),
  phase: document.getElementById("phase"),
  stones: document.getElementById("stones"),
  blueScore: document.getElementById("blueScore"),
  redScore: document.getElementById("redScore")
};

document.getElementById("throwBtn").onclick = () => net.throwBall();
document.getElementById("stackBtn").onclick = () => net.stackStone();

function updateHud(s) {
  if (!s) return;
  hud.room.textContent = s.code;
  hud.turn.textContent = s.turnTeam;
  hud.phase.textContent = s.phase;
  hud.stones.textContent = s.stonesRemaining;
  hud.blueScore.textContent = s.blueScore;
  hud.redScore.textContent = s.redScore;
}

net.onState = (s) => updateHud(s);

async function start() {
  await net.connect();

  // You can pass data from login page via localStorage
  const roomCode = localStorage.getItem("roomCode") || "PUBLIC";
  const name = localStorage.getItem("name") || "Player";
  const avatar = localStorage.getItem("avatar") || "male_blue";
  const gender = localStorage.getItem("gender") || "any";

  await net.joinRoom({ roomCode, name, avatar, gender });
}

let last = performance.now();
async function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  // send input 15 times per second
  if (net.state) {
    const input = readInput();
    // throttle: simple
    if (!loop._acc) loop._acc = 0;
    loop._acc += dt;
    if (loop._acc > (1/15)) {
      loop._acc = 0;
      net.sendInput(input);
    }
  }

  renderer.render(net.state, dt);
  requestAnimationFrame(loop);
}

start().then(() => requestAnimationFrame(loop));
