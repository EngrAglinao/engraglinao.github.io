# Portfolio Data Manager - User Guide

## Overview
This system allows you to manage all your portfolio data in a centralized `data.json` file and easily update your `index.html` through a user-friendly web interface.

## Files

1. **data.json** - Central data storage for all portfolio information
2. **manage.html** - Web interface to edit, add, and delete portfolio data
3. **sync.js** - Script that synchronizes data from `data.json` to `index.html`

## How to Use

### Opening the Manager
1. Open `manage.html` in your web browser
2. You'll see a tabbed interface with different sections

### Available Tabs

#### 1. **About Me Tab**
Edit your personal information (name fields are not editable):
- Professional Title
- Email & Contact Number
- City & Website
- Birth Date
- Bio/Description
- Degree & Freelance Status

**Action:** Click "Save About Me" to update changes

#### 2. **Social Links Tab**
Manage your social media profiles:
- Facebook URL
- Instagram URL
- LinkedIn URL

**Action:** Click "Save Social Links" to update changes

#### 3. **Skills Tab**
Add, view, edit, or delete your technical skills:
- Click "+ Add Skill" button to add new skills
- Enter skill name and proficiency percentage (0-100)
- **Edit existing skills** by clicking the "Edit" button next to any skill
- Delete skills you no longer want to display

**Actions:** 
- Click "Add Skill" to add new skills
- Click "Edit" button next to a skill to modify it
- Click "Delete" button next to a skill to remove it

#### 4. **Education Tab**
Manage your educational background:
- Click "+ Add Education" button to add new education records
- Fill in Level (Tertiary, Secondary, Primary), Years, Degree/School name, and Location
- **Edit existing education records** by clicking the "Edit" button next to any record
- Delete educational records as needed

**Actions:**
- Click "Add Education" to add new education record
- Click "Edit" button next to a record to modify it
- Click "Delete" button next to a record to remove it

#### 5. **Experience Tab**
Manage your professional experience:
- Click "+ Add Experience" button to add new job positions
- Fill in Position, Years worked, Company name, and Job description
- **Edit existing experience entries** by clicking the "Edit" button next to any entry
- Delete experience entries as needed

**Actions:**
- Click "Add Experience" to add new experience
- Click "Edit" button next to an entry to modify it
- Click "Delete" button next to an entry to remove it

#### 6. **Export/Import Tab**
- View all your data in JSON format
- Click "📥 Export JSON" to download your data as a backup
- Click "🔄 Sync to index.html" to apply changes

## How Data Syncing Works

### Automatic Sync
When you open `index.html`, the `sync.js` script automatically:
1. **First checks localStorage** for immediate changes from `manage.html`
2. **Falls back to `data.json`** if no local changes exist
3. Updates all sections of your portfolio
4. Keeps your display in sync with your data

### Manual Updates (For Permanent Storage)
1. Make changes in `manage.html`
2. Data is saved to browser's localStorage (temporary)
3. Click "💾 Sync to File" in the Export/Import tab
4. Download the updated `data.json` file
5. Replace your existing `data.json` file with the downloaded one
6. Refresh `index.html` to see permanent changes

### Quick Testing
- Changes in `manage.html` are immediately visible in `index.html` when refreshed
- Use "🗑️ Clear Local Data" to reset to original `data.json`
- Use "📥 Export JSON" to backup your current data

## Important Notes

### Data Storage
- Changes are saved to **local storage** in your browser
- To persist changes permanently, you'll need to:
  - Export the JSON data
  - Upload the updated `data.json` file to your server

### Age Calculation
The age is automatically calculated from your birth date. You don't need to update it manually - it will always show your current age!

### Browser Compatibility
Works best in modern browsers:
- Chrome/Brave
- Firefox
- Safari
- Edge

## Workflow Example

1. Open `manage.html`
2. Go to the "About Me" tab
3. Update your bio or title
4. Click "Save About Me" (changes saved to browser)
5. **Refresh `index.html`** in another tab to see immediate changes
6. Go to the "Skills" tab in `manage.html`
7. Add new skills like "Python" or "React", or **edit existing skills**
8. Go to "Export/Import" tab
9. Click "💾 Sync to File" to download updated `data.json`
10. Replace your existing `data.json` file with the downloaded one
11. Your changes are now permanently saved!

## Tips

- **Test Changes Immediately**: Open both `manage.html` and `index.html` in different tabs
- **Backup Often**: Regularly click "📥 Export JSON" to download your data
- **Use Sync to File**: For permanent changes, always download the updated `data.json`
- **Clear Local Data**: Use "🗑️ Clear Local Data" to reset to original state
- **Refresh to Test**: Always refresh `index.html` to see your changes

## Tips

- **Backup Often**: Regularly click "Export JSON" to download your data
- **Use Descriptions**: Add detailed job descriptions to make your experience stand out
- **Update Skills**: Keep your skills section updated with current technologies
- **Keep Links Current**: Ensure all social media links are correct and accessible

## Troubleshooting

### Changes not showing in index.html?
- Clear your browser cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Ensure `sync.js` is loaded (check browser console)

### Data not saving?
- Check if browser's local storage is enabled
- Try a different browser
- Check browser console for errors (F12)

## Need Help?

Refer to the JSON structure in the Export/Import tab to understand the data format. Each section of `manage.html` corresponds to a section in the JSON file.
