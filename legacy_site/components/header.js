// Header component - creates and injects header HTML
function createHeader() {
  const headerHTML = `
    <!-- NAV -->
    <header class="nav">
      <div class="nav-inner">
        <div class="nav-logo-section">
          <a href="index" class="logo-link">
            <img src="images/logo.png" alt="EIEI Logo" class="logo">
          </a>
        </div>
        
        <button class="menu-toggle" id="menuToggle">☰</button>
        
        <nav class="nav-menu">
          <a href="about" class="nav-item">About</a>
          <a href="services" class="nav-item">Services</a>
          
          <a href="blog" class="nav-item">Blog</a>
          
          <a href="career-opportunities" class="nav-item">Careers</a>
          <a href="nafei" class="nav-item">NAFEI</a>
          
          <a href="contact-us" class="nav-item">Contact</a>
          <div class="header-actions">
          <a href="donate" class="donate-pill">Donate</a>
        </div>
        </nav>

        <div class="nav-actions">
        </div>
      </div>
    </header>
  `;
  return headerHTML;
}
