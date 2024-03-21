import { IBilliardProps } from "../components/Billiard/Billiard.types";

export const drawBall = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};

export const updateBalls = (balls: IBilliardProps[], canvas: HTMLCanvasElement) => {
    balls.forEach((ball) => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.vx *= -0.9;
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.vy *= -0.9;
        }

        balls.forEach((otherBall) => {
            if (ball !== otherBall) {
                const dx = otherBall.x - ball.x;
                const dy = otherBall.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = ball.radius + otherBall.radius;

                if (distance < minDistance) {
                    const angle = Math.atan2(dy, dx);
                    const targetX = ball.x + Math.cos(angle) * minDistance;
                    const targetY = ball.y + Math.sin(angle) * minDistance;
                    const ax = (targetX - otherBall.x) * 0.1;
                    const ay = (targetY - otherBall.y) * 0.1;
                    ball.vx -= ax;
                    ball.vy -= ay;
                    ball.vx *= 0.9;
                    ball.vy *= 0.9;
                }
            }
        });
    });
};