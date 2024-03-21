import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IBilliardProps } from "./Billiard.types";
import { Menu } from "../Menu";

import styles from "./Billiard.module.css";
import { drawBall, updateBalls } from "../../utils/helpers";
import { ballsParams } from "../../utils/datas";

export const Billiard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [balls, setBalls] = useState<Array<IBilliardProps>>([]);
    const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(
      null
    );
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
  
    const update = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach((ball) =>
          drawBall(ctx, ball.x, ball.y, ball.radius, ball.color)
        );
      };
  
      updateBalls(balls, canvas);
      draw();
      requestAnimationFrame(update);
    }, [balls]);
  
    const handleBallClick = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;
  
        const clickedBallIndex = balls.findIndex((ball) => {
          const dx = ball.x - mouseX;
          const dy = ball.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= ball.radius;
        });
  
        if (clickedBallIndex !== -1) {
          setSelectedBallIndex(clickedBallIndex);
          setMenuPosition({ x: mouseX, y: mouseY });
        }
      },
      [balls]
    );
  
    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;
  
        balls.forEach((ball) => {
          const dx = mouseX - ball.x;
          const dy = mouseY - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < 100) {
            ball.vx -= dx * 0.003;
            ball.vy -= dy * 0.003;
          }
  
          if (
            ball.x + ball.vx < ball.radius ||
            ball.x + ball.vx > canvasRef.current!.width - ball.radius
          ) {
            ball.vx *= -1;
          }
          if (
            ball.y + ball.vy < ball.radius ||
            ball.y + ball.vy > canvasRef.current!.height - ball.radius
          ) {
            ball.vy *= -1;
          }
        });
      },
      [balls]
    );
  
    const handleColorChange = useCallback(
      (color: string) => {
        if (selectedBallIndex !== null) {
          const newBalls = [...balls];
          newBalls[selectedBallIndex].color = color;
          setBalls(newBalls);
          setSelectedBallIndex(null);
        }
      },
      [balls, selectedBallIndex]
    );
  
    const initialBalls = useMemo(() => ballsParams, []);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
  
      setBalls(initialBalls);
    }, [initialBalls]);
  
    useEffect(() => {
      update();
    }, [update]);
  
    return (
      <div className={styles.wrapper}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={800}
          height={600}
          onMouseDown={handleBallClick}
          onMouseMove={handleMouseMove}
        />
        {selectedBallIndex !== null && (
          <Menu
            onColorChange={handleColorChange}
            position={{ left: menuPosition.x, top: menuPosition.y }}
          />
        )}
      </div>
    );
  };
