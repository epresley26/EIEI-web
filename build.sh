#!/bin/bash

# 🚀 EIEI Website Build Script
# Production build automation for deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="EIEI"
BUILD_DIR="dist"
SOURCE_DIR="."
VERSION=$(date +%Y%m%d_%H%M%S)
NODE_VERSION="18"

echo -e "${BLUE}🚀 Starting ${PROJECT_NAME} Production Build...${NC}"
echo -e "${BLUE}📅 Build Version: ${VERSION}${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}📦 Checking dependencies...${NC}"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js ${NODE_VERSION} or later."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Node.js version
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js version is ${NODE_MAJOR}. Recommended version is 18 or later."
    fi
    
    print_status "Dependencies check completed"
    echo ""
}

# Clean previous builds
clean_build() {
    echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
    
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        print_status "Removed existing build directory"
    fi
    
    mkdir -p "$BUILD_DIR"
    print_status "Created fresh build directory"
    echo ""
}

# Copy source files
copy_files() {
    echo -e "${BLUE}📁 Copying source files...${NC}"
    
    # Copy HTML files
    find "$SOURCE_DIR" -maxdepth 1 -name "*.html" -exec cp {} "$BUILD_DIR" \;
    print_status "Copied HTML files"
    
    # Copy CSS files
    find "$SOURCE_DIR" -maxdepth 1 -name "*.css" -exec cp {} "$BUILD_DIR" \;
    print_status "Copied CSS files"
    
    # Copy JavaScript files
    find "$SOURCE_DIR" -maxdepth 1 -name "*.js" -exec cp {} "$BUILD_DIR" \;
    print_status "Copied JavaScript files"
    
    # Copy images directory
    if [ -d "$SOURCE_DIR/images" ]; then
        cp -r "$SOURCE_DIR/images" "$BUILD_DIR/"
        print_status "Copied images directory"
    fi
    
    # Copy components directory
    if [ -d "$SOURCE_DIR/components" ]; then
        cp -r "$SOURCE_DIR/components" "$BUILD_DIR/"
        print_status "Copied components directory"
    fi
    
    echo ""
}

# Optimize images
optimize_images() {
    echo -e "${BLUE}🖼️  Optimizing images...${NC}"
    
    if [ -d "$BUILD_DIR/images" ]; then
        # Check if jpegoptim is available
        if command -v jpegoptim &> /dev/null; then
            find "$BUILD_DIR/images" -name "*.jpg" -o -name "*.jpeg" | while read file; do
                jpegoptim --max=85 "$file"
            done
            print_status "Optimized JPEG images"
        else
            print_warning "jpegoptim not found. Skipping image optimization."
        fi
        
        # Check if optipng is available
        if command -v optipng &> /dev/null; then
            find "$BUILD_DIR/images" -name "*.png" | while read file; do
                optipng -o2 "$file"
            done
            print_status "Optimized PNG images"
        else
            print_warning "optipng not found. Skipping PNG optimization."
        fi
    fi
    
    echo ""
}

# Minify CSS
minify_css() {
    echo -e "${BLUE}✂️  Minifying CSS...${NC}"
    
    if command -v npx &> /dev/null; then
        if [ -f "$BUILD_DIR/style.css" ]; then
            npx clean-css-cli -o "$BUILD_DIR/style.min.css" "$BUILD_DIR/style.css"
            mv "$BUILD_DIR/style.min.css" "$BUILD_DIR/style.css"
            print_status "Minified CSS file"
        fi
    else
        print_warning "npx not available. Skipping CSS minification."
    fi
    
    echo ""
}

# Minify JavaScript
minify_js() {
    echo -e "${BLUE}✂️  Minifying JavaScript...${NC}"
    
    if command -v npx &> /dev/null; then
        # Minify main script
        if [ -f "$BUILD_DIR/script.js" ]; then
            npx terser "$BUILD_DIR/script.js" -o "$BUILD_DIR/script.min.js" --compress --mangle
            mv "$BUILD_DIR/script.min.js" "$BUILD_DIR/script.js"
            print_status "Minified main script"
        fi
        
        # Minify component files
        if [ -d "$BUILD_DIR/components" ]; then
            for file in "$BUILD_DIR/components"/*.js; do
                if [ -f "$file" ]; then
                    npx terser "$file" -o "${file%.js}.min.js" --compress --mangle
                    mv "${file%.js}.min.js" "$file"
                fi
            done
            print_status "Minified component scripts"
        fi
    else
        print_warning "npx not available. Skipping JavaScript minification."
    fi
    
    echo ""
}

# Update HTML references to minified files
update_html_references() {
    echo -e "${BLUE}🔗 Updating HTML references...${NC}"
    
    # Update CSS references
    find "$BUILD_DIR" -name "*.html" -exec sed -i '' 's/style\.css/style.min.css/g' {} \;
    print_status "Updated CSS references"
    
    # Update JavaScript references
    find "$BUILD_DIR" -name "*.html" -exec sed -i '' 's/script\.js/script.min.js/g' {} \;
    print_status "Updated JavaScript references"
    
    echo ""
}

# Create service worker
create_service_worker() {
    echo -e "${BLUE}🔧 Creating service worker...${NC}"
    
    cat > "$BUILD_DIR/service-worker.js" << 'EOF'
// Service Worker for EIEI Website
const CACHE_NAME = 'eiei-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/style.css',
  '/script.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF
    
    print_status "Created service worker"
    echo ""
}

# Create manifest file
create_manifest() {
    echo -e "${BLUE}📱 Creating web app manifest...${NC}"
    
    cat > "$BUILD_DIR/manifest.json" << 'EOF'
{
  "name": "EIEI Services",
  "short_name": "EIEI",
  "description": "Early Intervention Services and Professional Development",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2a4175",
  "theme_color": "#2a4175",
  "icons": [
    {
      "src": "/images/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/logo.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF
    
    print_status "Created web app manifest"
    echo ""
}

# Create robots.txt
create_robots() {
    echo -e "${BLUE}🤖 Creating robots.txt...${NC}"
    
    cat > "$BUILD_DIR/robots.txt" << 'EOF'
User-agent: *
Allow: /

Sitemap: https://eieiservices.com/sitemap.xml

# Disallow admin pages from indexing
Disallow: /admin.html
Disallow: /admin-programs.html
Disallow: /login.html
EOF
    
    print_status "Created robots.txt"
    echo ""
}

# Create sitemap
create_sitemap() {
    echo -e "${BLUE}🗺️  Creating sitemap...${NC}"
    
    cat > "$BUILD_DIR/sitemap.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://eieiservices.com/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/about.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/services.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/early-intervention.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/training-development.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/community-programs.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/family-empowerment.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/career-development.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://eieiservices.com/supporting-inclusions.html</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
EOF
    
    print_status "Created sitemap.xml"
    echo ""
}

# Create .htaccess for Apache servers
create_htaccess() {
    echo -e "${BLUE}🔧 Creating .htaccess...${NC}"
    
    cat > "$BUILD_DIR/.htaccess" << 'EOF'
# EIEI Website Configuration

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByTypeType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 month"
    ExpiresByType application/vnd.ms-fontobject "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Redirect HTTP to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]
EOF
    
    print_status "Created .htaccess file"
    echo ""
}

# Create build info
create_build_info() {
    echo -e "${BLUE}📊 Creating build information...${NC}"
    
    cat > "$BUILD_DIR/build-info.json" << EOF
{
  "buildVersion": "$VERSION",
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "project": "$PROJECT_NAME",
  "nodeVersion": "$(node -v)",
  "npmVersion": "$(npm -v)",
  "buildType": "production",
  "optimizations": {
    "imageOptimization": true,
    "cssMinification": true,
    "jsMinification": true,
    "serviceWorker": true,
    "manifest": true
  }
}
EOF
    
    print_status "Created build information"
    echo ""
}

# Generate build summary
generate_summary() {
    echo -e "${BLUE}📋 Build Summary${NC}"
    echo "=================================="
    echo -e "Project: ${GREEN}${PROJECT_NAME}${NC}"
    echo -e "Version: ${GREEN}${VERSION}${NC}"
    echo -e "Build Directory: ${GREEN}${BUILD_DIR}${NC}"
    echo ""
    
    echo -e "${BLUE}Files Created:${NC}"
    find "$BUILD_DIR" -type f | while read file; do
        size=$(wc -c < "$file")
        echo -e "  ${GREEN}$(basename "$file")${NC} (${size} bytes)"
    done
    
    echo ""
    echo -e "${BLUE}Build Size:${NC}"
    du -sh "$BUILD_DIR"
    echo ""
    
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo -e "📁 Files ready for deployment in: ${GREEN}${BUILD_DIR}/${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Review the build files in the dist/ directory"
    echo "2. Test the build locally if possible"
    echo "3. Deploy to your hosting platform"
    echo "4. Verify the deployment"
}

# Main build process
main() {
    check_dependencies
    clean_build
    copy_files
    optimize_images
    minify_css
    minify_js
    update_html_references
    create_service_worker
    create_manifest
    create_robots
    create_sitemap
    create_htaccess
    create_build_info
    generate_summary
}

# Run main function
main "$@"