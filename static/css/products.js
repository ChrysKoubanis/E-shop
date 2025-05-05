document.addEventListener('DOMContentLoaded', function() {
    // Αρχική φόρτωση όλων των προϊόντων
    fetchProducts('');
    
    // Χειρισμός αναζήτησης
    document.getElementById('search-button').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-input').value;
        fetchProducts(searchTerm);
    });
    
    // Επιτρέπει αναζήτηση με Enter
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = document.getElementById('search-input').value;
            fetchProducts(searchTerm);
        }
    });
});

function fetchProducts(searchTerm) {
    fetch(`http://127.0.0.1:5000/search?name=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('products-list').innerHTML = 
                '<div class="error-message">Προέκυψε σφάλμα κατά τη φόρτωση των προϊόντων</div>';
        });
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products-list');
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="no-results">Δεν βρέθηκαν προϊόντα</div>';
        return;
    }
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">€${product.price}</div>
                <div class="product-likes">
                    <i class="fas fa-heart"></i> ${product.likes} Likes
                </div>
            </div>
        `;
        
        // Προσθήκη event listener για like
        productElement.querySelector('.product-image').addEventListener('click', () => {
            likeProduct(product._id);
        });
        
        productsContainer.appendChild(productElement);
    });
}

function likeProduct(productId) {
    fetch('http://127.0.0.1:5000/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Ενημέρωση του like στην οθόνη
            const likeElements = document.querySelectorAll('.product-item');
            likeElements.forEach(element => {
                const img = element.querySelector('.product-image img');
                if (img && img.alt === data.product.name) {
                    const likesElement = element.querySelector('.product-likes');
                    likesElement.innerHTML = `
                        <i class="fas fa-heart"></i> ${data.product.likes} Likes
                    `;
                    
                    // Προσθήκη animation
                    element.querySelector('.product-image').classList.add('liked');
                    setTimeout(() => {
                        element.querySelector('.product-image').classList.remove('liked');
                    }, 1000);
                }
            });
        }
    })
    .catch(error => console.error('Error:', error));
}