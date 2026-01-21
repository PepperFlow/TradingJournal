// Electric Lightning Bolts Background
class ElectricLightning {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lightningBolts = [];
        this.particles = [];
        this.time = 0;

        this.resize();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createLightningBolt() {
        const colors = [
            { r: 102, g: 126, b: 234 },  // Electric blue
            { r: 0, g: 242, b: 254 },    // Cyan
            { r: 138, g: 43, b: 226 },   // Purple
            { r: 56, g: 239, b: 125 }    // Green
        ];

        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * this.canvas.width;
        const startY = 0;
        const endX = Math.random() * this.canvas.width;
        const endY = this.canvas.height;

        const segments = [];
        const numSegments = 15 + Math.floor(Math.random() * 10);

        let currentX = startX;
        let currentY = startY;

        for (let i = 0; i < numSegments; i++) {
            const nextX = currentX + (Math.random() - 0.5) * 100;
            const nextY = currentY + (endY - startY) / numSegments;

            segments.push({
                x1: currentX,
                y1: currentY,
                x2: nextX,
                y2: nextY
            });

            currentX = nextX;
            currentY = nextY;
        }

        // Force last segment to end point
        segments[segments.length - 1].x2 = endX;
        segments[segments.length - 1].y2 = endY;

        return {
            segments,
            color,
            life: 1.0,
            decay: 0.05 + Math.random() * 0.05,
            thickness: 2 + Math.random() * 3,
            glowIntensity: 0.8 + Math.random() * 0.4
        };
    }

    createBranchBolt(parentBolt, segmentIndex) {
        const segment = parentBolt.segments[segmentIndex];
        const branches = [];

        // 30% chance to create branch
        if (Math.random() < 0.3) {
            const numBranches = 1 + Math.floor(Math.random() * 2);

            for (let i = 0; i < numBranches; i++) {
                const branchSegments = [];
                const branchLength = 3 + Math.floor(Math.random() * 5);

                let currentX = segment.x1;
                let currentY = segment.y1;

                for (let j = 0; j < branchLength; j++) {
                    const nextX = currentX + (Math.random() - 0.5) * 80;
                    const nextY = currentY + Math.random() * 50;

                    branchSegments.push({
                        x1: currentX,
                        y1: currentY,
                        x2: nextX,
                        y2: nextY
                    });

                    currentX = nextX;
                    currentY = nextY;
                }

                branches.push({
                    segments: branchSegments,
                    color: parentBolt.color,
                    life: parentBolt.life * 0.7,
                    decay: parentBolt.decay * 1.5,
                    thickness: parentBolt.thickness * 0.6,
                    glowIntensity: parentBolt.glowIntensity * 0.8
                });
            }
        }

        return branches;
    }

    drawLightning(bolt) {
        const { segments, color, life, thickness, glowIntensity } = bolt;

        segments.forEach((segment, index) => {
            // Main lightning bolt
            this.ctx.save();
            this.ctx.shadowBlur = 20 * glowIntensity * life;
            this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${life})`;
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${life})`;
            this.ctx.lineWidth = thickness;
            this.ctx.lineCap = 'round';

            this.ctx.beginPath();
            this.ctx.moveTo(segment.x1, segment.y1);
            this.ctx.lineTo(segment.x2, segment.y2);
            this.ctx.stroke();
            this.ctx.restore();

            // Outer glow
            this.ctx.save();
            this.ctx.shadowBlur = 40 * glowIntensity * life;
            this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${life * 0.3})`;
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${life * 0.3})`;
            this.ctx.lineWidth = thickness * 3;

            this.ctx.beginPath();
            this.ctx.moveTo(segment.x1, segment.y1);
            this.ctx.lineTo(segment.x2, segment.y2);
            this.ctx.stroke();
            this.ctx.restore();

            // Create branches
            if (index % 3 === 0 && life > 0.8) {
                const branches = this.createBranchBolt(bolt, index);
                branches.forEach(branch => {
                    this.lightningBolts.push(branch);
                });
            }
        });
    }

    animate() {
        // Dark fade for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Random chance to create new lightning
        if (Math.random() < 0.05) {
            this.lightningBolts.push(this.createLightningBolt());
        }

        // Update and draw lightning bolts
        this.lightningBolts = this.lightningBolts.filter(bolt => {
            bolt.life -= bolt.decay;

            if (bolt.life > 0) {
                this.drawLightning(bolt);
                return true;
            }
            return false;
        });

        this.time += 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ElectricLightning());
} else {
    new ElectricLightning();
}
