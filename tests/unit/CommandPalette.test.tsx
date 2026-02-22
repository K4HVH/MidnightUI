import { render, fireEvent, screen } from '@solidjs/testing-library';
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CommandPalette,
  createCommandItem,
  isReservedShortcut,
  RESERVED_SHORTCUTS,
  type CommandPaletteItem,
} from '../../src/components/navigation/CommandPalette';

const createItems = (onSelect = vi.fn()): CommandPaletteItem[] => [
  { id: 'save', label: 'Save File', onSelect, shortcut: 'Ctrl+S', group: 'File' },
  { id: 'open', label: 'Open File', onSelect, group: 'File' },
  { id: 'settings', label: 'Settings', onSelect, description: 'Configure preferences', group: 'General' },
  { id: 'profile', label: 'Edit Profile', onSelect, tags: ['Account'], group: 'General' },
  { id: 'disabled', label: 'Disabled Action', onSelect, disabled: true },
];

describe('CommandPalette', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  // ── Rendering ──────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders when open is true', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      render(() => (
        <CommandPalette open={false} onClose={() => {}} items={createItems()} />
      ));
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).not.toBeInTheDocument();
    });

    it('renders search input with default placeholder', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.placeholder).toBe('Search commands...');
    });

    it('renders custom placeholder', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} placeholder="Type here..." />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      expect(input.placeholder).toBe('Type here...');
    });

    it('renders all items', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(5);
    });

    it('renders group headers', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const headers = document.querySelectorAll('.command-palette__group-header');
      // "File" and "General" groups + ungrouped "Disabled Action"
      expect(headers.length).toBe(2);
      expect(headers[0].textContent).toBe('File');
      expect(headers[1].textContent).toBe('General');
    });

    it('renders item labels', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      expect(screen.getByText('Save File')).toBeInTheDocument();
      expect(screen.getByText('Open File')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders item descriptions', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      expect(screen.getByText('Configure preferences')).toBeInTheDocument();
    });

    it('renders shortcut badges', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const shortcut = document.querySelector('.command-palette__shortcut');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut!.textContent).toBe('Ctrl+S');
    });

    it('renders tags as Chips', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      expect(screen.getByText('Account')).toBeInTheDocument();
    });

    it('renders footer with keyboard hints', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const footer = document.querySelector('.command-palette__footer');
      expect(footer).toBeInTheDocument();
      expect(footer!.textContent).toContain('navigate');
      expect(footer!.textContent).toContain('select');
      expect(footer!.textContent).toContain('close');
    });

    it('renders disabled items with disabled class', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const disabledItem = document.querySelector('.command-palette__item--disabled');
      expect(disabledItem).toBeInTheDocument();
    });

    it('applies custom class', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} class="custom-class" />
      ));
      const palette = document.querySelector('.command-palette.custom-class');
      expect(palette).toBeInTheDocument();
    });
  });

  // ── Size variants ──────────────────────────────────────────────────────

  describe('size variants', () => {
    it('applies no size class for normal (default)', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const palette = document.querySelector('.command-palette');
      expect(palette).toBeInTheDocument();
      expect(palette!.classList.contains('command-palette--compact')).toBe(false);
      expect(palette!.classList.contains('command-palette--spacious')).toBe(false);
    });

    it('applies compact size class', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} size="compact" />
      ));
      const palette = document.querySelector('.command-palette--compact');
      expect(palette).toBeInTheDocument();
    });

    it('applies spacious size class', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} size="spacious" />
      ));
      const palette = document.querySelector('.command-palette--spacious');
      expect(palette).toBeInTheDocument();
    });
  });

  // ── Filtering ──────────────────────────────────────────────────────────

  describe('filtering', () => {
    it('filters items by label', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'Save' } });

      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(1);
      expect(screen.getByText('Save File')).toBeInTheDocument();
    });

    it('filters items by description', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'preferences' } });

      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(1);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('filters items by group name', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'General' } });

      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(2); // Settings + Edit Profile
    });

    it('filters items by tags', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'Account' } });

      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(1);
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('filters items by keywords', async () => {
      const items: CommandPaletteItem[] = [
        { id: 'audit', label: 'Security Audit', onSelect: vi.fn(), keywords: ['vulnerability', 'scan'] },
        { id: 'other', label: 'Other Action', onSelect: vi.fn() },
      ];
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'vulnerability' } });

      const resultItems = document.querySelectorAll('.command-palette__item');
      expect(resultItems.length).toBe(1);
    });

    it('performs fuzzy matching', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'svfl' } }); // fuzzy match for "Save File"

      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(1);
      expect(screen.getByText('Save File')).toBeInTheDocument();
    });

    it('shows empty state when no results match', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'zzzznonexistent' } });

      const empty = document.querySelector('.command-palette__empty');
      expect(empty).toBeInTheDocument();
      expect(empty!.textContent).toBe('No commands found');
    });

    it('shows custom empty message', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} emptyMessage="Nothing here" />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'zzzznonexistent' } });

      const empty = document.querySelector('.command-palette__empty');
      expect(empty!.textContent).toBe('Nothing here');
    });

    it('shows clear button when query is non-empty', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      // Initially no clear button
      expect(document.querySelector('.command-palette__clear')).not.toBeInTheDocument();

      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'test' } });

      expect(document.querySelector('.command-palette__clear')).toBeInTheDocument();
    });

    it('clears query when clear button is clicked', async () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.input(input, { target: { value: 'test' } });

      const clearBtn = document.querySelector('.command-palette__clear') as HTMLButtonElement;
      fireEvent.click(clearBtn);

      expect(input.value).toBe('');
      // All items should be visible again
      const items = document.querySelectorAll('.command-palette__item');
      expect(items.length).toBe(5);
    });
  });

  // ── Keyboard navigation ────────────────────────────────────────────────

  describe('keyboard navigation', () => {
    it('highlights first item by default', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const activeItem = document.querySelector('.command-palette__item--active');
      expect(activeItem).toBeInTheDocument();
      // Ungrouped items come first, then grouped. First item in flat list is the ungrouped disabled one.
      expect(activeItem!.textContent).toContain('Disabled Action');
    });

    it('moves highlight down with ArrowDown', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      const activeItem = document.querySelector('.command-palette__item--active');
      expect(activeItem).toBeInTheDocument();
    });

    it('moves highlight up with ArrowUp', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      // Go down then up
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      const activeItem = document.querySelector('.command-palette__item--active');
      expect(activeItem).toBeInTheDocument();
    });

    it('wraps around from last to first', () => {
      const items: CommandPaletteItem[] = [
        { id: '1', label: 'First', onSelect: vi.fn() },
        { id: '2', label: 'Second', onSelect: vi.fn() },
      ];
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const activeItem = document.querySelector('.command-palette__item--active');
      expect(activeItem!.textContent).toContain('First');
    });

    it('selects item with Enter', () => {
      const onSelect = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: '1', label: 'Action', onSelect },
      ];
      const onClose = vi.fn();
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not select disabled item with Enter', () => {
      const onSelect = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: '1', label: 'Disabled', onSelect, disabled: true },
      ];
      const onClose = vi.fn();
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onSelect).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('resets active index when query changes', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      // Move down a few
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // Type to filter
      fireEvent.input(input, { target: { value: 'Save' } });

      // First item should be active again
      const activeItem = document.querySelector('.command-palette__item--active');
      expect(activeItem).toBeInTheDocument();
    });
  });

  // ── Dismissal ──────────────────────────────────────────────────────────

  describe('dismissal', () => {
    it('calls onClose when Escape is pressed', () => {
      const onClose = vi.fn();
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={createItems()} />
      ));
      const backdrop = document.querySelector('.command-palette__backdrop');
      fireEvent.click(backdrop!);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when backdrop click is disabled', () => {
      const onClose = vi.fn();
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={createItems()} dismissOnBackdrop={false} />
      ));
      const backdrop = document.querySelector('.command-palette__backdrop');
      fireEvent.click(backdrop!);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when palette content is clicked', () => {
      const onClose = vi.fn();
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={createItems()} />
      ));
      const palette = document.querySelector('.command-palette');
      fireEvent.click(palette!);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ── Item selection ─────────────────────────────────────────────────────

  describe('item selection', () => {
    it('calls onSelect and onClose when item is clicked', () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: '1', label: 'Action', onSelect },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const item = document.querySelector('.command-palette__item') as HTMLElement;
      fireEvent.click(item);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onSelect when disabled item is clicked', () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: '1', label: 'Disabled', onSelect, disabled: true },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const item = document.querySelector('.command-palette__item') as HTMLElement;
      fireEvent.click(item);
      expect(onSelect).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('highlights item on mouse enter', () => {
      const items: CommandPaletteItem[] = [
        { id: '1', label: 'First', onSelect: vi.fn() },
        { id: '2', label: 'Second', onSelect: vi.fn() },
      ];
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={items} />
      ));
      const secondItem = document.querySelectorAll('.command-palette__item')[1] as HTMLElement;
      fireEvent.mouseEnter(secondItem);

      expect(secondItem.classList.contains('command-palette__item--active')).toBe(true);
    });
  });

  // ── Body scroll ────────────────────────────────────────────────────────

  describe('body scroll lock', () => {
    it('locks body scroll when open', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  // ── Accessibility ──────────────────────────────────────────────────────

  describe('accessibility', () => {
    it('has dialog role and aria-modal', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog!.getAttribute('aria-modal')).toBe('true');
    });

    it('has combobox role on input', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('[role="combobox"]');
      expect(input).toBeInTheDocument();
    });

    it('has listbox role on results list', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const list = document.querySelector('[role="listbox"]');
      expect(list).toBeInTheDocument();
    });

    it('has option role on items', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const options = document.querySelectorAll('[role="option"]');
      expect(options.length).toBe(5);
    });

    it('sets aria-selected on active item', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const activeOption = document.querySelector('[aria-selected="true"]');
      expect(activeOption).toBeInTheDocument();
    });

    it('sets aria-disabled on disabled items', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const disabledOption = document.querySelector('[aria-disabled="true"]');
      expect(disabledOption).toBeInTheDocument();
    });

    it('has aria-label on dialog', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog!.getAttribute('aria-label')).toBe('Command palette');
    });

    it('has aria-label on search input', () => {
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={createItems()} />
      ));
      const input = document.querySelector('.command-palette__input');
      expect(input!.getAttribute('aria-label')).toBe('Search commands');
    });
  });

  // ── Shortcut key interception ──────────────────────────────────────────
  // The capture handler only intercepts keypresses that match a registered
  // (non-reserved, non-disabled) item shortcut.  Everything else — text-
  // editing combos, unregistered modifier keys, etc. — passes through.

  describe('shortcut key interception', () => {
    it('triggers item onSelect when Ctrl+O is pressed on the focused input', () => {
      const onSelectOpen = vi.fn();
      const onSelectSave = vi.fn();
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'open', label: 'Open File', shortcut: 'Ctrl+O', onSelect: onSelectOpen },
        { id: 'save', label: 'Save File', shortcut: 'Ctrl+S', onSelect: onSelectSave },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', {
        key: 'o',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      const prevented = !input.dispatchEvent(event);
      expect(onSelectOpen).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(prevented).toBe(true);
    });

    it('triggers item onSelect when Alt+N is pressed on the focused input', () => {
      const onSelectNew = vi.fn();
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'new', label: 'New File', shortcut: 'Alt+N', onSelect: onSelectNew },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', {
        key: 'n',
        altKey: true,
        bubbles: true,
        cancelable: true,
      });
      const prevented = !input.dispatchEvent(event);
      expect(onSelectNew).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(prevented).toBe(true);
    });

    it('does not intercept unregistered modifier combos (no blanket blocking)', () => {
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', onSelect: vi.fn() },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      // Ctrl+P has no matching item — should pass through naturally
      const event = new KeyboardEvent('keydown', {
        key: 'p',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      const prevented = !input.dispatchEvent(event);
      expect(prevented).toBe(false);
    });

    it('does not trigger disabled item via shortcut', () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'del', label: 'Delete', shortcut: 'Ctrl+D', onSelect, disabled: true },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', {
        key: 'd',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);
      expect(onSelect).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it('handles Ctrl+Shift+F shortcut correctly', () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'find', label: 'Find in Files', shortcut: 'Ctrl+Shift+F', onSelect },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', {
        key: 'F',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      const prevented = !input.dispatchEvent(event);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(prevented).toBe(true);
    });

    it('does not intercept shortcuts when palette is closed', () => {
      const onSelect = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'open', label: 'Open File', shortcut: 'Ctrl+O', onSelect },
      ];
      render(() => (
        <CommandPalette open={false} onClose={() => {}} items={items} />
      ));
      const event = new KeyboardEvent('keydown', {
        key: 'o',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      const prevented = !document.dispatchEvent(event);
      expect(onSelect).not.toHaveBeenCalled();
      expect(prevented).toBe(false);
    });

    it('lets text-editing combos (Ctrl+A/C/V/X/Z) pass through naturally', () => {
      const onClose = vi.fn();
      const items: CommandPaletteItem[] = [
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', onSelect: vi.fn() },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;

      for (const key of ['a', 'c', 'v', 'x', 'z']) {
        const event = new KeyboardEvent('keydown', {
          key,
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        });
        const prevented = !input.dispatchEvent(event);
        expect(prevented).toBe(false);
      }
      expect(onClose).not.toHaveBeenCalled();
    });

    it('ignores reserved shortcuts even when assigned to items', () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const items: CommandPaletteItem[] = [
        { id: 'all', label: 'Select All', shortcut: 'Ctrl+A', onSelect },
      ];
      render(() => (
        <CommandPalette open={true} onClose={onClose} items={items} />
      ));
      const input = document.querySelector('.command-palette__input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      const prevented = !input.dispatchEvent(event);
      // Reserved shortcut is NOT intercepted — passes through naturally
      expect(onSelect).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(prevented).toBe(false);
      warnSpy.mockRestore();
    });

    it('does not display shortcut badge for reserved shortcuts', () => {
      const items: CommandPaletteItem[] = [
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onSelect: vi.fn() },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', onSelect: vi.fn() },
      ];
      render(() => (
        <CommandPalette open={true} onClose={() => {}} items={items} />
      ));
      const badges = document.querySelectorAll('.command-palette__shortcut');
      // Only Ctrl+S should have a badge — Ctrl+C is reserved
      expect(badges.length).toBe(1);
      expect(badges[0].textContent).toBe('Ctrl+S');
    });
  });

  // ── Reserved shortcut validation ───────────────────────────────────────

  describe('reserved shortcut validation', () => {
    it('isReservedShortcut returns true for browser-reserved shortcuts', () => {
      expect(isReservedShortcut('Ctrl+N')).toBe(true);
      expect(isReservedShortcut('Ctrl+T')).toBe(true);
      expect(isReservedShortcut('Ctrl+W')).toBe(true);
      expect(isReservedShortcut('Cmd+N')).toBe(true);
    });

    it('isReservedShortcut returns true for text-editing shortcuts', () => {
      expect(isReservedShortcut('Ctrl+A')).toBe(true);
      expect(isReservedShortcut('Ctrl+C')).toBe(true);
      expect(isReservedShortcut('Ctrl+V')).toBe(true);
      expect(isReservedShortcut('Ctrl+X')).toBe(true);
      expect(isReservedShortcut('Ctrl+Z')).toBe(true);
      expect(isReservedShortcut('Ctrl+Y')).toBe(true);
      expect(isReservedShortcut('Cmd+C')).toBe(true);
    });

    it('isReservedShortcut returns false for non-reserved shortcuts', () => {
      expect(isReservedShortcut('Ctrl+O')).toBe(false);
      expect(isReservedShortcut('Ctrl+S')).toBe(false);
      expect(isReservedShortcut('Alt+N')).toBe(false);
      expect(isReservedShortcut('Ctrl+Shift+F')).toBe(false);
    });

    it('isReservedShortcut is case-insensitive', () => {
      expect(isReservedShortcut('ctrl+n')).toBe(true);
      expect(isReservedShortcut('CTRL+A')).toBe(true);
      expect(isReservedShortcut('Cmd+v')).toBe(true);
    });

    it('RESERVED_SHORTCUTS set contains expected entries', () => {
      expect(RESERVED_SHORTCUTS.size).toBe(9);
      expect(RESERVED_SHORTCUTS.has('ctrl+n')).toBe(true);
      expect(RESERVED_SHORTCUTS.has('ctrl+a')).toBe(true);
    });

    it('createCommandItem warns for reserved shortcuts at runtime', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      createCommandItem({ id: 'a', label: 'Open', shortcut: 'Ctrl+O', onSelect: () => {} });
      expect(warnSpy).not.toHaveBeenCalled();

      createCommandItem({ id: 'b', label: 'Bad', shortcut: 'Ctrl+N', onSelect: () => {} });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('reserved shortcut');
      warnSpy.mockRestore();
    });
  });
});
