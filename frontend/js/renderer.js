export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  const assets = {
    court: new Image(),
    stones: new Image(),
    avatars: {
      male_blue: new Image(),
      female_blue: new Image(),
      male_red: new Image(),
      female_red: new Image()
    }
  };

  // Replace these with your real art files
  assets.court.src = "assets/backgrounds/court.png";
  assets.stones.src = "assets/sprites/stones.png";
  assets.avatars.male_blue.src = "assets/sprites/male_blue.png";
  assets.avatars.female_blue.src = "assets/sprites/female_blue.png";
  assets.avatars.male_red.src = "assets/sprites/male_red.png";
  assets.avatars.female_red.src = "assets/sprites/female_red.png";

  // Simple sprite sheet settings (assume each avatar sheet contains frames in a row)
  const animMap = {
    idle: { y: 0, frames: 6, fps: 8 },
    run:  { y: 1, frames: 8, fps: 12 },
    throw:{ y: 2, frames: 6, fps: 14 },
    stack:{ y: 3, frames: 6, fps: 10 }
  };

  const SPR_W = 96;   // frame width in your spritesheet
  const SPR_H = 96;   // frame height in your spritesheet

  let t = 0;

  function drawStones(count) {
    // Example: draw stone stack based on count
    // You can do per-frame sprites; here we just draw count as stacked circles if sprite not loaded
    const x = 600, y = 350;

    if (assets.stones.complete && assets.stones.naturalWidth > 0) {
      // Suppose stones.png contains different stack frames horizontally: 0..7
      const frame = Math.max(0, Math.min(7, count));
      const fw = assets.stones.naturalWidth / 8;
      const fh = assets.stones.naturalHeight;
      ctx.drawImage(assets.stones, frame * fw, 0, fw, fh, x - 50, y - 70, 100, 140);
    } else {
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(x, y - i * 10, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawPlayer(p, dt) {
    const img = assets.avatars[p.avatar] || assets.avatars.male_blue;
    const anim = animMap[p.anim] || animMap.idle;

    const frame = Math.floor((t * anim.fps) % anim.frames);

    const sx = frame * SPR_W;
    const sy = anim.y * SPR_H;

    ctx.save();
    ctx.translate(p.x, p.y);

    // flip for facing left
    if (p.facing === "left") {
      ctx.scale(-1, 1);
    }

    // shadow
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(0, 35, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, sx, sy, SPR_W, SPR_H, -48, -60, 96, 96);
    } else {
      // fallback rectangle
      ctx.fillRect(-20, -40, 40, 80);
    }

    // name tag
    ctx.font = "14px Arial";
    ctx.fillText(p.name, -30, -70);

    ctx.restore();
  }

  function render(state, dt) {
    t += dt;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // background court
    if (assets.court.complete && assets.court.naturalWidth > 0) {
      ctx.drawImage(assets.court, 0, 0, canvas.width, canvas.height);
    } else {
      // fallback court
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // stones in center
    drawStones(state?.stonesRemaining ?? 7);

    // players
    const players = state?.players || [];
    for (const p of players) drawPlayer(p, dt);
  }

  return { render };
}
