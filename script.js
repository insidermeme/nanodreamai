// nanodream.ai Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    initStarChamber();
    initEmbers();
    initShootingStars();
    initWordMorph();
    initScrollAnimations();
    initNumberCounters();
    initVideoArchive();

    // Premium Enhancements
    initCursor();
    initLetterbox();
    initParallaxAndProgress();
    initMagneticButtons();
    initTestimonials();
    initAmbientSound();

    // Cinematic Intake Form
    initIntakeForm();
    initHeaderScroll();
});

// --- Header Scroll Logic ---
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// --- Background System ---
let mouseX = 0;
let mouseY = 0;

function initStarChamber() {
    const canvas = document.getElementById('starchamber');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];

    // Performance check for mobile to reduce stars
    const isMobile = window.innerWidth <= 768;
    const NUM_STARS = isMobile ? 30 : 60;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    resize();

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.blur = Math.random() > 0.8 ? Math.random() * 3 : 0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Simple Attraction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 250;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
            }

            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            if (this.blur > 0) {
                ctx.shadowBlur = this.blur;
                ctx.shadowColor = 'white';
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        }
    }

    for (let i = 0; i < NUM_STARS; i++) {
        stars.push(new Star());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// --- Morphing Text Animation ---
function initWordMorph() {
    const words = ["Vision", "Dream", "Fantasy", "Story"];
    let currentIndex = 0;
    const wordElement = document.getElementById('morphing-text');
    if (!wordElement) return;

    // Total transition 1.5s, pause 3-4s. Let's say interval is 4.5s
    setInterval(() => {
        // Morph out
        wordElement.style.opacity = '0';
        wordElement.style.filter = 'blur(10px)';
        wordElement.style.transform = 'translate(-50%, -50%) scale(1.05)';

        setTimeout(() => {
            // Change word
            currentIndex = (currentIndex + 1) % words.length;
            wordElement.textContent = words[currentIndex];

            // Snap back
            wordElement.style.transform = 'translate(-50%, -50%) scale(0.95)';

            // Allow layout jump
            requestAnimationFrame(() => {
                wordElement.style.opacity = '1';
                wordElement.style.filter = 'blur(0px)';
                wordElement.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        }, 750); // half of 1.5s transition

    }, 4500);
}

// --- Scroll Reveal Animations ---
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Activate preceding section divider if present
                const prevNode = entry.target.previousElementSibling;
                if (prevNode && prevNode.classList.contains('section-divider')) {
                    prevNode.classList.add('active');
                }

                // observe only once to save rendering performance since it shouldn't pop wildly
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section:not(.hero-section), .step, .final-cta').forEach(section => {
        observer.observe(section);
    });
}

// --- Metric Number Counters ---
function initNumberCounters() {
    const metricsOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const metricObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, metricsOptions);

    document.querySelectorAll('.metric-number').forEach(el => {
        metricObserver.observe(el);
    });

    function animateValue(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        const suffix = obj.getAttribute('data-suffix');
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easing function easeOutExpo
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentVal = Math.floor(easeOutProgress * target);
            obj.innerHTML = currentVal + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target + suffix;
            }
        };
        window.requestAnimationFrame(step);
    }
}

// --- Video Archive ---
function initVideoArchive() {
    const videoItems = document.querySelectorAll('.video-item');
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    if (!videoItems.length && !modal) return;
    const closeBtn = document.querySelector('.close-modal');

    // Desktop hover play
    if (window.matchMedia("(hover: hover)").matches) {
        videoItems.forEach(item => {
            const previewVideo = item.querySelector('.hover-preview');
            let playPromise;

            item.addEventListener('mouseenter', () => {
                // lazy load source if not loaded (basic approach: setting src if data-src exists, but we pre-set src in html)
                playPromise = previewVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Auto-play was prevented
                        console.log("Autoplay prevented on preview");
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        previewVideo.pause();
                        previewVideo.currentTime = 0;
                    }).catch(error => { });
                } else {
                    previewVideo.pause();
                    previewVideo.currentTime = 0;
                }
            });

            // Click to open modal
            item.addEventListener('click', () => {
                const videoSrc = item.getAttribute('data-video');
                openModal(videoSrc);
            });
        });
    } else {
        // Mobile fallback - just click to open
        videoItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoSrc = item.getAttribute('data-video');
                openModal(videoSrc);
            });
        });
    }

    function openModal(src) {
        modalVideo.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        modalVideo.play().catch(e => console.log(e));
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalVideo.pause();
        modalVideo.src = ''; // reset
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// --- Premium Enhancements ---

function initCursor() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return;

    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .video-item, .glass-card, .selectable-card, .option-pill, .archive-card, .vault-card, .header-cta');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

function initLetterbox() {
    const top = document.getElementById('letterbox-top');
    const bottom = document.getElementById('letterbox-bottom');
    const sweep = document.querySelector('.hero-light-sweep');

    if (top && bottom) {
        // Cleanup DOM after animation completes
        setTimeout(() => {
            top.remove();
            bottom.remove();
            if (sweep) sweep.classList.add('active');
        }, 2600);
    } else if (sweep) {
        // Fallback if no letterbox
        sweep.classList.add('active');
    }
}

function initParallaxAndProgress() {
    const isMobile = window.innerWidth <= 768;
    const canvas = document.getElementById('starchamber');
    const mist = document.getElementById('galaxy-mist');
    const progressBar = document.getElementById('scroll-progress');
    const orbitalRing = document.getElementById('orbital-ring');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Parallax - keeping it lightweight via transforms
        if (!isMobile) {
            if (canvas) canvas.style.transform = `translateY(${scrolled * 0.3}px)`;
            if (mist) mist.style.transform = `translateY(${scrolled * 0.15}px)`;
            if (orbitalRing) orbitalRing.style.transform = `translate(-50%, -50%) rotateX(75deg) rotateZ(0deg) translateY(${scrolled * 0.05}px)`;
        } else {
            if (orbitalRing) orbitalRing.style.transform = `translate(-50%, -50px) rotateX(75deg) rotateZ(0deg) translateY(${scrolled * 0.05}px)`;
        }
    }, { passive: true });
}

function initShootingStars() {
    const container = document.getElementById('shooting-star-container');
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        container.style.display = 'none';
        return;
    }

    function spawnShootingStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star');

        // Randomize starting properties
        const startY = Math.random() * (window.innerHeight * 0.5); // Top half
        const startX = Math.random() * window.innerWidth;

        // Randomize angle roughly diagonal
        const angle = Math.random() * 30 + 30; // 30 to 60 degrees

        star.style.top = `${startY}px`;
        star.style.left = `${startX}px`;
        star.style.transform = `rotate(${angle}deg)`;

        container.appendChild(star);

        // Remove element after animation finishes
        setTimeout(() => {
            if (container.contains(star)) {
                star.remove();
            }
        }, 800);

        // Schedule next spawn (8 to 15 seconds)
        const nextDelay = Math.random() * 7000 + 8000;
        setTimeout(spawnShootingStar, nextDelay);
    }

    // Initial delay so it doesn't fire immediately on page load
    setTimeout(spawnShootingStar, 5000);
}

function initEmbers() {
    const canvas = document.getElementById('embers-canvas');
    if (!canvas) return;

    // Disable on mobile/touch
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const NUM_PARTICLES = 20;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1; // 1-3px
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = -Math.random() * 0.5 - 0.2; // Move upwards
            this.life = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Subtle sine wave drift
            this.x += Math.sin(this.y * 0.05) * 0.5;

            // Wrap vertically & softly fade out
            if (this.y < -10) {
                this.y = height + 10;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 230, 200, ${this.life})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initMagneticButtons() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return;

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from center
            const x = (e.clientX - centerX) * 0.2;
            const y = (e.clientY - centerY) * 0.2;

            btn.style.transform = `translate(${x}px, ${y}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

function initTestimonials() {
    const quoteEl = document.getElementById('testimonial-quote');
    const authorNameEl = document.querySelector('.author-name');
    const authorTitleEl = document.querySelector('.author-title');
    const container = document.querySelector('.testimonial-container');

    if (!quoteEl || !container) return;

    const testimonials = [
        {
            quote: "\"The level of cinematic quality and emotional resonance they bring is simply unmatched. It feels like a movie, not an ad.\"",
            name: "Sarah Jenkins",
            title: "CMO at Lumina"
        },
        {
            quote: "\"Working with nanodream elevated our visual identity entirely. Their attention to lighting and rhythm is breathtaking.\"",
            name: "David Chen",
            title: "Founder, Apex Dynamics"
        },
        {
            quote: "\"A flawless production process. They understood our vision instantly and delivered something far beyond our wildest expectations.\"",
            name: "Elena Rostova",
            title: "Creative Director"
        }
    ];

    let currentIndex = 0;

    setInterval(() => {
        container.classList.add('fade-out');

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            const t = testimonials[currentIndex];
            quoteEl.textContent = t.quote;
            authorNameEl.textContent = t.name;
            authorTitleEl.textContent = t.title;

            container.classList.remove('fade-out');
        }, 800); // Wait for CSS opacity transition

    }, 6000);
}

function initAmbientSound() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;

    let audioCtx;
    let isPlaying = false;
    let oscillator;
    let gainNode;

    btn.addEventListener('click', () => {
        if (!audioCtx) {
            // Initialize Web Audio API
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Low cinematic drone
            oscillator = audioCtx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(55, audioCtx.currentTime); // Low hum

            // Detuned oscillator for thick depth
            const osc2 = audioCtx.createOscillator();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(55.5, audioCtx.currentTime);

            // Lowpass Filter 
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, audioCtx.currentTime);

            gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

            oscillator.connect(filter);
            osc2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            osc2.start();
        }

        if (isPlaying) {
            // Fade out drone
            gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5);
            btn.classList.remove('playing');
        } else {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            // Fade in gently
            gainNode.gain.setTargetAtTime(0.1, audioCtx.currentTime, 0.5);
            btn.classList.add('playing');
        }

        isPlaying = !isPlaying;
    });
}

function initIntakeForm() {
    const modal = document.getElementById('intake-modal');
    if (!modal) return;
    const triggers = document.querySelectorAll('.trigger-intake');
    const closers = document.querySelectorAll('.close-intake-trigger');
    const steps = document.querySelectorAll('.intake-step');
    const stepCounter = document.getElementById('step-counter');
    const progressBar = document.getElementById('intake-progress');
    const btnNexts = document.querySelectorAll('.btn-next');
    const typeCards = document.querySelectorAll('.selectable-card');
    const timelinePills = document.querySelectorAll('.option-pill');
    const submitBtn = document.getElementById('submit-brief');
    const form = document.getElementById('intake-form');
    const hiddenType = document.getElementById('hidden-project-type');
    const hiddenTimeline = document.getElementById('hidden-timeline');

    let currentStep = 1;
    const totalSteps = 4;

    // Form State Object
    const formData = {
        type: '',
        vision: '',
        references: '',
        timeline: '',
        name: '',
        email: '',
        contact: ''
    };

    if (!modal) return;

    // Open Modal
    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent bg scroll
            resetForm();
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closers.forEach(el => el.addEventListener('click', closeModal));

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Step Navigation
    function goToStep(stepIndex) {
        if (stepIndex > totalSteps + 1) return; // +1 for success state

        // Outgoing step
        const currentEl = document.getElementById(currentStep <= totalSteps ? `step-${currentStep}` : 'step-success');
        if (currentEl) {
            currentEl.classList.remove('active');
            currentEl.classList.add('slide-out-left');
        }

        // Incoming step
        const nextEl = document.getElementById(stepIndex <= totalSteps ? `step-${stepIndex}` : 'step-success');
        if (nextEl) {
            nextEl.classList.remove('slide-out-left');

            // force reflow to ensure animation restarts if navigating back (though this flow is forward only)
            void nextEl.offsetWidth;

            nextEl.classList.add('active');
        }

        currentStep = stepIndex;

        // Update Header
        if (currentStep <= totalSteps) {
            stepCounter.textContent = `Step ${currentStep} of ${totalSteps}`;
            progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
        } else {
            // Success state header hiding is optional, we just set it to 100%
            stepCounter.textContent = `Brief Submitted`;
            progressBar.style.width = `100%`;
        }
    }

    // Step 1: Type Selection
    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            typeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            formData.type = card.dataset.type;

            // Clear error if exists
            const typeError = document.getElementById('type-error');
            if (typeError) typeError.classList.remove('visible');

            // Small delay for UX feel
            setTimeout(() => {
                goToStep(2);
            }, 300);
        });
    });



    // Step Navigation Validation
    btnNexts.forEach(btn => {
        btn.addEventListener('click', () => {
            const next = parseInt(btn.dataset.next);

            // Validation Logic
            if (currentStep === 1) {
                if (!formData.type) {
                    document.getElementById('type-error').classList.add('visible');
                    return;
                }
            }

            if (currentStep === 2) {
                formData.vision = document.getElementById('vision-text').value;
                formData.references = document.getElementById('vision-links').value;
            }

            goToStep(next);
        });
    });

    // Step 3: Timeline Selection
    timelinePills.forEach(pill => {
        pill.addEventListener('click', () => {
            timelinePills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            formData.timeline = pill.dataset.timeline;

            setTimeout(() => {
                goToStep(4);
            }, 300);
        });
    });

    // Step 4: Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameEl = document.getElementById('contact-name');
            const emailEl = document.getElementById('contact-email');
            const phoneEl = document.getElementById('contact-phone');
            const visionEl = document.getElementById('vision-text');

            // Basic Validation Check
            if (!nameEl.value || !emailEl.value) {
                if (!nameEl.value) nameEl.focus();
                else emailEl.focus();
                return;
            }

            // Sync hidden fields with current selections
            if (hiddenType) hiddenType.value = formData.type;
            if (hiddenTimeline) hiddenTimeline.value = formData.timeline;

            // Prepare for fetch
            const submissionData = new FormData(form);

            // Trigger loading state on button
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: submissionData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        goToStep(5);
                    } else {
                        alert('Oops! There was a problem submitting your brief. Please try again or message us on Telegram.');
                    }
                })
                .catch(error => {
                    alert('Oops! There was a problem submitting your brief. Please try again.');
                })
                .finally(() => {
                    submitBtn.textContent = 'Submit Brief';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                });
        });
    }

    function resetForm() {
        currentStep = 1;

        // Reset steps UI
        steps.forEach(step => {
            step.classList.remove('active', 'slide-out-left');
        });
        document.getElementById('step-1').classList.add('active');

        // Reset Header
        stepCounter.textContent = `Step 1 of ${totalSteps}`;
        progressBar.style.width = `25%`;

        // Reset Selections
        typeCards.forEach(c => c.classList.remove('selected'));
        timelinePills.forEach(p => p.classList.remove('selected'));

        // Reset Inputs
        document.getElementById('vision-text').value = '';
        document.getElementById('vision-links').value = '';
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-phone').value = '';

        // Reset Data
        formData.type = '';
        formData.vision = '';
        formData.references = '';
        formData.timeline = '';
        formData.name = '';
        formData.email = '';
        formData.contact = '';
    }
}
