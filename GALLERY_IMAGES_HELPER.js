// Gallery Upload Helper
// Add these images to your Firestore 'gallery' collection
// You can run this in the browser console on your admin panel

const galleryImages = [
  {
    fileName: 'EIEI Gallery - Community Event 1',
    description: 'Community members engaged in early intervention training',
    uploadDate: new Date('2025-02-27'),
    tags: ['community', 'training', 'children']
  },
  {
    fileName: 'EIEI Gallery - Classroom Activity',
    description: 'Special needs classroom activity in progress',
    uploadDate: new Date('2025-02-27'),
    tags: ['classroom', 'early-intervention', 'children']
  },
  {
    fileName: 'EIEI Gallery - Team Training',
    description: 'Professional development and training session',
    uploadDate: new Date('2025-02-27'),
    tags: ['training', 'professional-development', 'team']
  },
  {
    fileName: 'EIEI Gallery - Community Moment',
    description: 'Community gathering and support event',
    uploadDate: new Date('2025-02-27'),
    tags: ['community', 'family-support', 'gathering']
  },
  {
    fileName: 'EIEI Gallery - Classroom Engagement',
    description: 'Teachers and children engaged in classroom activities',
    uploadDate: new Date('2025-02-27'),
    tags: ['classroom', 'teaching', 'learning']
  }
];

// ImgBB URLs for the gallery images
const galleryUrls = [
  'https://i.ibb.co/hFYqsLbY/gallery-sample-1.jpg', // Use ImgBB URL after uploading
  'https://i.ibb.co/xxxxx/gallery-2.jpg',  // Replace with actual ImgBB URLs
  'https://i.ibb.co/xxxxx/gallery-3.jpg',
  'https://i.ibb.co/xxxxx/gallery-4.jpg',
  'https://i.ibb.co/xxxxx/gallery-5.jpg'
];

// Instructions:
// 1. Upload each gallery image to ImgBB using the admin panel Gallery tab
// 2. Or run this code after setting imageUrl properties
// 3. Images will be added to Firestore 'gallery' collection with proper metadata
