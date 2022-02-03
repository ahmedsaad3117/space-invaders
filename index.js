const scoreElm = document.querySelector("#scoreElm");
const canves = document.querySelector("canvas");
const ctx = canves.getContext("2d");

canves.width = 1400;
canves.height = 650;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 7;
    this.rotation = 0;
    this.fades = 1;

    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;

      this.position = {
        x: canves.width / 2 - this.width,
        y: canves.height - this.height - 20,
      };
    };
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.fades;
    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    ctx.rotate(this.rotation);

    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    ctx.restore();
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 7;

    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;

      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shot(invdaerProjectils) {
    invdaerProjectils.push(
      new InvdaerProjectil({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 4;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class InvdaerProjectil {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 5;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };

    this.invaders = [];

    const rows = Math.floor(Math.random() * 5 + 10);
    const col = Math.floor(Math.random() * 5 + 5);

    this.width = rows * 30;
    this.height = col * 30;

    for (let i = 0; i < rows; i++) {
      for (let y = 0; y < col; y++) {
        this.invaders.push(new Invader({ position: { x: i * 30, y: y * 30 } }));
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canves.width || this.position.x < 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

class Particle {
  constructor({ position, velocity, color, radius, fade }) {
    this.position = position;
    this.velocity = velocity;

    this.color = color;
    this.radius = radius;
    this.opacity = 1;
    this.fade = fade;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fade) this.opacity -= 0.01;
  }
}

let frame = 0;
let randomIntervel = Math.floor(Math.random() * 500 + 500);
let score = 0 ;


const player = new Player();
const projectiles = [];
const grads = [];
const invdaerProjectils = [];
const particles = [];
const stars = [];
let game = {
  over: false,
  active: true
};

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
};

for (let i = 0; i <= 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canves.width,
        y: Math.random() * canves.height,
      },
      velocity: { x: 0, y: 0.5 },
      color: "white",
      radius: Math.random() * 2,
    })
  );
}

function createPartcils({ opj, color }) {
  for (let i = 0; i <= 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: opj.position.x + opj.width / 2,
          y: opj.position.y + opj.height / 2,
        },
        velocity: { x: Math.random() - 0.5, y: Math.random() - 0.5 },
        color: color || "#BAA0DE",
        radius: 2,
        fade: true,
      })
    );
  }
}


function animate() {
  if(!game.active) return; 
  requestAnimationFrame(animate);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canves.width, canves.height);

  stars.forEach((star) => {
    star.update();
  });

  player.update();

  invdaerProjectils.forEach((invdaerProjectil, index) => {
    invdaerProjectil.update();

    if (invdaerProjectil.position.y > canves.height) {
      invdaerProjectils.splice(index, 1);
    }

    if (
      invdaerProjectil.position.y + invdaerProjectil.height >=
        player.position.y &&
      invdaerProjectil.position.x < player.position.x + player.width &&
      invdaerProjectil.position.x > player.position.x
    ) {
      createPartcils({ opj: player, color: "white" });
      player.fades = 0;
      game.over = true;
      setTimeout(()=>{
        game.active = false
      },1000)
    }
  });

  // enamy expotion
  particles.forEach((particle, index) => {
    if (particle.position.y > canves.height) {
      particle.position.x = Math.random() * canves.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  grads.forEach((grad, gradIndex) => {
    grad.update();

    if (frame % 100 === 0 && grad.invaders.length > 0) {
      grad.invaders[Math.floor(Math.random() * grad.invaders.length)].shot(
        invdaerProjectils
      );
    }

    grad.invaders.forEach((invader, index) => {
      invader.update({ velocity: grad.velocity });
      projectiles.forEach((projectile, proIndex) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const projectilFound = projectiles.find((projectile2) => {
              return projectile2 === projectile;
            });
            const invaderFound = grad.invaders.find((invader2) => {
              return invader2 === invader;
            });
            if (projectilFound && invaderFound) {
              createPartcils({ opj: invader });
              score += 100

              scoreElm.innerHTML = score

              grad.invaders.splice(index, 1);
              projectiles.splice(proIndex, 1);

              const fristInvader = grad.invaders[0];
              const lastInvader = grad.invaders[grad.invaders.length - 1];
              if (grad.invaders.length > 0) {
                grad.width =
                  lastInvader.position.x - fristInvader.position.x + 30;
                grad.position.x = fristInvader.position.x;
              } else {
                grads.splice(gradIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y <= 0) {
      projectiles.splice(index, 1);
    } else {
      projectile.update();
    }
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -player.speed;
    player.rotation = -0.35;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canves.width
  ) {
    player.velocity.x = player.speed;
    player.rotation = 0.35;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  if (keys.w.pressed && player.position.y > 0) {
    player.velocity.y = -player.speed;
  } else if (
    keys.s.pressed &&
    player.position.y + player.height < canves.height
  ) {
    player.velocity.y = player.speed;
  } else {
    player.velocity.y = 0;
  }

  if (frame % randomIntervel == 0) {
    grads.push(new Grid());
    randomIntervel = Math.floor(Math.random() * 500 + 500);
    frame = 0;
  }

  frame++;
}

animate();

addEventListener("keydown", ({ key }) => {
  if (game.over) return
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "w":
      keys.w.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case " ":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: { x: 0, y: -10 },
        })
      );
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case " ":
      break;
  }
});
