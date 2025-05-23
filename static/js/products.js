let currentCategory = '';

document.addEventListener('DOMContentLoaded', function () {
    // Αρχική φόρτωση όλων των προϊόντων
    fetchProducts('', '');

    // Κουμπί αναζήτησης
    document.getElementById('search-button').addEventListener('click', function () {
        const searchTerm = document.getElementById('search-input').value;
        fetchProducts(searchTerm, '');
    });

    // Enter για αναζήτηση
    document.getElementById('search-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = document.getElementById('search-input').value;
            fetchProducts(searchTerm, '');
        }
    });

    // Κλικ σε κατηγορία
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.dataset.category;

         // Αν είναι ήδη επιλεγμένη, μην κάνεις τίποτα
            if (selectedCategory === currentCategory) return;

                currentCategory = selectedCategory;
            document.getElementById('search-input').value = ''; // Καθάρισε το πεδίο αναζήτησης
            fetchProducts('', selectedCategory); // Φόρτωσε προϊόντα για τη νέα κατηγορία
        });
    });

});

function fetchProducts(searchTerm = '', category = '') {
    let url = '';

    if (searchTerm) {
        url = `http://127.0.0.1:5000/search?name=${encodeURIComponent(searchTerm)}`;
    } else if (category) {
        url = `http://127.0.0.1:5000/search-by-category?category=${encodeURIComponent(category)}`;
    } else {
        // Αν δεν υπάρχει ούτε όνομα ούτε κατηγορία, φέρε όλα τα προϊόντα
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

        // Κλικ για like
        item.querySelector('.product-image').addEventListener('click', () => {
            likeProduct(product.id);
        });

        container.appendChild(item);
    });
}

function likeProduct(productId) {
    fetch('http://127.0.0.1:5000/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const currentSearch = document.getElementById('search-input').value;
                fetchProducts(currentSearch, currentCategory);
            }
        })
        .catch(error => console.error('Σφάλμα:', error));
}
