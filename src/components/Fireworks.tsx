'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

interface Ember {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  alpha: number;
  color: string;
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Do not animate for users with reduced motion settings
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const embers: Ember[] = [];

    // Initialize floating embers
    const maxEmbers = 25;
    for (let i = 0; i < maxEmbers; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height + height,
        vy: -(Math.random() * 1.2 + 0.4),
        vx: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#E5A93B' : '#F57C00', // Gold or Orange
      });
    }

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    // Create a golden spark burst at (x, y)
    const createBurst = (x: number, y: number) => {
      const particleCount = Math.floor(Math.random() * 40) + 30;
      const baseColor = Math.random() > 0.3 ? '#E5A93B' : '#F57C00'; // Gold or Orange-red

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.6 ? '#FFFDF0' : baseColor, // occasional bright white-gold
        });
      }
    };

    let lastBurstTime = Date.now();
    const burstInterval = 7000; // Trigger burst every 7 seconds

    const animate = () => {
      ctx.fillStyle = 'rgba(11, 11, 12, 0.08)'; // Clear canvas with slight transparency for trail effect
      ctx.fillRect(0, 0, width, height);

      // 1. Update and Draw Embers
      embers.forEach((ember) => {
        ember.y += ember.vy;
        ember.x += ember.vx;
        
        // Wrap around sides
        if (ember.x < 0) ember.x = width;
        if (ember.x > width) ember.x = 0;

        // Reset if ember floats off top
        if (ember.y < -10) {
          ember.y = height + 10;
          ember.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = ember.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = ember.color;
        ctx.fillStyle = ember.color;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Update and Draw Sparks (bursts)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity pull
        p.vx *= 0.98; // air resistance
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Occasional auto burst
      const now = Date.now();
      if (now - lastBurstTime > burstInterval) {
        // Random position in upper half
        const burstX = Math.random() * (width - 200) + 100;
        const burstY = Math.random() * (height * 0.4) + 100;
        createBurst(burstX, burstY);
        lastBurstTime = now;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Trigger an initial burst after 1.5 seconds
    const initialBurstTimer = setTimeout(() => {
      createBurst(width * 0.5, height * 0.25);
    }, 1500);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(initialBurstTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#0B0B0C]"
    />
  );
}
