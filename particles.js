// Bokeh Light Particles Background
class BokehParticles {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.time = 0;

        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = 35;

        const colors = [
            { r: 102, g: 126, b: 234, name: 'blue' },      // Primary blue
            { r: 118, g: 75, b: 162, name: 'purple' },     // Purple
            { r: 56, g: 239, b: 125, name: 'green' },      // Success green
            { r: 245, g: 87, b: 108, name: 'pink' },       // Danger pink
            { r: 255, g: 167, b: 81, name: 'orange' }      // Warning orange
        ];

        for (let i = 0; i < particleCount; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 80 + 40,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: color,
                opacity: Math.random() * 0.3 + 0.1,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
                blur: Math.random() * 20 + 10
            });
        }
    }

    drawBokeh(particle) {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x > this.canvas.width + particle.size) {
            particle.x = -particle.size;
        }
        if (particle.x < -particle.size) {
            particle.x = this.canvas.width + particle.size;
        }
        if (particle.y > this.canvas.height + particle.size) {
            particle.y = -particle.size;
        }
        if (particle.y < -particle.size) {
            particle.y = this.canvas.height + particle.size;
        }

        // Pulsing effect
        const pulse = Math.sin(this.time * particle.pulseSpeed + particle.pulsePhase);
        const currentOpacity = particle.opacity + pulse * 0.1;
        const currentSize = particle.size + pulse * 10;

        // Save context for individual blur
        this.ctx.save();

        // Apply blur effect
        this.ctx.filter = `blur(${particle.blur}px)`;

        // Create radial gradient for bokeh effect
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, currentSize
        );

        // Bokeh circle has bright center and fades out
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${currentOpacity * 1.2})`);
        gradient.addColorStop(0.4, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);

        // Draw bokeh circle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Add subtle ring effect for more realistic bokeh
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, currentSize * 0.7, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.3})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    animate() {
        // Clear canvas with slight fade
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all bokeh particles
        this.particles.forEach(particle => {
            this.drawBokeh(particle);
        });

        this.time += 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BokehParticles());
} else {
    new BokehParticles();
}
