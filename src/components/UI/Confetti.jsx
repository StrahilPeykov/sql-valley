import React, { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

const Confetti = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fewer, more subtle particles
    const particles = [];
    const particleCount = 50; // Reduced from 150
    const colors = ['#C72125', '#22c55e', '#60a5fa']; // TU/e red + complementary colors
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        angleVelocity: Math.random() * 6 - 3,
        opacity: 0.8
      });
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.angleVelocity;
        particle.vy += 0.05; // Less gravity
        particle.opacity -= 0.003;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.angle * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
        
        if (particle.y > canvas.height || particle.opacity <= 0) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default Confetti;