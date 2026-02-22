import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { CommandPalette, type CommandPaletteItem } from '../../../components/navigation/CommandPalette';
import {
  BsFileText, BsGear, BsPerson, BsSearch, BsFolder,
  BsStar, BsTrash, BsPencil, BsDownload, BsUpload,
  BsBell, BsPalette, BsTerminal, BsGlobe, BsShield,
} from 'solid-icons/bs';

const CommandPaletteDemo: Component = () => {
  const [basicOpen, setBasicOpen] = createSignal(false);
  const [groupedOpen, setGroupedOpen] = createSignal(false);
  const [richOpen, setRichOpen] = createSignal(false);
  const [compactOpen, setCompactOpen] = createSignal(false);
  const [spaciousOpen, setSpaciousOpen] = createSignal(false);
  const [keybindingOpen, setKeybindingOpen] = createSignal(false);
  const [lastAction, setLastAction] = createSignal('None');

  const basicItems: CommandPaletteItem[] = [
    { id: 'new-file', label: 'New File', icon: BsFileText, onSelect: () => setLastAction('New File') },
    { id: 'open-file', label: 'Open File', icon: BsFolder, onSelect: () => setLastAction('Open File') },
    { id: 'save', label: 'Save', icon: BsDownload, shortcut: 'Ctrl+S', onSelect: () => setLastAction('Save') },
    { id: 'search', label: 'Search in Files', icon: BsSearch, shortcut: 'Ctrl+Shift+F', onSelect: () => setLastAction('Search in Files') },
    { id: 'settings', label: 'Settings', icon: BsGear, onSelect: () => setLastAction('Settings') },
    { id: 'profile', label: 'Profile', icon: BsPerson, onSelect: () => setLastAction('Profile') },
  ];

  const groupedItems: CommandPaletteItem[] = [
    { id: 'new-file', label: 'New File', icon: BsFileText, group: 'File', shortcut: 'Alt+N', onSelect: () => setLastAction('New File') },
    { id: 'open-file', label: 'Open File', icon: BsFolder, group: 'File', shortcut: 'Ctrl+O', onSelect: () => setLastAction('Open File') },
    { id: 'save', label: 'Save', icon: BsDownload, group: 'File', shortcut: 'Ctrl+S', onSelect: () => setLastAction('Save') },
    { id: 'upload', label: 'Upload', icon: BsUpload, group: 'File', onSelect: () => setLastAction('Upload') },
    { id: 'edit', label: 'Edit Selection', icon: BsPencil, group: 'Edit', onSelect: () => setLastAction('Edit Selection') },
    { id: 'find', label: 'Find and Replace', icon: BsSearch, group: 'Edit', shortcut: 'Ctrl+H', onSelect: () => setLastAction('Find and Replace') },
    { id: 'favorites', label: 'Favorites', icon: BsStar, group: 'View', onSelect: () => setLastAction('Favorites') },
    { id: 'notifications', label: 'Notifications', icon: BsBell, group: 'View', onSelect: () => setLastAction('Notifications') },
    { id: 'delete', label: 'Delete Item', icon: BsTrash, group: 'Danger', disabled: true, onSelect: () => setLastAction('Delete') },
  ];

  const richItems: CommandPaletteItem[] = [
    {
      id: 'theme',
      label: 'Change Theme',
      description: 'Switch between light and dark themes',
      icon: BsPalette,
      group: 'Appearance',
      tags: ['UI'],
      onSelect: () => setLastAction('Change Theme'),
    },
    {
      id: 'terminal',
      label: 'Open Terminal',
      description: 'Launch integrated terminal session',
      icon: BsTerminal,
      group: 'Tools',
      shortcut: 'Ctrl+`',
      tags: ['Dev'],
      onSelect: () => setLastAction('Open Terminal'),
    },
    {
      id: 'deploy',
      label: 'Deploy to Production',
      description: 'Build and deploy the current project',
      icon: BsGlobe,
      group: 'Tools',
      tags: ['CI/CD', 'Production'],
      onSelect: () => setLastAction('Deploy to Production'),
    },
    {
      id: 'security',
      label: 'Security Audit',
      description: 'Run security vulnerability scan',
      icon: BsShield,
      group: 'Tools',
      tags: ['Security'],
      keywords: ['vulnerability', 'scan', 'audit'],
      onSelect: () => setLastAction('Security Audit'),
    },
    {
      id: 'profile',
      label: 'Edit Profile',
      description: 'Update your account settings and preferences',
      icon: BsPerson,
      group: 'Account',
      onSelect: () => setLastAction('Edit Profile'),
    },
    {
      id: 'notifications-settings',
      label: 'Notification Preferences',
      description: 'Configure how you receive alerts and updates',
      icon: BsBell,
      group: 'Account',
      tags: ['Settings'],
      onSelect: () => setLastAction('Notification Preferences'),
    },
  ];

  return (
    <>
      <h2>CommandPalette Component Examples</h2>

      <Card>
        <CardHeader title="Last Action" />
        <p>Selected command: <strong>{lastAction()}</strong></p>
      </Card>

      <Card>
        <CardHeader title="Basic Command Palette" />
        <p>Simple list of commands with icons and keyboard shortcuts.</p>
        <div class="flex--sm">
          <Button onClick={() => setBasicOpen(true)}>Open Command Palette</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Grouped Commands" />
        <p>Commands organized into categories with group headers. Includes a disabled item.</p>
        <div class="flex--sm">
          <Button onClick={() => setGroupedOpen(true)}>Open Grouped Palette</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Rich Items" />
        <p>Commands with descriptions, tags/badges, and keyword search support.</p>
        <div class="flex--sm">
          <Button onClick={() => setRichOpen(true)}>Open Rich Palette</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Size Variants" />
        <div class="flex--sm flex--wrap">
          <Button onClick={() => setCompactOpen(true)}>Compact</Button>
          <Button onClick={() => setBasicOpen(true)}>Normal (default)</Button>
          <Button onClick={() => setSpaciousOpen(true)}>Spacious</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Keybinding Support" />
        <p>This palette can be toggled with <kbd>Ctrl+K</kbd> / <kbd>⌘+K</kbd>. Try it!</p>
        <div class="flex--sm">
          <Button onClick={() => setKeybindingOpen(true)}>Open Keybinding Palette</Button>
        </div>
      </Card>

      {/* Palette instances */}
      <CommandPalette
        open={basicOpen()}
        onClose={() => setBasicOpen(false)}
        items={basicItems}
      />

      <CommandPalette
        open={groupedOpen()}
        onClose={() => setGroupedOpen(false)}
        items={groupedItems}
        placeholder="Type a command..."
      />

      <CommandPalette
        open={richOpen()}
        onClose={() => setRichOpen(false)}
        items={richItems}
        placeholder="Search actions..."
      />

      <CommandPalette
        open={compactOpen()}
        onClose={() => setCompactOpen(false)}
        items={basicItems}
        size="compact"
        placeholder="Quick command..."
      />

      <CommandPalette
        open={spaciousOpen()}
        onClose={() => setSpaciousOpen(false)}
        items={richItems}
        size="spacious"
      />

      <CommandPalette
        open={keybindingOpen()}
        onClose={() => setKeybindingOpen(false)}
        items={groupedItems}
        keybinding
        onKeybinding={() => setKeybindingOpen((prev) => !prev)}
        placeholder="Search commands..."
      />
    </>
  );
};

export default CommandPaletteDemo;
