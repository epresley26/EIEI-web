// Header component - creates and injects header HTML
function createHeader() {
  const headerHTML = `
    <!-- NAV -->
    <header class="nav">
      <div class="nav-inner">
        <div class="nav-logo-section">
          <a href="index.html" class="logo-link">
            <img src="images/logo.png" alt="EIEI Logo" class="logo">
          </a>
        </div>
        
        <button class="menu-toggle" id="menuToggle">☰</button>
        
        <nav class="nav-menu">
          <a href="about.html" class="nav-item">About</a>
          <a href="services.html" class="nav-item">Services</a>
          <a href="support.html" class="nav-item">Support</a>
          <a href="blog.html" class="nav-item">Blog</a>
          <a href="marketplace.html" class="nav-item">Marketplace</a>
          <a href="career-opportunities.html" class="nav-item">Careers</a>
          <a href="contact-us.html" class="nav-item">Contact</a>
        </nav>

        <div class="nav-actions">
          <a href="https://forms.gle/J5eJz9ztwiEAAyZq9" target="_blank" class="nav-btn nav-tour">Schedule a Tour</a>
        </div>
      </div>
    </header>
  `;
  return headerHTML;
}
