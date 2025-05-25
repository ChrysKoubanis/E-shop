let currentCategory = '';

// 1. ===> Ορισμός functions ΠΡΩΤΑ

function fetchProducts(searchTerm = '', category = '') {
    let url = '';

    if (searchTerm) {
        url = `http://127.0.0.1:5000/search?name=${encodeURIComponent(searchTerm)}`;
    } else if (category) {
        url = `http://127.0.0.1:5000/search-by-category?category=${encodeURIComponent(category)}`;
    } else {
        url = `http://127.0.0.1:5000/search`;
    }

    fetch(url)
        .then(response => response.json())
        .then(products => {
            console.log("[DEBUG] Προϊόντα:", products);
            displayProducts(products);
        })
        .catch(error => {
            console.error('Σφάλμα:', error);
            document.getElementById('products-list').innerHTML =
                '<div class="error-message">Σφάλμα κατά τη φόρτωση των προϊόντων</div>';
        });
}

function displayProducts(products) {
    const container = document.getElementById('products-list');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="no-results">Δεν βρέθηκαν προϊόντα</div>';
        return;
    }

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-image">
                <img src="${product.photo}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">€${product.price}</div>
                <div class="product-likes"><i class="fas fa-heart"></i> ${product.likes} Likes</div>
            </div>
        `;

        item.querySelector('.product-image').addEventListener('click', () => {
            likeProduct(product.id);
        });

        container.appendChild(item);
    });
}

function likeProduct(productId) {
    fetch('http://127.0.0.1:5000/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const currentSearch = document.getElementById('search-input').value.trim();
                fetchProducts(currentSearch, currentCategory);
            }
        })
        .catch(error => console.error('Σφάλμα:', error));
}

// 2. ===> Μετά το DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || '';
    currentCategory = initialCategory;
    fetchProducts('', initialCategory);

    document.getElementById('search-button').addEventListener('click', function () {
        const searchTerm = document.getElementById('search-input').value.trim();

        if (searchTerm === '') {
            // Καθαρίζουμε και το φίλτρο κατηγορίας
            currentCategory = '';
            fetchProducts('', '');
        } else {
            fetchProducts(searchTerm, currentCategory);
        }
    });

    document.getElementById('search-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = document.getElementById('search-input').value.trim();

            if (searchTerm === '') {
                currentCategory = '';
                fetchProducts('', '');
            } else {
                fetchProducts(searchTerm, currentCategory);
            }
        }
    });

    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.dataset.category;
            if (selectedCategory === currentCategory) return;

            currentCategory = selectedCategory;
            document.getElementById('search-input').value = '';
            fetchProducts('', selectedCategory);
        });
    });
});
