// URL-e stron w aplikacji
let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery' // Dodano "Gallery"
};

// Funkcja uruchamiana po załadowaniu aplikacji
function OnStartUp() {
    popStateHandler(); // Renderuje odpowiednią stronę na podstawie aktualnego URL-a
}

// Wywołanie funkcji startowej
OnStartUp();

// Obsługa kliknięcia w link "About"
document.querySelector('#about-link').addEventListener('click', () => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

// Obsługa kliknięcia w link "Contact"
document.querySelector('#contact-link').addEventListener('click', () => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

// Obsługa kliknięcia w link "Gallery"
document.querySelector('#gallery-link').addEventListener('click', () => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

// Funkcja renderująca stronę "About"
function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">About Me</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

// Funkcja renderująca stronę "Contact"
function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required placeholder="Enter your name">

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email">

            <label for="message">Message:</label>
            <textarea id="message" name="message" required placeholder="Enter your message"></textarea>

            <!-- CAPTCHA -->
            <div id="captcha-container">
                <label for="captcha">What is <span id="captcha-question"></span>?</label>
                <input type="text" id="captcha" name="captcha" required placeholder="Answer">
            </div>

            <button type="submit">Send</button>
        </form>
    `;

    // Inicjalizacja CAPTCHA
    const captchaQuestion = generateCaptcha();
    document.getElementById('captcha-question').textContent = captchaQuestion.text;

    // Obsługa wysyłania formularza
    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Zatrzymanie domyślnej akcji formularza

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const captchaAnswer = document.getElementById('captcha').value.trim();

        // Walidacja danych
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (captchaAnswer !== captchaQuestion.answer) {
            alert('Invalid CAPTCHA answer. Please try again.');
            return;
        }

        // Jeśli wszystko jest poprawne
        alert('Form submitted successfully!');
    });
}

// Funkcja generująca pytanie CAPTCHA
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1; // Losowa liczba od 1 do 10
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
        text: `${num1} + ${num2}`,
        answer: (num1 + num2).toString() // Oczekiwana odpowiedź
    };
}

// Funkcja walidująca adres e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Podstawowy regex dla e-maila
    return emailRegex.test(email);
}


// Funkcja renderująca stronę "Gallery"
function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div class="gallery">
            ${Array.from({ length: 9 }, (_, i) => `
                <img class="gallery-item lazy" data-src="img${i + 1}.png" alt="Image ${i + 1}" />
            `).join('')}
        </div>
        <div id="modal" class="modal hidden">
            <span id="modal-close">&times;</span>
            <img id="modal-image" />
        </div>
    `;

    // Lazy loading obrazów
    const lazyImages = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => observer.observe(img));

    // Obsługa modalnego okna
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('#modal').classList.remove('hidden');
            document.querySelector('#modal-image').src = item.src;
        });
    });

    document.querySelector('#modal-close').addEventListener('click', () => {
        document.querySelector('#modal').classList.add('hidden');
    });

    document.querySelector('#modal').addEventListener('click', event => {
        if (event.target.id === 'modal') {
            document.querySelector('#modal').classList.add('hidden');
        }
    });
}

// Obsługa zmiany stanu historii przeglądarki
function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];

    if (loc === pageUrls.about) {
        RenderAboutPage();
    } else if (loc === pageUrls.contact) {
        RenderContactPage();
    } else if (loc === pageUrls.gallery) {
        RenderGalleryPage();
    } else {
        RenderAboutPage(); // Domyślna strona
    }
}

// Przypisanie obsługi zdarzenia popstate
window.onpopstate = popStateHandler;
