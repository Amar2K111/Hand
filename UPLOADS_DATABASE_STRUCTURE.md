# Database Structure

This document explains the database structure for managing users, uploads, and critiques in Firestore.

## User Document Structure

Each user document in the `users` collection contains the following fields:

```javascript
{
  // ... other user fields ...
  uploadsRemaining: number,        // Number of uploads user can use anytime (default: 0)
  totalUploads: number,            // Total uploads ever made by user (default: 0)
  email: string,
  displayName: string,
  createdAt: Date,
  onboardingCompleted: boolean,
  onboardingData: object
}
```

## Critiques Subcollection Structure

Each user has a `critiques` subcollection containing their hand critiques:

```javascript
// Path: users/{userId}/critiques/{critiqueId}
{
  imageUrl: string,                // Base64 encoded image
  score: number,                   // Hand rating score (1-100)
  critique: string,                // Main critique text
  strengths: string[],             // Array of strengths
  improvements: string[],          // Array of improvements
  verdict: string,                 // Final verdict
  createdAt: Date                  // When critique was created
}
```

## Manual Database Modifications

### To modify a user's uploads remaining:

1. Go to Firebase Console → Firestore Database
2. Navigate to the `users` collection
3. Find the user document by their UID
4. Edit the following fields:

#### Give more uploads to a user:
```javascript
uploadsRemaining: 20,  // Set to desired number
```

#### Add extra uploads:
```javascript
uploadsRemaining: uploadsRemaining + 5  // Add 5 more uploads
```

### Example User Document:
```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  createdAt: "2024-01-01T00:00:00Z",
  onboardingCompleted: true,
  uploadsRemaining: 10,
  totalUploads: 5
}
```

## Database Structure Benefits

### Nested Structure (Current)
```
users/
├── {userId}/
│   ├── uploadsRemaining: number
│   ├── totalUploads: number
│   └── critiques/ (subcollection)
│       ├── {critiqueId1}/
│       ├── {critiqueId2}/
│       └── {critiqueId3}/
```

### Benefits:
- **Better organization**: Critiques belong to users
- **Better security**: Easier to set up Firestore security rules
- **Better performance**: No need to filter by userId
- **Better scalability**: Each user's data is isolated

## Automatic Features

- New users start with 0 uploads when they sign up
- The system tracks total uploads across all time
- Uploads can be decremented when users upload content
- Uploads can be added when needed
- No automatic refill of uploads - users must purchase credits
- Critiques are automatically saved to user's subcollection

## API Functions Available

The `useUploads` hook provides these functions:
- `decrementUploads()` - Decrease uploads by 1
- `addUploads(amount)` - Add more uploads to user's account
- `canUpload()` - Check if user can upload
- `getUploadsUsed()` - Get total number of uploads used
