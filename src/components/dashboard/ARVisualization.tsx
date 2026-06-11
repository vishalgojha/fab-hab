import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Glasses, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ARVisualization({ habits }: { habits: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let particles: any[] = [];
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    
    habits.forEach((habit, index) => {
      const baseX = (canvas.offsetWidth / 2) + (index - habits.length / 2) * 80;
      const baseY = canvas.offsetHeight / 2;
      
      const colors: Record<string, string> = {
        health: '#10b981',
        productivity: '#3b82f6',
        mindfulness: '#8b5cf6',
        fitness: '#f97316',
        learning: '#eab308',
        social: '#ec4899',
        creativity: '#6366f1'
      };
      
      const color = colors[habit.category] || '#8b5cf6';
      const size = Math.min(40, 20 + (habit.current_streak || 0) * 2);
      
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: baseX + (Math.random() - 0.5) * 50,
          y: baseY + (Math.random() - 0.5) * 50,
          baseX,
          baseY,
          size: Math.random() * 4 + 2,
          color,
          angle: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.02,
          orbit: size + Math.random() * 20,
          opacity: 0.3 + Math.random() * 0.7
        });
      }
      
      particles.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        size,
        color,
        isCore: true,
        pulse: 0,
        name: habit.name,
        streak: habit.current_streak || 0
      });
    });
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach(p => {
        if (p.isCore) {
          p.pulse += 0.03;
          const scale = 1 + Math.sin(p.pulse) * 0.1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * scale);
          gradient.addColorStop(0, p.color + 'ff');
          gradient.addColorStop(0.7, p.color + '80');
          gradient.addColorStop(1, p.color + '00');
          ctx.fillStyle = gradient;
          ctx.fill();
          
          if (p.streak > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 10, 0, (p.streak / 30) * Math.PI * 2);
            ctx.strokeStyle = p.color + '60';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        } else {
          p.angle += p.speed;
          p.x = p.baseX + Math.cos(p.angle) * p.orbit;
          p.y = p.baseY + Math.sin(p.angle) * p.orbit * 0.5;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
          ctx.fill();
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [habits]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden"
    >
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Glasses className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">AR Preview</span>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
      
      <canvas 
        ref={canvasRef}
        className="w-full h-64"
        style={{ imageRendering: 'crisp-edges' }}
      />
      
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-xs text-slate-400 text-center">
          Habit orbs grow with your streaks • Connect AR glasses for immersive view
        </p>
      </div>
    </motion.div>
  );
}
