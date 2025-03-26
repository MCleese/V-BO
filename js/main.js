document.addEventListener('DOMContentLoaded', () => {
    // Bildspelsfunktionalitet
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Byt bild var 5:e sekund
    setInterval(nextSlide, 5000);

    // Scroll-baserad animation för sektioner
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Lägg till initial styling och observera varje sektion
    sections.forEach(section => {
        if (!section.classList.contains('hero-section')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s ease-out';
            sectionObserver.observe(section);
        }
    });

    // Lightbox funktionalitet
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('.gallery-img');
    const closeButton = document.querySelector('.lightbox-close');
    const zoomInButton = document.querySelector('.zoom-in');
    const zoomOutButton = document.querySelector('.zoom-out');
    const zoomResetButton = document.querySelector('.zoom-reset');

    let currentZoom = 1;
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let currentPos = { x: 0, y: 0 };

    // Öppna lightbox
    galleryImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            const fullSizeUrl = img.getAttribute('data-full');
            lightboxImg.src = fullSizeUrl;
            lightbox.classList.add('active');
            resetZoom();
            console.log('Lightbox opened:', fullSizeUrl); // Debug-loggning
        });
    });

    // Stäng lightbox
    closeButton.addEventListener('click', () => {
        lightbox.classList.remove('active');
        resetZoom();
    });

    // Stäng med Escape-tangenten
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            resetZoom();
        }
    });

    // Stäng när man klickar utanför bilden
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            resetZoom();
        }
    });

    // Zoom-funktioner
    function updateZoom() {
        lightboxImg.style.transform = `scale(${currentZoom}) translate(${currentPos.x}px, ${currentPos.y}px)`;
    }

    function resetZoom() {
        currentZoom = 1;
        currentPos = { x: 0, y: 0 };
        updateZoom();
    }

    zoomInButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = Math.min(currentZoom * 1.2, 4);
        updateZoom();
    });

    zoomOutButton.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = Math.max(currentZoom / 1.2, 1);
        if (currentZoom === 1) resetZoom();
        else updateZoom();
    });

    zoomResetButton.addEventListener('click', (e) => {
        e.stopPropagation();
        resetZoom();
    });

    // Drag-funktionalitet
    lightboxImg.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (currentZoom > 1) {
            isDragging = true;
            startPos = {
                x: e.clientX - currentPos.x,
                y: e.clientY - currentPos.y
            };
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentPos = {
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            };
            updateZoom();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch-stöd för mobila enheter
    lightboxImg.addEventListener('touchstart', (e) => {
        if (currentZoom > 1) {
            e.preventDefault();
            isDragging = true;
            startPos = {
                x: e.touches[0].clientX - currentPos.x,
                y: e.touches[0].clientY - currentPos.y
            };
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentPos = {
                x: e.touches[0].clientX - startPos.x,
                y: e.touches[0].clientY - startPos.y
            };
            updateZoom();
        }
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Debug-loggning för att verifiera att händelselyssnare är kopplade
    console.log('Antal bilder med klick-händelser:', galleryImages.length);
}); 