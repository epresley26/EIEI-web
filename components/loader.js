// Load header and footer components
function loadComponents() {
  try {
    // Inject header using the JavaScript function
    const headerContainer = document.getElementById('header-container');
    if (headerContainer && typeof createHeader === 'function') {
      headerContainer.innerHTML = createHeader();
      console.log('Header loaded successfully');
      // Initialize mobile nav after header is loaded
      if (window.setupMobileNav) setupMobileNav();
    } else {
      console.error('Header container not found or createHeader function not available');
    }

    // Inject footer using the JavaScript function
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer && typeof createFooter === 'function') {
      footerContainer.innerHTML = createFooter();
      console.log('Footer loaded successfully');
    } else {
      console.error('Footer container not found or createFooter function not available');
    }

    // Dark mode removed; no theme initialization required
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
