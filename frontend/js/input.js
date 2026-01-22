export function createInput() {
  const keys = new Set();
  window.addEventListener("keydown", e => keys.add(e.key.toLowerCase()));
  window.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));

  return function readInput() {
    let dx = 0, dy = 0;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;
    if (keys.has("w") || keys.has("arrowup")) dy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dy += 1;

    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;

    return { dx, dy, faceLeft: dx < 0 };
  }
}
