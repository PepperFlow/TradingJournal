// Liquid Wave Background Animation
class LiquidWaves {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.time = 0;

        this.resize();
        this.createWaves();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createWaves() {
        // Create multiple wave layers with different properties
        this.waves = [
            {
                y: this.canvas.height * 0.3,
                length: 0.01,
                amplitude: 80,
                frequency: 0.015,
                speed: 0.02,
                color: 'rgba(102, 126, 234, 0.1)'
            },
            {
                y: this.canvas.height * 0.4,
                length: 0.015,
                amplitude: 60,
                frequency: 0.02,
                speed: 0.015,
                color: 'rgba(118, 75, 162, 0.08)'
            },
            {
                y: this.canvas.height * 0.5,
                length: 0.02,
                amplitude: 100,
                frequency: 0.01,
                speed: 0.025,
                color: 'rgba(102, 126, 234, 0.06)'
            },
            {
                y: this.canvas.height * 0.65,
                length: 0.012,
                amplitude: 70,
                frequency: 0.018,
                speed: 0.01,
                color: 'rgba(118, 75, 162, 0.05)'
            }
        ];
    }

    drawWave(wave, time) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);

        for (let x = 0; x < this.canvas.width; x++) {
            const y = wave.y +
                Math.sin(x * wave.length + time * wave.speed) * wave.amplitude +
                Math.sin(x * wave.frequency + time * wave.speed * 1.5) * (wave.amplitude * 0.5);

            if (x === 0) {
                this.ctx.lineTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();

        this.ctx.fillStyle = wave.color;
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw waves from back to front
        this.waves.forEach(wave => {
            this.drawWave(wave, this.time);
        });

        this.time += 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new LiquidWaves());
} else {
    new LiquidWaves();
}
