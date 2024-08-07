import { Player } from "./Player";

// types.ts
export type Vector2D = { x: number; y: number };

export interface GameObject {
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  color: string;
  move(dt: number): void;
}

export interface PlayerObject {
  attack(): void;
}

export interface GameState {
  players: Player[];
}
export type Direction = "left" | "right" | "up" | "down" | "neutral";
export type ToggleKeys =
  | "isFakeOpponent"
  | "isGravity"
  | "isHitboxes"
  | "isCollisions";
export type Toggles = {
  [key in ToggleKeys]: boolean;
};
