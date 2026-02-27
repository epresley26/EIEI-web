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
              <li><a href="nafei.html" class="nav-item">NAFEI</a></li>
              <li><a href="career-opportunities.html">Careers</a></li>
              <li><a href="contact-us.html">Contact</a></li>
            </ul>
          </div>

          <div class="footer-column">
            <h3>Programs</h3>
            <ul>
              <li><a href="early-intervention.html">Early Intervention</a></li>
              <li><a href="special-education.html">Special Education</a></li>
              <li><a href="parent-training.html">Parent Training</a></li>
              <li><a href="classroom-support.html">Classroom Support</a></li>
              <li><a href="professional-development.html">Professional Development</a></li>
              <li><a href="community-outreach.html">Community Outreach</a></li>
            
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
          <p>Non-Discrimination in Services Policy Statement: Admissions, the provisions of services, and referrals of clients shall be made without regard to race (to include hair type, hair texture, or hair style), color, religious creed (to include all aspects of religious observances and practice, as well as belief), disability, ancestry, national origin (including Limited English Proficiency), age (40 and over), or sex (to include pregnancy status, childbirth status, breastfeeding status, sex assigned at birth). Program services shall be made accessible to eligible persons with disabilities through the most practical and economically feasible methods available. These methods include, but are not limited to, equipment redesign, the provision of aides and the use of alternative service delivery locations. Structural modifications shall be considered only as a last resort among available methods.</p>
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

    <!-- Tour Request Modal -->
    <div id="tourRequestModal" class="modal" style="display: none;">
      <div class="modal-content" style="max-height: 90vh; overflow-y: auto;">
        <span class="modal-close" onclick="closeTourRequestModal()">&times;</span>
        <h2>ECSE Classroom Tour Request Form</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Thank you for your interest in visiting our Early Intervention Classroom, sponsored by Elwyn. Tours will be conducted between March 16th and April 30th, 2026.
        </p>
        
        <form id="tourRequestForm" onsubmit="submitTourRequest(event)">
          <!-- Parent/Guardian Name -->
          <div class="form-group">
            <label for="tourParentName">Parent/Guardian Name <span style="color: #f44336;">*</span></label>
            <input type="text" id="tourParentName" required placeholder="Full name">
          </div>

          <!-- Child's Name -->
          <div class="form-group">
            <label for="tourChildName">Child's Name <span style="color: #f44336;">*</span></label>
            <input type="text" id="tourChildName" required placeholder="Child's full name">
          </div>

          <!-- Date of Birth -->
          <div class="form-group">
            <label for="tourChildDOB">Date of Birth <span style="color: #f44336;">*</span></label>
            <input type="date" id="tourChildDOB" required>
          </div>

          <!-- Age of Child -->
          <div class="form-group">
            <label for="tourChildAge">Age of Child <span style="color: #f44336;">*</span></label>
            <input type="number" id="tourChildAge" required min="0" max="10" placeholder="Age in years">
          </div>

          <!-- LEA from Elwyn -->
          <div class="form-group">
            <label for="tourLEA">LEA from Elwyn <span style="color: #f44336;">*</span></label>
            <input type="text" id="tourLEA" required placeholder="Local Education Agency">
          </div>

          <!-- Phone Number -->
          <div class="form-group">
            <label for="tourPhone">Phone Number <span style="color: #f44336;">*</span></label>
            <input type="tel" id="tourPhone" required placeholder="(123) 456-7890">
          </div>

          <!-- Address -->
          <div class="form-group">
            <label for="tourAddress">Address <span style="color: #f44336;">*</span></label>
            <input type="text" id="tourAddress" required placeholder="Street address">
          </div>

          <!-- Email Address -->
          <div class="form-group">
            <label for="tourEmail">Email Address <span style="color: #f44336;">*</span></label>
            <input type="email" id="tourEmail" required placeholder="your@email.com">
          </div>

          <!-- Transportation -->
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text);">Do you need transportation? <span style="color: #f44336;">*</span></label>
            <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem;">
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="radio" name="tourTransportation" value="yes" required style="margin-right: 0.5rem; cursor: pointer;">
                Yes
              </label>
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="radio" name="tourTransportation" value="no" required style="margin-right: 0.5rem; cursor: pointer;">
                No
              </label>
            </div>
          </div>

          <!-- Preschool Program -->
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text);">Is the child attending a regular preschool program? <span style="color: #f44336;">*</span></label>
            <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem;">
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="radio" name="tourPreschool" value="yes" required style="margin-right: 0.5rem; cursor: pointer;">
                Yes
              </label>
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="radio" name="tourPreschool" value="no" required style="margin-right: 0.5rem; cursor: pointer;">
                No
              </label>
            </div>
          </div>

          <!-- Primary Language -->
          <div class="form-group">
            <label for="tourLanguage">Primary Language <span style="color: #f44336;">*</span></label>
            <input type="text" id="tourLanguage" required placeholder="Primary language spoken at home">
          </div>

          <!-- Services -->
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text);">What Services is the child receiving? <span style="color: #f44336;">*</span></label>
            <div style="margin-top: 0.5rem;">
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer; margin-bottom: 0.5rem;">
                <input type="checkbox" name="tourServices" value="behavioral" style="margin-right: 0.5rem; cursor: pointer;">
                Behavioral
              </label>
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer; margin-bottom: 0.5rem;">
                <input type="checkbox" name="tourServices" value="occupational" style="margin-right: 0.5rem; cursor: pointer;">
                Occupational
              </label>
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="checkbox" name="tourServices" value="speech" style="margin-right: 0.5rem; cursor: pointer;">
                Speech
              </label>
            </div>
          </div>

          <!-- Preferred Time -->
          <div class="form-group">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text);">Preferred Time of Day for Tour <span style="color: #f44336;">*</span></label>
            <div style="display: flex; gap: 1.5rem; margin-top: 0.5rem;">
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="radio" name="tourTime" value="am" required style="margin-right: 0.5rem; cursor: pointer;">
                AM
              </label>
              <label style="display: flex; align-items: center; font-weight: normal; cursor: pointer;">
                <input type="radio" name="tourTime" value="pm" required style="margin-right: 0.5rem; cursor: pointer;">
                PM
              </label>
            </div>
          </div>

          <button type="submit" class="form-submit-btn">Submit Tour Request</button>
        </form>
      </div>
    </div>
  `;
  return footerHTML;
}