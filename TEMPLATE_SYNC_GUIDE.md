# Template Sync Guide

This document explains how to use MidnightUI as a base template for new applications while maintaining the ability to sync updates bidirectionally.

## Overview

This setup allows you to:
- Create new projects based on this template
- Pull bug fixes and new components from the template into your projects
- Push fixes from your projects back to the template
- Keep projects independent with their own repositories

## Creating a New Project from Template

### Step 1: Create and Initialize New Project

```bash
# Create new project directory
mkdir my-new-app
cd my-new-app

# Initialize as a new Git repository
git init

# Add the template as a remote called "template"
git remote add template <base-template-repo-url>

# Pull the template code
git pull template main --allow-unrelated-histories

# Set up your new project's remote
git remote add origin <your-new-project-repo-url>

# Push to your new project repository
git push -u origin main
```

### Step 2: Customize Your New Project

Now you can:
- Modify `package.json` (name, description, version)
- Update `README.md` with your project details
- Add project-specific features
- Customize components as needed

```bash
# Commit your customizations
git add .
git commit -m "Customize for my-new-app"
git push
```

---

## Syncing Updates

### Pulling Updates from Template → Project

When the base template has bug fixes or new components:

```bash
# Fetch latest changes from template
git fetch template

# View what's changed
git log HEAD..template/main --oneline

# Merge all changes
git merge template/main

# Resolve any conflicts if they occur
# Then commit and push
git push origin main
```

#### Cherry-Picking Specific Changes

If you only want specific updates:

```bash
# Fetch changes
git fetch template

# View commits
git log template/main --oneline

# Cherry-pick specific commits
git cherry-pick <commit-hash>

# Push to your project
git push origin main
```

### Pushing Fixes from Project → Template

When you fix a bug in a base component and want to share it back:

```bash
# Create a new branch for your fix
git checkout -b fix/button-hover-bug

# Make changes to base components only
# Edit: src/components/inputs/Button.tsx (example)
# Commit your fix
git add src/components/inputs/Button.tsx
git commit -m "Fix: Button hover state in dark mode"

# Push to the template repository
git push template fix/button-hover-bug

# Then create a Pull Request on the template repository
```

**Important:** Only push changes that are relevant to the base template (fixes to shared components, not project-specific features).

---

## Best Practices

### 1. Keep Base Components Separate

- Don't modify base components for project-specific needs
- Instead, extend or wrap them in your project
- This makes syncing easier

Example:
```tsx
// ❌ Don't modify: src/components/inputs/Button.tsx

// ✅ Do create: src/project/CustomButton.tsx
import { Button } from '@/components/inputs/Button';

export function CustomButton(props) {
  return <Button {...props} className="custom-style" />;
}
```

### 2. Use Clear Commit Messages

When committing fixes you plan to push back:
```bash
git commit -m "Fix: [Component] - Description"
git commit -m "Feat: [Component] - New feature"
git commit -m "Docs: Update component documentation"
```

### 3. Regular Syncing

- Pull from template monthly (or as needed)
- Creates a habit and prevents large, complex merges

### 4. Document Your Changes

Keep track of:
- Which base components you've modified
- Project-specific components you've added
- Custom configurations

### 5. Branch Strategy

**In your project:**
- `main` - production code
- `feature/*` - new features
- `fix/*` - bug fixes

**When pushing to template:**
- Always use feature branches
- Never push directly to template's `main`

---

## Common Scenarios

### Scenario 1: Template Gets a New Component

```bash
cd my-new-app
git fetch template
git merge template/main
# New component is now in src/components/
git push origin main
```

### Scenario 2: You Fix a Bug in a Base Component

```bash
# In your project
git checkout -b fix/dialog-close-button
# Fix the bug in src/components/feedback/Dialog.tsx
git add src/components/feedback/Dialog.tsx
git commit -m "Fix: Dialog close button accessibility"

# Push to template for review
git push template fix/dialog-close-button
# Create PR on template repo

# Also merge into your project
git checkout main
git merge fix/dialog-close-button
git push origin main
```

### Scenario 3: Conflict During Sync

```bash
git fetch template
git merge template/main

# If conflicts occur:
# 1. Open conflicted files
# 2. Resolve conflicts (keep your changes or template changes)
# 3. Mark as resolved
git add <conflicted-files>
git commit -m "Merge template updates, resolve conflicts"
git push origin main
```

### Scenario 4: You Want to Ignore Template Updates for a File

If you've heavily customized a component and don't want template updates:

```bash
# Create .gitattributes in your project
echo "src/components/inputs/Button.tsx merge=ours" >> .gitattributes
git config merge.ours.driver true
```

---

## Checking Your Remotes

To see your configured remotes:

```bash
git remote -v
```

Expected output in a new project:
```
origin    <your-project-repo-url> (fetch)
origin    <your-project-repo-url> (push)
template  <base-template-repo-url> (fetch)
template  <base-template-repo-url> (push)
```

---

## Troubleshooting

### "fatal: refusing to merge unrelated histories"

When first pulling the template:
```bash
git pull template main --allow-unrelated-histories
```

### Can't Push to Template

Ensure you have write access to the template repository. If it's your own repo, check:
```bash
git remote -v
# Verify template URL is correct
```

### Too Many Conflicts

If syncing creates too many conflicts, consider:
1. Cherry-picking only the commits you need
2. Manually copying updated components
3. Restructuring your project to separate base and custom code more clearly

## Quick Reference

```bash
# Create new project from template
git init && git remote add template <base-url> && git pull template main --allow-unrelated-histories

# Pull updates
git fetch template && git merge template/main

# Push fixes back
git checkout -b fix/component-bug && git push template fix/component-bug

# Check remotes
git remote -v

# View template changes
git fetch template && git log HEAD..template/main --oneline
```

---

## Notes

- Keep the template repository clean and focused on reusable components
- Use projects for application-specific features
- Document any breaking changes in the template's commit messages
- Consider using semantic versioning tags in the template for major updates

For questions or issues, refer to Git documentation or create an issue in the base template repository.
