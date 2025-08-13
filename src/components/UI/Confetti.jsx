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
    
    // Confetti particles
    const particles = [];
    const particleCount = 150;
    const colors = ['#C72125', '#fbbf24', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: Math.random() * 6 - 3,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        angleVelocity: Math.random() * 10 - 5,
        opacity: 1
      });
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.angleVelocity;
        particle.vy += 0.1; // Gravity
        particle.opacity -= 0.005;
        
        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.angle * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
        
        // Remove particles that are off screen or faded
        if (particle.y > canvas.height || particle.opacity <= 0) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default Confetti;