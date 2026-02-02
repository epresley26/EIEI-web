// Footer component - creates and injects footer HTML
function createFooter() {
  const footerHTML = `
    <footer>
      <div class="footer-content">
        <!-- Footer Main Content -->
        <div class="footer-main">
          <div class="footer-column">
            <h3>About EIEI</h3>
            <p class="footer-tagline">The Education Institute for Early Intervention – Nurturing young minds with excellence.</p>
            <div class="footer-stats">
              <div class="stat">
                <div class="stat-number">500+</div>
                <div class="stat-label">Children Served</div>
              </div>
              <div class="stat">
                <div class="stat-number">20+</div>
                <div class="stat-label">Expert Educators</div>
              </div>
              <div class="stat">
                <div class="stat-number">15+</div>
                <div class="stat-label">Programs</div>
              </div>
            </div>
          </div>

          <div class="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="index.html#about">About Us</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="support.html">Support</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="career-opportunities.html">Careers</a></li>
              <li><a href="contact-us.html">Contact</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h3>Programs</h3>
            <ul>
              <li><a href="services.html">Early Intervention</a></li>
              <li><a href="services.html">Special Education</a></li>
              <li><a href="services.html">Parent Training</a></li>
              <li><a href="services.html">Classroom Support</a></li>
              <li><a href="services.html">Professional Development</a></li>
            </ul>
          </div>

          <div class="footer-column newsletter-column">
            <h3>📧 Subscribe for Updates</h3>
            <p class="newsletter-tagline">Get the latest news and updates from EIEI!</p>
            <form class="newsletter-form" onsubmit="handleNewsletterSignup(event)">
              <div class="newsletter-input-wrapper">
                <input type="email" placeholder="Your email address" required class="newsletter-input">
                <button type="submit" class="newsletter-btn">✨ Subscribe</button>
              </div>
              <p class="newsletter-note">We respect your privacy. No spam!</p>
            </form>
          </div>
        </div>

        <!-- Footer Social & Admin -->
        <div class="footer-bottom">
          <div class="footer-left">
          <p>Non-Discrimination in Services Policy Statement: Admissions, the provisions of services, and referrals of clients shall be made without regard to race (to include hair type, hair texture, or hair style), color, religious creed (to include all aspects of religious observances and practice, as well as belief), disability, ancestry, national origin (including Limited English Proficiency), age (40 and over), or sex (to include pregnancy status, childbirth status, breastfeeding status, sex assigned at birth). Program services shall be made accessible to eligible persons with disabilities through the most practical and economically feasible methods available. These methods include, but are not limited to, equipment redesign, the provision of aides and the use of alternative service delivery locations. Structural modifications shall be considered only as a last resort among available methods.</p
            <p>&copy; 2025 EIEI Services. All rights reserved.</p>
            <div class="footer-links">
              <a href="#" title="Privacy Policy">Privacy Policy</a> | 
              <a href="#" title="Terms of Service">Terms of Service</a> | 
              <a href="admin-programs.html" title="Admin Portal" class="admin-link">Admin Portal</a>
            </div>
          </div>
          <div class="footer-social">
            <h4>Follow Us</h4>
            <div class="social-icons">
              <a href="#" title="Facebook" class="social-icon">f</a>
              <a href="#" title="Instagram" class="social-icon">📷</a>
              <a href="#" title="LinkedIn" class="social-icon">in</a>
              <a href="#" title="YouTube" class="social-icon">▶</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
  return footerHTML;
}
