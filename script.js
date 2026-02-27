// ==================
// CAROUSEL
// ==================
const slides = document.querySelectorAll(".slide");
if (slides.length > 0) {
  let currentSlide = 0;
  const carouselInterval = setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000);
  // Cleanup on page unload
  window.addEventListener("beforeunload", () => clearInterval(carouselInterval));
}

// ==================
// TESTIMONIALS CAROUSEL (Dynamic from Firestore)
// ==================
let testimonialCardsData = [];
let currentTestimonial = 0;
let testimonialsInterval;

function loadAndInitializeTestimonials() {
  if (typeof window.firebaseDB === 'undefined') {
    console.log('Firebase not ready yet');
    return;
  }

  window.firebaseDB.collection('testimonials').orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      testimonialCardsData = [];
      snapshot.forEach(doc => {
        testimonialCardsData.push({ id: doc.id, ...doc.data() });
      });

      if (testimonialCardsData.length === 0) {
        console.log('No testimonials found');
        return;
      }

      renderTestimonials();
      initializeTestimonialCarousel();
    })
    .catch(err => console.error('Error loading testimonials:', err));
}

function renderTestimonials() {
  const container = document.getElementById('testimonialsContainer');
  if (!container) return;

  container.innerHTML = '';
  testimonialCardsData.forEach(t => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p>"${escapeHtmlContent(t.text || '')}"</p>
      <h3>- ${escapeHtmlContent(t.name || '')}${t.designation ? ', ' + escapeHtmlContent(t.designation) : ''}</h3>
    `;
    container.appendChild(card);
  });
}

function escapeHtmlContent(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initializeTestimonialCarousel() {
  const container = document.getElementById('testimonialsContainer');
  if (!container) return;

  const testimonialCards = container.querySelectorAll('.card');
  if (testimonialCards.length === 0) return;

  currentTestimonial = 0;
  testimonialCards[0].classList.add('active');

  function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialCards[index].classList.add('active');
  }

  function startAutoRotate() {
    testimonialsInterval = setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(currentTestimonial);
    }, 5000);
  }

  startAutoRotate();

  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(testimonialsInterval);
      currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
      showTestimonial(currentTestimonial);
      startAutoRotate();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(testimonialsInterval);
      currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(currentTestimonial);
      startAutoRotate();
    });
  }

  window.addEventListener('beforeunload', () => clearInterval(testimonialsInterval));
}

// Wait a bit for Firebase to initialize
setTimeout(loadAndInitializeTestimonials, 500);

// ==================
// CONTACT BUTTON
// ==================
const contactBtn = document.getElementById("contactBtn");
if (contactBtn) {
  contactBtn.addEventListener("click", () => {
    const form = document.querySelector(".contact-form");
    if (form) form.scrollIntoView({ behavior: "smooth" });
  });
}

// ==================
// MOBILE NAV SETUP
// ==================
function setupMobileNav() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector("header nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
    // Close nav when a link is clicked
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => nav.classList.remove("active"));
    });
  }
}

// ==================
// MOBILE NAV
// ==================
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("header nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
  // Close nav when a link is clicked
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("active"));
  });
}

// ==================
// SCROLL REVEAL
// ==================
if ("IntersectionObserver" in window) {
  const reveals = document.querySelectorAll(".reveal, .slide-up");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -100px 0px" }
  );
  reveals.forEach(el => observer.observe(el));
}

// Dark mode removed; no theme scripts

// ==================
// FAQ TOGGLE
// ==================
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains("open");
    // Close all answers
    document.querySelectorAll(".faq-answer").forEach(a => a.classList.remove("open"));
    // Toggle current answer
    if (!isOpen) answer.classList.add("open");
  });
});

// ==================
// HOME LINK VISIBILITY
// ==================
function toggleHomeLink() {
  const homeLink = document.getElementById("navHome");
  if (!homeLink) return;
  
  // Check if we're on the homepage
  const currentPath = window.location.pathname;
  const isHomepage = currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath === "";
  
  if (isHomepage) {
    homeLink.classList.remove("show");
  } else {
    homeLink.classList.add("show");
  }
}

// Call on page load and after components load
document.addEventListener("DOMContentLoaded", toggleHomeLink);
window.addEventListener("load", toggleHomeLink);

// ==================
// NEWSLETTER SIGNUP
// ==================
function handleNewsletterSignup(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector(".newsletter-input").value.trim();
  
  if (email) {
    // Normalize and try saving to Firestore via SDK if available, else REST fallback
    const emailNorm = email.toLowerCase();
    const subscriber = { email: emailNorm, createdAt: new Date().toISOString(), source: window.location.pathname || 'unknown' };
    if (window.firebaseDB && typeof window.firebaseDB.collection === 'function') {
      // Use deterministic doc ID (email) to prevent duplicates; rules will allow only create
      window.firebaseDB.collection('newsletter').doc(emailNorm).set({
        email: subscriber.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: subscriber.source
      }).then(() => {
        form.reset();
        alert("🎉 Thank you for subscribing! You're on our list.");
      }).catch(() => {
        // If rules reject because doc exists, treat as already subscribed
        form.reset();
        alert("You're already subscribed. Thank you!");
      });
    } else {
      // REST API fallback (requires rules to allow public write)
      const PROJECT_ID = 'eiei-e1a76';
      // Create with deterministic documentId so duplicates fail
      fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/newsletter?documentId=${encodeURIComponent(emailNorm)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            email: { stringValue: subscriber.email },
            createdAt: { timestampValue: subscriber.createdAt },
            source: { stringValue: subscriber.source }
          }
        })
      }).then(res => {
        if (!res.ok) throw new Error('exists or write denied');
        form.reset();
        alert("🎉 Thank you for subscribing! You're on our list.");
      }).catch(() => {
        form.reset();
        alert("You're already subscribed or write blocked. Thank you!");
      });
    }
  } else {
    alert("Please enter a valid email address.");
  }
}

// ========== TESTIMONIAL GALLERY LOADING ==========
function loadTestimonialGallery() {
  const container = document.getElementById('testimonialGalleryContainer');
  if (!container) return;

  const db = firebase.firestore();
  db.collection('testimonialGalleries').doc('main').get()
    .then(doc => {
      if (doc.exists && doc.data().images && doc.data().images.length > 0) {
        const images = doc.data().images;
        container.innerHTML = '';
        
        images.forEach((img, idx) => {
          setTimeout(() => {
            const imgElement = document.createElement('div');
            imgElement.style.cssText = 'border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s ease; contain: layout style paint;';
            imgElement.innerHTML = `<img src="${img.url}" alt="Testimonial Gallery" style="width: 100%; height: 220px; object-fit: cover;" loading="lazy">`;
            imgElement.addEventListener('mouseenter', function() {
              this.style.transform = 'translateY(-8px)';
              this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            });
            imgElement.addEventListener('mouseleave', function() {
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            container.appendChild(imgElement);
          }, idx * 50);
        });
      }
    })
    .catch(err => console.error('Error loading testimonial gallery:', err));
}

// Load testimonial gallery when window loads
window.addEventListener('load', loadTestimonialGallery);

// ========== PAGE-SPECIFIC TESTIMONIAL GALLERY LOADING ==========
function loadPageTestimonialGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const db = firebase.firestore();
  db.collection('testimonialGalleries').doc('main').get()
    .then(doc => {
      if (doc.exists && doc.data().images && doc.data().images.length > 0) {
        const images = doc.data().images;
        container.innerHTML = '';
        
        images.forEach((img, idx) => {
          setTimeout(() => {
            const imgElement = document.createElement('div');
            imgElement.style.cssText = 'border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s ease; contain: layout style paint;';
            imgElement.innerHTML = `<img src="${img.url}" alt="Testimonial Gallery" style="width: 100%; height: 200px; object-fit: cover;" loading="lazy">`;
            imgElement.addEventListener('mouseenter', function() {
              this.style.transform = 'translateY(-8px)';
              this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
            });
            imgElement.addEventListener('mouseleave', function() {
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            container.appendChild(imgElement);
          }, idx * 50);
        });
      }
    })
    .catch(err => console.error('Error loading testimonial gallery:', err));
}

// Load page-specific testimonial galleries
window.addEventListener('load', () => {
  if (document.getElementById('trainingTestimonialGalleryContainer')) {
    loadPageTestimonialGallery('trainingTestimonialGalleryContainer');
  }
  if (document.getElementById('earlyInterventionTestimonialGalleryContainer')) {
    loadPageTestimonialGallery('earlyInterventionTestimonialGalleryContainer');
  }
});
// ==================
// TOUR REQUEST MODAL
// ==================

function openTourRequestModal() {
  const modal = document.getElementById('tourRequestModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    console.log('Tour request modal opened');
  } else {
    console.error('Tour request modal element not found');
  }
}

function closeTourRequestModal() {
  const modal = document.getElementById('tourRequestModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
  const form = document.getElementById('tourRequestForm');
  if (form) {
    form.reset();
  }
}

function submitTourRequest(event) {
  event.preventDefault();

  if (typeof window.firebaseDB === 'undefined') {
    alert('Database not ready. Please refresh and try again.');
    return;
  }

  // Get all form values
  const parentName = document.getElementById('tourParentName').value.trim();
  const childName = document.getElementById('tourChildName').value.trim();
  const childDOB = document.getElementById('tourChildDOB').value;
  const childAge = document.getElementById('tourChildAge').value;
  const lea = document.getElementById('tourLEA').value.trim();
  const phone = document.getElementById('tourPhone').value.trim();
  const address = document.getElementById('tourAddress').value.trim();
  const email = document.getElementById('tourEmail').value.trim();
  const transportation = document.querySelector('input[name="tourTransportation"]:checked');
  const preschool = document.querySelector('input[name="tourPreschool"]:checked');
  const language = document.getElementById('tourLanguage').value.trim();
  const services = Array.from(document.querySelectorAll('input[name="tourServices"]:checked')).map(el => el.value);
  const preferredTime = document.querySelector('input[name="tourTime"]:checked');

  // Validate required fields
  if (!parentName || !childName || !childDOB || !childAge || !lea || !phone || !address || !email || !transportation || !preschool || !language || services.length === 0 || !preferredTime) {
    alert('Please fill in all required fields');
    return;
  }

  // Show loading state
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  // Save to Firestore
  window.firebaseDB.collection('tourRequests').add({
    parentName: parentName,
    childName: childName,
    childDOB: childDOB,
    childAge: parseInt(childAge),
    lea: lea,
    phone: phone,
    address: address,
    email: email,
    needsTransportation: transportation.value === 'yes',
    attendingPreschool: preschool.value === 'yes',
    primaryLanguage: language,
    services: services,
    preferredTime: preferredTime.value,
    submittedAt: new Date(),
    status: 'pending'
  })
  .then(() => {
    alert('✓ Tour request submitted successfully! We will contact you soon at ' + phone + ' to confirm your tour.');
    closeTourRequestModal();
  })
  .catch(error => {
    console.error('Error submitting tour request:', error);
    alert('Error submitting tour request. Please try again.');
  })
  .finally(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('tourRequestModal');
  if (event.target === modal) {
    closeTourRequestModal();
  }
});