// Mobile menu toggle
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if (toggle) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Simple scroll animation using IntersectionObserver
const animated = document.querySelectorAll("[data-animate]");
if (animated.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target); // Optional: stop observing once animated
      }
    });
  }, { threshold: 0.25 });

  animated.forEach(el => obs.observe(el));
}

// FAQ toggle
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const a = q.nextElementSibling;
    if (!a) return;
    
    const isOpen = a.style.display === 'block';
    
    // Close all other answers
    document.querySelectorAll('.faq-a').forEach(x => x.style.display = 'none');
    
    // Toggle current answer
    a.style.display = isOpen ? 'none' : 'block';
  });
});

// WhatsApp form helper (used by the Services buttons and Contact form)
const WA_NUMBER = '27784587779'; // South African format (no leading 0)

function openWhatsAppPreset(item = '') {
  // opens WhatsApp chat with prefilled message
  const text = encodeURIComponent(`Hi QND Eventiques, I'm interested in: ${item}. Can you share details & pricing?`);
  const url = `https://wa.me/${WA_NUMBER}?text=${text}`;

  // Save a lightweight enquiry locally
  try {
    const booking = {
      type: 'service_enquiry',
      service: item,
      source: 'quick-enquire',
      timestamp: new Date().toISOString()
    };
    saveBooking(booking);
  } catch (err) { /* ignore storage errors */ }

  window.open(url, '_blank');
}

// Contact form submission -> open whatsapp with filled message
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = encodeURIComponent(
      `Hello QND, my name is ${name}. Phone: ${phone}. Email: ${email || 'N/A'}. Message: ${message}`
    );

    // open WhatsApp chat
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');

    // Save the full booking/contact locally
    try {
      const booking = {
        type: 'contact_form',
        name: name || 'Anonymous',
        phone: phone || '',
        email: email || '',
        message: message || '',
        timestamp: new Date().toISOString()
      };
      saveBooking(booking);
    } catch (err) { /* ignore storage errors */ }
    
    // Optionally reset form
    // contactForm.reset();
  });
}


// --- Local storage helpers for bookings/enquiries ---
function saveBooking(item) {
  if (!item) return;
  const key = 'qnd_bookings_v1';
  let arr = [];
  try {
    const raw = localStorage.getItem(key);
    arr = raw ? JSON.parse(raw) : [];
  } catch (e) { 
    arr = []; 
  }
  arr.push(item);
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) { /* storage quota or private mode */ }
}

function getBookings() {
  const key = 'qnd_bookings_v1';
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) { 
    return []; 
  }
}

// Create a floating WhatsApp button in the page if not already present
function createWhatsAppFloat() {
  if (document.querySelector('.whatsapp-float')) return;
  const a = document.createElement('a');
  a.href = `https://wa.me/${WA_NUMBER}`;
  a.target = '_blank';
  a.className = 'whatsapp-float';
  a.title = 'Message us on WhatsApp';
  a.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  document.body.appendChild(a);
}

// Initialize float button on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  createWhatsAppFloat();
});