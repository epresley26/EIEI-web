# Firestore Security Rules for Career Applications

## Rules Configuration

Add these rules to your Firestore Security Rules (in Firebase Console):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public collections - can be read by anyone, written by authenticated users
    match /careerApplications/{document=**} {
      // Allow anyone to create new applications
      allow create: if request.auth != null && 
        hasRequiredFields(['name', 'email', 'phone', 'position', 'location']);
      
      // Allow admins to read and update
      allow read, update: if isAdmin();
      
      // Allow admins to delete
      allow delete: if isAdmin();
    }

    match /job_applications/{document=**} {
      // Allow anyone to create
      allow create: if request.auth != null &&
        hasRequiredFields(['jobId', 'name', 'email', 'phone', 'experience']);
      
      // Allow admins to read and update
      allow read, update: if isAdmin();
      
      // Allow admins to delete
      allow delete: if isAdmin();
    }

    // Jobs collection - readable by anyone, managed by admins
    match /jobs/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper function to check required fields
    function hasRequiredFields(fields) {
      return request.resource.data.keys().hasAll(fields);
    }
  }
}
```

## Setup Steps

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `eiei-e1a76`
3. **Go to Firestore → Rules**
4. **Replace all content** with the rules above
5. **Click Publish**

## Important Notes

### Public Application Submission
- Candidates can submit applications without authentication (required fields only)
- Resumes are stored as base64 in Firestore
- Applications are set to "pending" status by default

### Admin Access
- Only users with `role: 'admin'` in the users collection can:
  - View all applications
  - Update application status
  - Delete applications
  - Manage job postings

### Set Admin Users
In Firebase Console, create a `users` collection with documents like:

```javascript
// Document: users/{uid}
{
  role: "admin",
  email: "admin@example.com",
  createdAt: timestamp
}
```

Replace `{uid}` with the actual Firebase user ID.

## Alternative: Simpler Rules (For Testing)

If you want to allow public read access while testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /careerApplications/{document=**} {
      allow create: if true;  // Anyone can submit
      allow read: if request.auth != null;  // Authenticated users can read
      allow update, delete: if isAdmin();
    }

    match /job_applications/{document=**} {
      allow create: if true;
      allow read: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    match /jobs/{document=**} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Testing the Rules

1. Open `admin-careers.html` in your browser (requires login)
2. You should see all applications submitted
3. You can view details, download resumes, and update status
4. Try accessing without authentication - should be blocked

## Troubleshooting

**"Permission denied" error when viewing applications?**
- Make sure your Firebase user has `role: 'admin'` in the users collection
- Check that rules are published (look for green checkmark)

**Can't create new collection?**
- Firestore collections are created automatically when you first write a document
- If using the form, a `careerApplications` collection will be created

**Resume download not working?**
- Resumes are stored as base64 data URLs
- Browser downloads them automatically
- Check browser's download settings
