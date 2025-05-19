document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links (alternative to CSS scroll-behavior)
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Smooth scroll to target
                    window.scrollTo({
                         top: targetElement.offsetTop - 70, // Adjust offset for sticky header
                        behavior: 'smooth'
                     });

                    // Highlight active link
                    navLinks.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');

                    // Close mobile menu if open
                    if (navUl.classList.contains('nav-active')) {
                        navUl.classList.remove('nav-active');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Reset icon
                    }
                }
            }
        });
    });

    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('header nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('nav-active');
            // Change hamburger icon to close icon and back
            if (navUl.classList.contains('nav-active')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }


    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust for sticky header height if necessary (e.g., 70px)
            if (pageYOffset >= (sectionTop - sectionHeight / 3 - 70)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
        // Special case for home when at the top
        if (pageYOffset < (document.getElementById('home').offsetHeight / 2) && current !== 'home') {
             navLinks.forEach(link => link.classList.remove('active'));
             document.querySelector('header nav ul li a[href="#home"]').classList.add('active');
        }
    });


    // Update footer year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Contact Form Submission (AJAX for better UX)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(this);
            formStatus.innerHTML = 'Sending...';
            formStatus.style.color = '#333';


            fetch(this.action, { // this.action is 'php/contact_form_handler.php'
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Expect JSON response from PHP
            .then(data => {
                if (data.success) {
                    formStatus.innerHTML = data.message;
                    formStatus.style.color = 'green';
                    contactForm.reset(); // Clear the form
                } else {
                    formStatus.innerHTML = 'Error: ' + (data.message || 'Could not send message.');
                    formStatus.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formStatus.innerHTML = 'An error occurred. Please try again.';
                formStatus.style.color = 'red';
            });
        });
    }

    // Simple Animations on Scroll (Optional - can use a library like AOS.js for more complex ones)
    const faders = document.querySelectorAll('.fade-in');
    const sliders = document.querySelectorAll('.slide-in');

    const appearOptions = {
        threshold: 0, // How much of the element is visible before it triggers
        rootMargin: "0px 0px -100px 0px" // Trigger a bit before it's fully in view
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target); // Stop observing once it has appeared
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    sliders.forEach(slider => {
        appearOnScroll.observe(slider);
    });

});

// Add these to your CSS for the simple scroll animations:
/*
.fade-in {
    opacity: 0;
    transition: opacity 1s ease-in-out;
}
.fade-in.appear {
    opacity: 1;
}

.slide-in {
    opacity: 0;
    transform: translateX(-100px); // Or translateY(100px)
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.slide-in.appear {
    opacity: 1;
    transform: translateX(0); // Or translateY(0)
}
*/
// You'd add 'fade-in' or 'slide-in' classes to sections or elements in your HTML
// e.g., <section id="about" class="container fade-in">