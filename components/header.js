// Header component - creates and injects header HTML
function createHeader() {
  const headerHTML = `
    <!-- NAV -->
    <header class="nav">
      <div class="nav-inner">
        <a href="index.html" class="logo-link">
          <img src="images/logo.png" alt="EIEI Logo" class="logo">
        </a>
        <button class="menu-toggle" id="menuToggle">☰</button>
        <nav>
          <a href="index.html" class="nav-home" id="navHome">Home</a>
          <a href="about.html">About</a>
          <a href="services.html">Services</a>
          <a href="support.html">Support</a>
          <a href="blog.html">Blog</a>
          <a href="marketplace.html">Marketplace</a>
          <a href="career-opportunities.html">Careers</a>
          <a href="contact-us.html">Contact</a>
          <a href="https://forms.gle/J5eJz9ztwiEAAyZq9" target="_blank" class="nav-btn nav-tour">Schedule a Tour</a>
        </nav>
      </div>
    </header>
  `;
  return headerHTML;
}
