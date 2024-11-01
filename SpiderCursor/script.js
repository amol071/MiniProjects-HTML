const canvas = document.getElementById('web-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle density (e.g., one particle per 15,000 pixels)
const particleDensity = 15000;

// Array to store particles
let particles = [];

// Variables to store mouse position
const mouse = {
    x: null,
    y: null,
    radius: 150 // Radius of effect around the cursor
};

// Update mouse position on mouse move
document.addEventListener('mousemove', (event) => {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
});

// Handle canvas resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Reinitialize particles on resize
});

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1; // Random particle size
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1; // Density for movement effect
    }

    // Draw particle
    draw() {
        ctx.fillStyle = '#ffffff'; // White color for particles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    // Update particle position
    update() {
        // Calculate distance between mouse and particle
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move particles toward or away from cursor
        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Return particles to original position
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }

        this.draw();
    }
}

// Initialize particles based on screen size
function initParticles() {
    particles = []; // Reset the particle array
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / particleDensity);
    for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

// Draw connecting lines between particles and the mouse if close enough
function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If particles are close enough, draw a line between them
            if (distance < 100) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`; // Adjust opacity with distance
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // Connect particles to the mouse if close enough
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < mouse.radius) {
            // Make the line more visible by increasing line width and setting a bright color
            ctx.strokeStyle = `rgba(255, 0, 0, ${1 - distanceToMouse / mouse.radius})`; // Red color, with opacity fading with distance
            ctx.lineWidth = 1.5; // Thicker line for visibility
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

// Animation loop to update and draw particles
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => particle.update());
    connectParticles();
    requestAnimationFrame(animate);
}

// Start animation and initialize particles
initParticles();
animate();
