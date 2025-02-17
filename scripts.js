// Add any JavaScript functionality here
document.addEventListener('DOMContentLoaded', function() {
    // Example: Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

document.addEventListener("headerLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", toggleMenu);

    function toggleMenu() {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    }

    // Close menu when a link is clicked
    document.querySelectorAll(".menu > li > a").forEach(link => {
        link.addEventListener("click", function(e) {
            if (this.parentElement.classList.contains("dropdown")) {
                e.preventDefault();
                this.parentElement.classList.toggle("active");
            } else {
                closeMenu();
            }
        });
    });

    function closeMenu() {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        document.querySelectorAll(".dropdown").forEach(dropdown => {
            dropdown.classList.remove("active");
        });
    }

    // Close dropdowns and menu when clicking outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".nav-menu") && !e.target.closest(".hamburger")) {
            closeMenu();
        }
    });
});

// Handle smooth scrolling for anchor links
document.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && e.target.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    }
});
