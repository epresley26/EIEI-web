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
  window.addEventListener("beforeunload", () => clearInterval(carouselInterval));
}

// End of Slides logic

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
// MOBILE NAV
// ==================
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector("header nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
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

// ==================
// FAQ TOGGLE
// ==================
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains("open");
    document
      .querySelectorAll(".faq-answer")
      .forEach(a => a.classList.remove("open"));
    if (!isOpen) answer.classList.add("open");
  });
});

// ==================
// HOME LINK VISIBILITY
// ==================
function toggleHomeLink() {
  const homeLink = document.getElementById("navHome");
  if (!homeLink) return;

  const currentPath = window.location.pathname;
  const isHomepage =
    currentPath === "/" ||
    currentPath === "" ||
    currentPath.endsWith("/index");

  if (isHomepage) {
    homeLink.classList.remove("show");
  } else {
    homeLink.classList.add("show");
  }
}

document.addEventListener("DOMContentLoaded", toggleHomeLink);
window.addEventListener("load", toggleHomeLink);

// ==================
// NEWSLETTER SIGNUP
// ==================
function handleNewsletterSignup(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector(".newsletter-input").value.trim();

  if (!email) {
    alert("Please enter a valid email address.");
    return;
  }

  const emailNorm = email.toLowerCase();
  const subscriber = {
    email: emailNorm,
    createdAt: new Date().toISOString(),
    source: window.location.pathname || "unknown"
  };

  if (window.firebaseDB && typeof window.firebaseDB.collection === "function") {
    // Using compat-style FieldValue only if firebase compat is present
    const serverTs =
      window.firebase &&
      window.firebase.firestore &&
      window.firebase.firestore.FieldValue
        ? window.firebase.firestore.FieldValue.serverTimestamp()
        : new Date();

    window.firebaseDB
      .collection("newsletter")
      .doc(emailNorm)
      .set({
        email: subscriber.email,
        createdAt: serverTs,
        source: subscriber.source
      })
      .then(() => {
        form.reset();
        alert("🎉 Thank you for subscribing! You're on our list.");
      })
      .catch(() => {
        form.reset();
        alert("You're already subscribed. Thank you!");
      });
  } else {
    const PROJECT_ID = "eiei-e1a76";
    fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/newsletter?documentId=${encodeURIComponent(
        emailNorm
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            email: { stringValue: subscriber.email },
            createdAt: { timestampValue: subscriber.createdAt },
            source: { stringValue: subscriber.source }
          }
        })
      }
    )
      .then(res => {
        if (!res.ok) throw new Error("exists or write denied");
        form.reset();
        alert("🎉 Thank you for subscribing! You're on our list.");
      })
      .catch(() => {
        form.reset();
        alert("You're already subscribed or write blocked. Thank you!");
      });
  }
}

// End of Modal logic

// ==================
// TOUR REQUEST MODAL
// ==================
function openTourRequestModal() {
  const modal = document.getElementById("tourRequestModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeTourRequestModal() {
  const modal = document.getElementById("tourRequestModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
  const form = document.getElementById("tourRequestForm");
  if (form) {
    form.reset();
  }
}

function submitTourRequest(event) {
  event.preventDefault();

  if (!window.firebaseDB || typeof window.firebaseDB.collection !== "function") {
    alert("Database not ready. Please refresh and try again.");
    return;
  }

  const parentName = document.getElementById("tourParentName").value.trim();
  const childName = document.getElementById("tourChildName").value.trim();
  const childDOB = document.getElementById("tourChildDOB").value;
  const childAge = document.getElementById("tourChildAge").value;
  const lea = document.getElementById("tourLEA").value.trim();
  const phone = document.getElementById("tourPhone").value.trim();
  const address = document.getElementById("tourAddress").value.trim();
  const email = document.getElementById("tourEmail").value.trim();
  const transportation = document.querySelector(
    'input[name="tourTransportation"]:checked'
  );
  const preschool = document.querySelector(
    'input[name="tourPreschool"]:checked'
  );
  const language = document.getElementById("tourLanguage").value.trim();
  const services = Array.from(
    document.querySelectorAll('input[name="tourServices"]:checked')
  ).map(el => el.value);
  const preferredTime = document.querySelector(
    'input[name="tourTime"]:checked'
  );

  if (
    !parentName ||
    !childName ||
    !childDOB ||
    !childAge ||
    !lea ||
    !phone ||
    !address ||
    !email ||
    !transportation ||
    !preschool ||
    !language ||
    !services.length ||
    !preferredTime
  ) {
    alert("Please fill in all required fields");
    return;
  }

  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = "Submitting...";
  btn.disabled = true;

  window.firebaseDB
    .collection("tourRequests")
    .add({
      parentName,
      childName,
      childDOB,
      childAge: parseInt(childAge, 10),
      lea,
      phone,
      address,
      email,
      needsTransportation: transportation.value === "yes",
      attendingPreschool: preschool.value === "yes",
      primaryLanguage: language,
      services,
      preferredTime: preferredTime.value,
      submittedAt: new Date(),
      status: "pending"
    })
    .then(() => {
      alert(
        "✓ Tour request submitted successfully! We will contact you soon at " +
          phone +
          " to confirm your tour."
      );
      closeTourRequestModal();
    })
    .catch(error => {
      console.error("Error submitting tour request:", error);
      alert("Error submitting tour request. Please try again.");
    })
    .finally(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    });
}

window.addEventListener("click", event => {
  const modal = document.getElementById("tourRequestModal");
  if (event.target === modal) {
    closeTourRequestModal();
  }
});
// Legacy Gallery logic removed
