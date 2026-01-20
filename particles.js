// Manga Halftone Dots Background
class MangaHalftone {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.time = 0;

        this.resize();
        this.createDots();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.createDots();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDots() {
        this.dots = [];
        const spacing = 30; // Space between dots
        const cols = Math.ceil(this.canvas.width / spacing);
        const rows = Math.ceil(this.canvas.height / spacing);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * spacing + spacing / 2;
                const y = row * spacing + spacing / 2;

                // Calculate distance from center for radial pattern
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const distanceFromCenter = Math.sqrt(
                    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                );

                this.dots.push({
                    x,
                    y,
                    baseSize: 2,
                    maxSize: 8,
                    distanceFromCenter,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.02 + Math.random() * 0.01
                });
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.dots.forEach(dot => {
            // Animate size based on sine wave and distance from center
            const wave1 = Math.sin(this.time * dot.speed + dot.phase);
            const wave2 = Math.sin(dot.distanceFromCenter * 0.01 + this.time * 0.02);
            const sizeFactor = (wave1 + 1) / 2 * (wave2 + 1) / 2;

            const size = dot.baseSize + (dot.maxSize - dot.baseSize) * sizeFactor;

            // Calculate opacity based on size
            const opacity = 0.1 + sizeFactor * 0.15;

            // Draw dot
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${opacity})`;
            this.ctx.fill();

            // Add occasional purple dots for variation
            if (Math.random() > 0.85) {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, size * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(118, 75, 162, ${opacity * 0.8})`;
                this.ctx.fill();
            }
        });

        this.time += 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MangaHalftone());
} else {
    new MangaHalftone();
}
