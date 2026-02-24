# EIEI Programs System - Quick Start Guide

## 🚀 For Public Website Visitors

### Viewing Programs
1. Navigate to `program.html` or click "Programs" in navigation
2. Browse the program listings
3. Click on any program card to view details
4. Read full program information, services, and benefits
5. Click "Contact" or "Get Started" buttons for inquiries

### Available Program Pages
- **Career Development Program** → `/career-development.html`
- **Training, Coaching & Professional Development** → `/training-development.html`
- **Community Programs & Partnerships** → `/community-programs.html`
- **Family Empowerment** → `/family-empowerment.html`
- **Early Intervention Services & Behavioral Health** → `/early-intervention.html`
- **Supporting Inclusions Through Programs & Affiliates** → `/supporting-inclusions.html`

---

## 👨‍💼 For Admin Users

### Accessing the Admin Panel
1. Open `admin-programs.html`
2. Log in with your admin credentials
3. Navigate to the "Programs" tab

### Managing Programs

#### View Programs
- All 6 programs display in a grid layout
- Each shows program name, description preview
- Quick access to Edit and Delete buttons

#### Edit a Program
1. Click the **Edit** button on any program card
2. Modal opens with editable fields:
   - Program Name
   - Program ID
   - Age Range
   - Description
   - Location
   - Image URL
   - Services/Provides (dynamic list)
   - Benefits (dynamic list)
3. Make your changes
4. Click **Save** button
5. Changes auto-save to Firebase ✅

#### Delete a Program
1. Click the **Delete** button on any program card
2. Confirm deletion when prompted
3. Program is removed from both display and Firebase ✅

#### Add a New Program
1. Click **Add New Program** button (appears in Programs tab)
2. Modal opens with empty form fields
3. Fill in all program details
4. Add services/benefits items as needed
5. Click **Save** button
6. New program appears in grid and saves to Firebase ✅

#### Field Descriptions

| Field | Purpose | Example |
|-------|---------|---------|
| Program ID | Unique identifier | `career-development` |
| Program Name | Display name | `Career Development Program` |
| Age Range | Target age group | `3-5 years` |
| Description | Short description | `Join our team! We are NOW HIRING...` |
| Location | Where program operates | `4704 Leiper Street, Philadelphia, PA 19124` |
| Image URL | Program icon/image | `images/career-dev.svg` |
| Provides/Services | What program offers | Click "Add" to add multiple items |
| Benefits | Who benefits | Click "Add" to add multiple items |

---

## 🔄 How the System Works

### Data Flow

```
┌─────────────────────────────────────────┐
│     ADMIN PANEL (admin-programs.html)    │
│  • View 6 hardcoded programs             │
│  • Edit program details                  │
│  • Delete programs                       │
│  • Add new programs                      │
└──────────────┬──────────────────────────┘
               │
               ↓
        ┌──────────────┐
        │  Firebase    │
        │  Firestore   │
        │  programs    │
        │  collection  │
        └──────┬───────┘
               │
               ↓
┌─────────────────────────────────────────┐
│   PUBLIC PROGRAM PAGES                   │
│  • Display program details               │
│  • Show services & benefits              │
│  • Link to contact/enrollment            │
└─────────────────────────────────────────┘
```

### Initialization Flow

1. **Admin Panel Loads**
   - Checks Firebase for existing programs
   - If found → Loads from Firebase
   - If not found → Uses 6 hardcoded defaults

2. **User Edits Program**
   - Admin clicks Edit → Modal opens with current data
   - Admin makes changes → Clicks Save
   - Program updates in display
   - Changes saved to Firebase

3. **Public User Views Program**
   - Program details loaded from hardcoded data or Firebase
   - Public page displays current information
   - Shows all services, benefits, and contact options

---

## 📊 Program Data Structure

Each program contains:

```javascript
{
  id: "unique-program-id",
  name: "Program Display Name",
  description: "Brief description shown in listings",
  fullDescription: "Extended description for detail pages",
  imageUrl: "path/to/image.svg",
  link: "page-file.html",
  benefits: [
    "Benefit or target audience 1",
    "Benefit or target audience 2"
  ],
  provides: [
    "Service or offering 1",
    "Service or offering 2"
  ],
  location: "Optional: Program location address",
  ageRange: "Optional: Target age group"
}
```

---

## 🔐 Admin Features

### Program Management
- ✅ **CRUD Operations**: Create, Read, Update, Delete
- ✅ **Firebase Sync**: Real-time saving to Firestore
- ✅ **Error Handling**: Success/error message feedback
- ✅ **Confirmation**: Delete confirmation to prevent accidents
- ✅ **Dynamic Fields**: Add/remove services and benefits lists

### Data Persistence
- Programs save automatically to Firebase
- Changes persist across sessions
- Hardcoded defaults serve as fallback
- Can edit or delete any program anytime

---

## 🎨 Customization

### Edit a Program's Content
1. Open admin panel
2. Click Edit on desired program
3. Update any field you want to change:
   - Name
   - Description
   - Services offered
   - Benefits
   - Location
   - Image
4. Click Save
5. Changes reflected immediately on program page

### Add a New Service/Benefit
1. In the edit modal, find Services or Benefits section
2. Click "Add" button
3. Type the service/benefit name
4. Click Save
5. Item added to program

### Remove a Service/Benefit
1. In the edit modal, find Services or Benefits section
2. Click "Remove" button next to the item
3. Click Save
4. Item removed from program

---

## ❓ FAQ

**Q: Where do the 6 programs come from?**
A: They are hardcoded in the `getDefaultPrograms()` function in admin-programs.html and pulled from the official EIEI website.

**Q: Can I add more than 6 programs?**
A: Yes! Click "Add New Program" button to create additional programs.

**Q: Do changes save automatically?**
A: Yes, when you click the Save button, changes automatically save to Firebase.

**Q: What if Firebase is not available?**
A: The system will still work using the 6 hardcoded programs as defaults.

**Q: Can I create programs only through the admin panel?**
A: Yes, that's the intended workflow. The public website displays programs, while admins manage them in the admin panel.

**Q: How do I edit the public program pages?**
A: Edit programs through the admin panel, and changes will appear on public pages automatically (or clear browser cache to see updates).

**Q: Can I change program URLs/links?**
A: Yes, edit the "link" field in the program modal to point to a different page.

**Q: Where is the Early Intervention Services location?**
A: 4704 Leiper Street, Philadelphia, PA 19124

---

## 🔧 Technical Support

### Common Issues

**Problem**: Changes not appearing on public pages
**Solution**: Clear browser cache (Cmd+Shift+R on Mac) or wait 24-48 hours for cache to refresh

**Problem**: Programs not loading in admin panel
**Solution**: Check browser console for errors, verify Firebase connection is active

**Problem**: Cannot save program
**Solution**: Ensure all required fields are filled and you have valid Firebase credentials

**Problem**: Edit modal not opening
**Solution**: Check browser console for JavaScript errors, refresh page

---

## 📱 Responsive Design

All program pages are responsive and work on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All modern browsers

---

## 📞 Support Programs

### Early Intervention Services
- **Location**: 4704 Leiper Street, Philadelphia, PA 19124
- **Phone**: 484-566-7311
- **Email**: admin@eiforei.org

### General Contact
- Visit the Contact Us page for general inquiries
- Use the contact button on any program page

---

## 📚 Resources

- **Main Website**: https://eieiservices.com/
- **Admin Panel**: `/admin-programs.html`
- **Program List**: `/program.html`
- **Contact**: `/contact-us.html`
- **About**: `/about.html`

---

**Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready ✅
