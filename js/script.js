const initScrollAnimations = () => {
    const faders = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(faders).indexOf(entry.target);
                const delay = index * 70;

                setTimeout(() => {
                    entry.target.classList.add('show');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    faders.forEach(fader => observer.observe(fader));
};

const initAccordions = () => {
    const toggles = document.querySelectorAll('.ielts-toggle');
    
    toggles.forEach(toggle => {
        const content = toggle.nextElementSibling;

        toggle.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
        content.style.opacity = '0';

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            toggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                    const otherContent = otherToggle.nextElementSibling;
                    otherContent.style.maxHeight = '0';
                    otherContent.style.opacity = '0';
                }
            });

            if (isExpanded) {
                toggle.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
                content.style.opacity = '0';
            } else {
                toggle.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
            }
        });
    });
};

const initNavHighlighting = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active', 'bg-cyan-600', 'border-cyan-500');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active', 'bg-cyan-600', 'border-cyan-500');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-80px 0px -20% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
};

const initSmoothScroll = () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initAccordions();
    initNavHighlighting();
    initSmoothScroll();
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const faders = document.querySelectorAll('.fade-in');
        faders.forEach(fader => fader.classList.remove('show'));
        setTimeout(initScrollAnimations, 100);
    }
});

window.addEventListener('resize', () => {
    const expandedToggles = document.querySelectorAll('.ielts-toggle[aria-expanded="true"]');
    expandedToggles.forEach(toggle => {
        const content = toggle.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + 'px';
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += this.directionX;
            this.y += this.directionY;

            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        const numberOfParticles = (canvas.height * canvas.width) / 15000; 
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((innerWidth - size * 2) - size * 2)) + size * 2;
            const y = (Math.random() * ((innerHeight - size * 2) - size * 2)) + size * 2;
            const directionX = (Math.random() * 0.4) - 0.2;
            const directionY = (Math.random() * 0.4) - 0.2;
            const color = 'rgba(10, 102, 194, 0.5)'; 
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const distance = ((particlesArray[a].x - particlesArray[b].x) ** 2 + (particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    ctx.strokeStyle = `rgba(10, 102, 194, ${0.2 - distance / 50000})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animateParticles();
});