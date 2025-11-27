import { PaintParams } from '../types';
import { getColor } from './colorUtils';
import { fractalTree } from './paintLogic';

// ======= LANDSCAPE DEMO =======

export const createStarField = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const stars = 200;
    for (let i = 0; i < stars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${Math.random() * 60 + 200}, 100%, ${70 + Math.random() * 30}%, 0.8)`;
        ctx.fill();
        
        // Shine
        if (Math.random() > 0.7) {
            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${Math.random() * 60 + 200}, 100%, 80%, 0.2)`;
            ctx.fill();
        }
    }
};

export const createMountains = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const mountains = 5;
    const mountainHeight = height * 0.4;
    
    for (let i = 0; i < mountains; i++) {
        const baseX = (i * width) / mountains;
        const peaks = 3 + Math.floor(Math.random() * 3);
        
        ctx.beginPath();
        ctx.moveTo(baseX, height);
        
        for (let p = 0; p < peaks; p++) {
            const peakX = baseX + (p * width) / (mountains * peaks) + Math.random() * 30;
            const peakY = height - mountainHeight * (0.3 + Math.random() * 0.7);
            ctx.lineTo(peakX, peakY);
        }
        
        ctx.lineTo(baseX + width / mountains, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, height - mountainHeight, 0, height);
        gradient.addColorStop(0, getColor(params, 'primary', 0.6, i * 40));
        gradient.addColorStop(1, getColor(params, 'secondary', 0.8, i * 40 + 100));
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }
};

export const createNebula = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const nebulae = 3;
    
    for (let i = 0; i < nebulae; i++) {
        const centerX = width * (0.2 + i * 0.3);
        const centerY = height * 0.3;
        const size = width * 0.2;
        
        // Base Nebula
        for (let layer = 0; layer < 5; layer++) {
            const layerSize = size * (0.3 + layer * 0.15);
            const alpha = 0.3 - layer * 0.05;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, layerSize, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0, 
                centerX, centerY, layerSize
            );
            gradient.addColorStop(0, getColor(params, 'primary', alpha, i * 120 + layer * 30));
            gradient.addColorStop(1, getColor(params, 'secondary', 0, i * 120 + layer * 30));
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Stars in Nebula
        for (let s = 0; s < 20; s++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * size * 0.8;
            const starX = centerX + Math.cos(angle) * distance;
            const starY = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(starX, starY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = getColor(params, 'primary', 0.9, s * 18);
            ctx.fill();
        }
    }
};

export const createRiver = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const startY = height * 0.7;
    
    ctx.beginPath();
    ctx.moveTo(0, startY);
    
    // River Curve
    for (let x = 0; x <= width; x += 20) {
        const y = startY + Math.sin(x * 0.01) * 30;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, startY, 0, height);
    gradient.addColorStop(0, getColor(params, 'primary', 0.7, 200));
    gradient.addColorStop(1, getColor(params, 'secondary', 0.9, 240));
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Reflections
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = startY + 10 + Math.random() * 50;
        const w = 30 + Math.random() * 40;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x + w * 0.3, y + 5,
            x + w * 0.7, y + 5,
            x + w, y
        );
        ctx.strokeStyle = getColor(params, 'primary', 0.4, 180);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
};

export const createTrees = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const trees = 8;
    
    for (let i = 0; i < trees; i++) {
        const x = width * (0.1 + i * 0.1);
        const trunkHeight = 40 + Math.random() * 30;
        const baseY = height * 0.7;
        
        // Trunk
        ctx.beginPath();
        ctx.moveTo(x - 5, baseY);
        ctx.lineTo(x - 3, baseY - trunkHeight);
        ctx.lineTo(x + 3, baseY - trunkHeight);
        ctx.lineTo(x + 5, baseY);
        ctx.closePath();
        ctx.fillStyle = getColor(params, 'secondary', 0.8, 30);
        ctx.fill();
        
        // Crown using fractalTree
        // Temporary override intensity for specific look
        const treeParams = { ...params, intensity: 3 };
        fractalTree(ctx, x, baseY - trunkHeight, 25, 3, treeParams);
    }
};

export const createGalaxy = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const centerX = width * 0.8;
    const centerY = height * 0.25;
    const galaxySize = width * 0.15;
    
    // Core
    ctx.beginPath();
    ctx.arc(centerX, centerY, galaxySize * 0.3, 0, Math.PI * 2);
    const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, galaxySize * 0.3
    );
    coreGradient.addColorStop(0, getColor(params, 'primary', 1, 60));
    coreGradient.addColorStop(1, getColor(params, 'secondary', 0.3, 30));
    ctx.fillStyle = coreGradient;
    ctx.fill();
    
    // Arms
    for (let arm = 0; arm < 2; arm++) {
        const armAngle = arm * Math.PI;
        
        for (let i = 0; i < 50; i++) {
            const progress = i / 50;
            const angle = armAngle + progress * Math.PI * 4;
            const distance = galaxySize * progress;
            const starSize = 1 + progress * 2;
            
            const starX = centerX + Math.cos(angle) * distance;
            const starY = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
            ctx.fillStyle = getColor(params, 'primary', 0.6 + progress * 0.3, progress * 360);
            ctx.fill();
        }
    }
};

export const addFloatingElements = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.6;
        const size = Math.random() * 3 + 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = getColor(params, 'primary', 0.5, i * 12);
        ctx.fill();
        
        // Trail
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = getColor(params, 'secondary', 0.2, i * 12 + 60);
        ctx.fill();
    }
};

// ======= PORTRAIT DEMO =======

export const createFaceOutline = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const faceSize = Math.min(width, height) * 0.3;
    
    // Oval shape
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, faceSize * 0.8, faceSize, 0, 0, Math.PI * 2);
    ctx.strokeStyle = getColor(params, 'primary', 0.8, 0);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Subtle fill
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, faceSize * 0.78, faceSize * 0.95, 0, 0, Math.PI * 2);
    ctx.fillStyle = getColor(params, 'secondary', 0.1, 180);
    ctx.fill();
};

export const addEyes = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const eyeSpacing = 60;
    
    [-1, 1].forEach((side, index) => {
        const eyeX = centerX + (side * eyeSpacing);
        const eyeY = centerY - 20;
        
        // Outer eye
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 15, 0, Math.PI * 2);
        ctx.strokeStyle = getColor(params, 'primary', 0.9, index * 60);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Iris
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 8, 0, Math.PI * 2);
        ctx.fillStyle = getColor(params, 'primary', 0.7, index * 60 + 120);
        ctx.fill();
        
        // Pupil
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = getColor(params, 'secondary', 0.9, index * 60 + 180);
        ctx.fill();
        
        // Shine
        ctx.beginPath();
        ctx.arc(eyeX - 2, eyeY - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
};

export const addHair = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const hairStartY = centerY - 80;
    
    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const baseDistance = 70;
        const variation = Math.sin(angle * 5) * 15;
        const distance = baseDistance + variation;
        
        const hairX = centerX + Math.cos(angle) * distance;
        const hairY = hairStartY + Math.sin(angle) * distance * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(centerX, hairStartY);
        ctx.lineTo(hairX, hairY);
        ctx.strokeStyle = getColor(params, 'primary', 0.6, i * 7);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
};

export const addFacialFeatures = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Nose
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 10);
    ctx.lineTo(centerX, centerY + 20);
    ctx.strokeStyle = getColor(params, 'secondary', 0.8, 30);
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Mouth
    ctx.beginPath();
    ctx.arc(centerX, centerY + 40, 25, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = getColor(params, 'primary', 0.9, 0);
    ctx.lineWidth = 3;
    ctx.stroke();
};

export const addAura = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let layer = 0; layer < 3; layer++) {
        const size = 120 + layer * 20;
        const alpha = 0.3 - layer * 0.1;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.strokeStyle = getColor(params, 'primary', alpha, layer * 40);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Particles
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const particleX = centerX + Math.cos(angle) * size;
            const particleY = centerY + Math.sin(angle) * size;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fillStyle = getColor(params, 'secondary', 0.7, i * 30);
            ctx.fill();
        }
    }
};

export const addBackgroundPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, params: PaintParams) => {
    const patternSize = 40;
    
    for (let x = 0; x < width; x += patternSize) {
        for (let y = 0; y < height; y += patternSize) {
            if ((x + y) % (patternSize * 2) === 0) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = getColor(params, 'primary', 0.2, (x + y) * 0.5);
                ctx.fill();
            }
        }
    }
    
    // Connections
    for (let i = 0; i < 20; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const endX = Math.random() * width;
        const endY = Math.random() * height;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = getColor(params, 'secondary', 0.1, i * 18);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
};