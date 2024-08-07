import { Direction, GameObject, Vector2D } from "./types";

export class Player implements GameObject {
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  color: string;
  isAttacking: boolean = false;
  attackCooldown: number = 0;
  attackDuration: number = 0.2; // 200ms
  attackCooldownTime: number = 0.25; // 500ms
  attackDirection: Direction = "neutral";
  movingDirection: "left" | "right" | "up" | "down" | "neutral" = "neutral";

  constructor(x: number, y: number, color: string) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.size = 20;
    this.color = color;
  }

  move(dt: number) {
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  attack(direction: Direction) {
    if (this.attackCooldown <= 0 && !this.isAttacking) {
      this.isAttacking = true;
      this.attackCooldown = this.attackCooldownTime;
      this.attackDirection = direction;
    }
  }

  updateMovementDirection(keys: { [key: string]: boolean }, player: Player) {
    if (keys["a"]) {
      player.movingDirection = "left";
    } else if (keys["d"]) {
      player.movingDirection = "right";
    } else if (keys["w"]) {
      player.movingDirection = "up";
    } else if (keys["s"]) {
      player.movingDirection = "down";
    } else {
      player.movingDirection = "neutral";
    }
  }

  update(dt: number) {
    console.log(this.attackCooldown);
    this.move(dt);
    if (this.isAttacking) {
      this.attackDuration -= dt;
      if (this.attackDuration <= 0) {
        this.isAttacking = false;
        this.attackDuration = 0.2;
      }
    }
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    if (this.isAttacking) this.drawAttack(ctx);
  }

  drawAttack(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "yellow";
    if (this.attackDirection === "right") {
      ctx.fillRect(
        this.position.x + this.size,
        this.position.y,
        this.size / 2,
        this.size,
      );
    } else if (this.attackDirection === "left") {
      ctx.fillRect(
        this.position.x - this.size / 2,
        this.position.y,
        this.size / 2,
        this.size,
      );
    } else if (this.attackDirection === "up") {
      ctx.fillRect(
        this.position.x,
        this.position.y - this.size / 2,
        this.size,
        this.size / 2,
      );
    } else if (this.attackDirection === "down") {
      ctx.fillRect(
        this.position.x,
        this.position.y + this.size,
        this.size,
        this.size / 2,
      );
    } else if (this.attackDirection === "neutral") {
      ctx.fillRect(
        this.position.x - 2,
        this.position.y - 2,
        this.size + 4,
        this.size + 4,
      );
    }
    return;
  }

  getAttackHitbox(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null {
    if (this.isAttacking) {
      return {
        x: this.position.x + this.size,
        y: this.position.y,
        width: this.size / 2,
        height: this.size,
      };
    }
    return null;
  }
}
