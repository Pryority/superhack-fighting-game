import { Game } from "./Game";
import { ToggleKeys, Toggles } from "./types";

export class DevTools {
  private toggles: Toggles = {
    isFakeOpponent: true,
    isGravity: true,
    isHitboxes: false,
    isCollisions: true,
  };

  constructor(private game: Game) {
    this.createUI();
  }

  private createUI() {
    const devToolsDiv = document.createElement("div");
    devToolsDiv.style.position = "absolute";
    devToolsDiv.style.top = "10px";
    devToolsDiv.style.left = "10px";
    devToolsDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    devToolsDiv.style.padding = "10px";
    devToolsDiv.style.borderRadius = "5px";
    devToolsDiv.style.color = "white";

    (Object.keys(this.toggles) as ToggleKeys[]).forEach((toggle) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "5px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = this.toggles[toggle];
      checkbox.addEventListener("change", () => {
        this.toggles[toggle] = checkbox.checked;
        this.game.updateGameState(this.toggles);
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${toggle}`));
      devToolsDiv.appendChild(label);
    });

    document.body.appendChild(devToolsDiv);
  }

  public getToggle(key: ToggleKeys): boolean {
    return this.toggles[key];
  }

  public setToggle(key: ToggleKeys, value: boolean): void {
    this.toggles[key] = value;
  }

  public getToggles(): { [key in ToggleKeys]: boolean } {
    return this.toggles;
  }
}
