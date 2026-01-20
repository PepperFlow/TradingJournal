// Nebula/Galaxy Background Animation
class NebulaBackground {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.nebulaClouds = [];
        this.time = 0;

        this.resize();
        this.createStars();
        this.createNebulaClouds();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
            this.createNebulaClouds();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        this.stars = [];
        const starCount = 200;

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                twinklePhase: Math.random() * Math.PI * 2,
                brightness: Math.random()
            });
        }
    }

    createNebulaClouds() {
        this.nebulaClouds = [];
        const cloudCount = 8;

        const colors = [
            { r: 102, g: 126, b: 234 },  // Blue-purple
            { r: 118, g: 75, b: 162 },   // Purple
            { r: 245, g: 87, b: 108 },   // Pink
            { r: 56, g: 239, b: 125 },   // Green
            { r: 255, g: 167, b: 81 }    // Orange
        ];

        for (let i = 0; i < cloudCount; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.nebulaClouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 200 + 150,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                color: color,
                opacity: Math.random() * 0.15 + 0.05,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    drawNebulaClouds() {
        this.nebulaClouds.forEach(cloud => {
            // Update position
            cloud.x += cloud.speedX;
            cloud.y += cloud.speedY;

            // Wrap around
            if (cloud.x > this.canvas.width + cloud.radius) cloud.x = -cloud.radius;
            if (cloud.x < -cloud.radius) cloud.x = this.canvas.width + cloud.radius;
            if (cloud.y > this.canvas.height + cloud.radius) cloud.y = -cloud.radius;
            if (cloud.y < -cloud.radius) cloud.y = this.canvas.height + cloud.radius;

            // Pulsing opacity
            const pulse = Math.sin(this.time * cloud.pulseSpeed + cloud.pulsePhase);
            const opacity = cloud.opacity + pulse * 0.05;

            // Create radial gradient
            const gradient = this.ctx.createRadialGradient(
                cloud.x, cloud.y, 0,
                cloud.x, cloud.y, cloud.radius
            );

            gradient.addColorStop(0, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                cloud.x - cloud.radius,
                cloud.y - cloud.radius,
                cloud.radius * 2,
                cloud.radius * 2
            );
        });
    }

    drawStars() {
        this.stars.forEach(star => {
            // Update position
            star.x += star.speedX;
            star.y += star.speedY;

            // Wrap around
            if (star.x > this.canvas.width) star.x = 0;
            if (star.x < 0) star.x = this.canvas.width;
            if (star.y > this.canvas.height) star.y = 0;
            if (star.y < 0) star.y = this.canvas.height;

            // Twinkle effect
            const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinklePhase);
            const alpha = 0.5 + (twinkle + 1) / 2 * 0.5;

            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fill();

            // Add glow for larger stars
            if (star.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.2})`;
                this.ctx.fill();
            }
        });
    }

    animate() {
        // Clear with slight fade for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw nebula clouds first (background)
        this.drawNebulaClouds();

        // Draw stars on top
        this.drawStars();

        this.time += 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NebulaBackground());
} else {
    new NebulaBackground();
}
