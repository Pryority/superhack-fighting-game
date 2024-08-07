import { DevTools } from "./Devtools";
import { Player } from "./Player";
import { GameObject, GameState, Toggles } from "./types";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private keys: { [key: string]: boolean } = {};
  private gameState: GameState;
  private toggles: { [key: string]: boolean } = {};
  private devTools: DevTools;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;

    this.gameState = {
      players: [
        new Player(200, ctx.canvas.height / 4, "red"),
        new Player(600, ctx.canvas.height / 4, "blue"),
      ],
    };

    this.init();
    this.setupEventListeners();
    this.devTools = new DevTools(this);
    this.updateGameState(this.devTools.getToggles());
    this.gameLoop();

    window.addEventListener("resize", () => this.onResize());
    this.onResize();
  }

  private init() {
    this.resizeCanvas();
  }

  private setupEventListeners() {
    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
  }

  private update(dt: number) {
    const SPEED = 200;
    const GAMESTATE = this.gameState;
    const P1 = GAMESTATE.players[0];
    const P2 = GAMESTATE.players[1];
    const KEY = this.keys;

    // Player 1 controls
    P1.velocity.x = 0;
    P1.velocity.y = 0;
    P1.updateMovementDirection(KEY, P1);
    if (KEY["a"]) P1.velocity.x = -SPEED;
    if (KEY["d"]) P1.velocity.x = SPEED;
    if (KEY["w"]) P1.velocity.y = -SPEED;
    if (KEY["s"]) P1.velocity.y = SPEED;
    if (KEY[" "]) P1.attack(P1.movingDirection);

    // Player 2 controls
    if (this.toggles.isFakeOpponent) {
      P2.velocity.x = 0;
      P2.velocity.y = 0;
      P2.updateMovementDirection(KEY, P2);
      if (KEY["ArrowLeft"]) P2.velocity.x = -SPEED;
      if (KEY["ArrowRight"]) P2.velocity.x = SPEED;
      if (KEY["ArrowUp"]) P2.velocity.y = -SPEED;
      if (KEY["ArrowDown"]) P2.velocity.y = SPEED;
      if (KEY["Enter"]) P2.attack(P2.movingDirection);
    }

    if (this.toggles.isGravity) {
      const GRAVITY = 9.8 * 50;
      GAMESTATE.players.forEach((player) => {
        player.velocity.y += GRAVITY * dt;
      });
    }

    GAMESTATE.players.forEach((player) => {
      player.update(dt);

      const floor = this.canvas.height - player.size;
      if (player.position.y > floor) player.position.y = floor;
    });

    this.checkCollisions();
  }

  private checkCollisions() {
    const [P1, P2] = this.gameState.players;
    const P1Hitbox = P1.getAttackHitbox();
    const P2Hitbox = P2.getAttackHitbox();

    if (P1Hitbox && this.isColliding(P2, P1Hitbox)) {
      console.log("Player 1 hit Player 2!");
    }

    if (P2Hitbox && this.isColliding(P1, P2Hitbox)) {
      console.log("Player 2 hit Player 1!");
    }
  }

  private isColliding(
    player: GameObject,
    hitbox: { x: number; y: number; width: number; height: number },
  ) {
    return (
      player.position.x < hitbox.x + hitbox.width &&
      player.position.x + player.size > hitbox.x &&
      player.position.y < hitbox.y + hitbox.height &&
      player.position.y + player.size > hitbox.y
    );
  }

  updateGameState(toggles: Toggles) {
    const GAMESTATE = this.gameState;
    console.log("Updating game state with toggles:", toggles);

    if (!toggles.isFakeOpponent) {
      GAMESTATE.players[1].position = { x: 600, y: 300 };
      GAMESTATE.players[1].velocity = { x: 0, y: 0 };
    }

    if (!toggles.isGravity) {
      GAMESTATE.players.forEach((player) => {
        player.velocity.y = 0;
      });
    }

    this.toggles = toggles;
    console.log(this.toggles);
    console.log(GAMESTATE);
  }

  private draw() {
    const CANVAS = this.canvas;
    const GAMESTATE = this.gameState;
    const C = this.ctx;

    C.clearRect(0, 0, CANVAS.width, CANVAS.height);
    GAMESTATE.players.forEach((player) => {
      player.draw(C);
    });

    if (this.devTools.getToggles().isHitboxes) {
      this.drawHitboxes();
    }
  }

  private drawHitboxes() {
    const C = this.ctx;
    C.strokeStyle = "yellow";
    C.lineWidth = 2;
    this.gameState.players.forEach((player, index) => {
      if (index === 0 || this.devTools.getToggles().isFakeOpponent) {
        C.strokeRect(
          player.position.x,
          player.position.y,
          player.size,
          player.size,
        );
      }
    });
  }

  private gameLoop(timestamp: number = 0) {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private resizeCanvas() {
    const aspectRatio = 16 / 9;
    const width = window.innerWidth;
    const height = window.innerHeight;

    let newWidth = width;
    let newHeight = width / aspectRatio;

    if (newHeight > height) {
      newHeight = height;
      newWidth = height * aspectRatio;
    }

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width *= dpr;
    this.canvas.height *= dpr;
    this.ctx.scale(dpr, dpr);
  }

  private onResize() {
    this.resizeCanvas();
    this.updateGameState(this.devTools.getToggles());
  }
}
