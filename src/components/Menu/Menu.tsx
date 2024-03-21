import React from "react";

import { ballsBtn } from "../../utils/datas";

import styles from "./Menu.module.css";

export const Menu: React.FC<{
  onColorChange: (color: string) => void;
  position: { left: number; top: number };
}> = React.memo(({ onColorChange, position }) => {
  const handleColorChange = (color: string) => {
    onColorChange(color);
  };

  return (
    <div
      style={{ position: "absolute", left: position.left, top: position.top }}
      className={styles.menu}
    >
      {ballsBtn.map((btn) => {
        return (
          <button key={btn.name} onClick={() => handleColorChange(btn.color)}>
            {btn.name}
          </button>
        );
      })}
    </div>
  );
})
