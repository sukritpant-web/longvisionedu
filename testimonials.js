document.addEventListener('DOMContentLoaded', function () {
    const testimonialText = document.getElementById('testimonial-text');
    const testimonialName = document.getElementById('testimonial-name');
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let testimonials = [];
    let currentIndex = 0;

    // Fetch testimonials from the JSON file
    fetch('testimonials.json')
        .then(response => response.json())
        .then(data => {
            testimonials = data; // Store the testimonials in an array
            displayTestimonial(currentIndex); // Display the first testimonial
        })
        .catch(error => console.error('Error loading testimonials:', error));

    // Display a testimonial based on the current index
    function displayTestimonial(index) {
        if (testimonials.length > 0) {
            testimonialText.textContent = `"${testimonials[index].text}"`;
            testimonialName.textContent = `- ${testimonials[index].name}`;
        }
    }

    // Event listener for Previous button
    prevBtn.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            displayTestimonial(currentIndex);
        } else {
            currentIndex = testimonials.length - 1; // Loop to the last testimonial
            displayTestimonial(currentIndex);
        }
    });

    // Event listener for Next button
    nextBtn.addEventListener('click', function () {
        if (currentIndex < testimonials.length - 1) {
            currentIndex++;
            displayTestimonial(currentIndex);
        } else {
            currentIndex = 0; // Loop back to the first testimonial
            displayTestimonial(currentIndex);
        }
    });
});
