// Mobile Menu
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Λήψη popular products για slideshow
async function loadSlideshow() {
    try {
        const response = await fetch('/popular-products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const products = await response.json();

        const container = document.getElementById('slideshow-container');
        container.innerHTML = ''; // Καθαρίζει ότι υπήρχε πριν

        products.forEach((product, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (index === 0) slide.classList.add('active'); // Το πρώτο ενεργό

            slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${product.photo}')`;

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('slide-title');
            nameDiv.textContent = product.name;
            
            // Προσθήκη nameDiv στο slide
            slide.appendChild(nameDiv);

            // Προσθήκη slide στο container
            container.appendChild(slide);
        });

        startSlideshow(); // ξεκίνα το slide αλλαγές
    } catch (error) {
        console.error('Σφάλμα φόρτωσης δημοφιλών προϊόντων:', error);
    }
}

// Slideshow λειτουργία
let current = 0;
let slides = [];

function startSlideshow() {
    slides = document.querySelectorAll('.slide');
    setInterval(() => {
        if (slides.length === 0) return;

        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 5000);
}

// Newsletter form submission
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    if (emailInput.value) {
        alert('Thanks for your registration! We will inform you about our offers and new products!');
        emailInput.value = ''; // Clear the input
    }
});

// Εκκίνηση όταν φορτωθεί η σελίδα
window.addEventListener('DOMContentLoaded', loadSlideshow);
