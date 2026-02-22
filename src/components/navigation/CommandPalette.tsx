import {
  Component,
  Show,
  For,
  createSignal,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { BsSearch, BsX } from 'solid-icons/bs';
import { Chip } from '../display/Chip';
import { generateId } from '../../utils/generateId';
import '../../styles/components/navigation/CommandPalette.css';

// ─── Reserved Shortcuts ──────────────────────────────────────────────────────

/**
 * Modifier + key combinations that cannot or should not be used as
 * CommandPalette item shortcuts.
 *
 * - **Browser-reserved** (Ctrl/Cmd + N, T, W): handled at the browser-chrome
 *   level — JavaScript never receives these events.
 * - **Text-editing** (Ctrl/Cmd + A, C, V, X, Z, Y): conflict with standard
 *   text editing in the search input (select-all, copy, paste, cut, undo, redo).
 */
type ReservedModifier = 'Ctrl' | 'Cmd';
type BrowserReservedLetter = 'N' | 'T' | 'W';
type TextEditingLetter = 'A' | 'C' | 'V' | 'X' | 'Z' | 'Y';
type ReservedLetter = BrowserReservedLetter | TextEditingLetter;

/** Union of all reserved shortcut strings (both cases). */
export type ReservedShortcut =
  | `${ReservedModifier}+${ReservedLetter}`
  | `${ReservedModifier}+${Lowercase<ReservedLetter>}`;

/**
 * Runtime set of reserved shortcuts.
 * Shortcuts are normalised to `ctrl+<lowercase>` for matching
 * ("Cmd" / "Meta" are treated as "Ctrl").
 */
export const RESERVED_SHORTCUTS: ReadonlySet<string> = new Set([
  // Browser-reserved
  'ctrl+n', 'ctrl+t', 'ctrl+w',
  // Text-editing
  'ctrl+a', 'ctrl+c', 'ctrl+v', 'ctrl+x', 'ctrl+z', 'ctrl+y',
]);

function normalizeShortcutForCheck(shortcut: string): string {
  return shortcut
    .split('+')
    .map((p) => p.trim().toLowerCase())
    .map((p) => (p === 'cmd' || p === 'meta' ? 'ctrl' : p))
    .join('+');
}

/** Returns true when `shortcut` matches a reserved combination. */
export function isReservedShortcut(shortcut: string): boolean {
  return RESERVED_SHORTCUTS.has(normalizeShortcutForCheck(shortcut));
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CommandPaletteItem {
  /** Unique identifier for the command */
  id: string;
  /** Display label for the command */
  label: string;
  /** Optional description text shown below the label */
  description?: string;
  /** Optional icon component (from solid-icons) */
  icon?: Component;
  /** Callback when the command is selected */
  onSelect: () => void;
  /** Whether the command is disabled */
  disabled?: boolean;
  /**
   * Optional keyboard shortcut hint displayed as a badge (e.g. "Ctrl+S",
   * "Alt+N").  The palette will intercept the matching keypress while open
   * and execute the item's `onSelect`.
   *
   * **Reserved shortcuts** — the following are automatically rejected
   * (a console warning is emitted and the shortcut is ignored at runtime):
   *
   * | Category | Keys |
   * |---|---|
   * | Browser-reserved | Ctrl/Cmd + N, T, W |
   * | Text-editing | Ctrl/Cmd + A, C, V, X, Z, Y |
   *
   * Use the {@link createCommandItem} helper for **compile-time** enforcement.
   */
  shortcut?: string;
  /** Optional group/category name for grouping commands */
  group?: string;
  /** Optional tags/badges shown on the right side */
  tags?: string[];
  /** Optional search keywords for better filtering */
  keywords?: string[];
}

/**
 * Type-safe factory for creating `CommandPaletteItem` objects.
 *
 * Emits a **runtime `console.warn`** when a reserved shortcut is assigned,
 * and the component will ignore it (the shortcut won't be matched).
 *
 * Reserved shortcuts are exposed as the {@link ReservedShortcut} type and the
 * {@link RESERVED_SHORTCUTS} set so you can build your own compile-time or
 * runtime guards.
 *
 * ```ts
 * createCommandItem({ shortcut: 'Ctrl+O', ... }) // ✓  Valid
 * createCommandItem({ shortcut: 'Ctrl+C', ... }) // ⚠ Runtime warning
 * ```
 */
export function createCommandItem(item: CommandPaletteItem): CommandPaletteItem {
  if (item.shortcut && isReservedShortcut(item.shortcut)) {
    console.warn(
      `[CommandPalette] "${item.shortcut}" is a reserved shortcut ` +
      `(browser-reserved or text-editing) and will be ignored. ` +
      `Use Alt+<key> or Ctrl+Shift+<key> instead.`,
    );
  }
  return item;
}

export interface CommandPaletteProps {
  /** Whether the command palette is open (controlled) */
  open: boolean;
  /** Callback when the palette should close */
  onClose: () => void;
  /** Array of command items */
  items: CommandPaletteItem[];
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Size variant */
  size?: 'compact' | 'normal' | 'spacious';
  /** Whether to enable the default Ctrl+K / Cmd+K keybinding */
  keybinding?: boolean;
  /** Callback when the keybinding is triggered (for uncontrolled toggle) */
  onKeybinding?: () => void;
  /** Dismiss when clicking the backdrop */
  dismissOnBackdrop?: boolean;
  /** Empty state message when no results match */
  emptyMessage?: string;
  /** Additional CSS class */
  class?: string;
}

// ─── Fuzzy Match Helper ──────────────────────────────────────────────────────

function fuzzyMatch(query: string, text: string): boolean {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Substring match first (fastest)
  if (lowerText.includes(lowerQuery)) return true;

  // Fuzzy character-by-character match
  let qi = 0;
  for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
    if (lowerText[ti] === lowerQuery[qi]) qi++;
  }
  return qi === lowerQuery.length;
}

function matchesItem(query: string, item: CommandPaletteItem): boolean {
  if (fuzzyMatch(query, item.label)) return true;
  if (item.description && fuzzyMatch(query, item.description)) return true;
  if (item.group && fuzzyMatch(query, item.group)) return true;
  if (item.keywords) {
    for (const kw of item.keywords) {
      if (fuzzyMatch(query, kw)) return true;
    }
  }
  if (item.tags) {
    for (const tag of item.tags) {
      if (fuzzyMatch(query, tag)) return true;
    }
  }
  return false;
}

// ─── Shortcut Parsing ────────────────────────────────────────────────────────

interface ParsedShortcut {
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  key: string; // lowercase
}

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.split('+').map((p) => p.trim());
  const key = parts[parts.length - 1].toLowerCase();
  const modifiers = new Set(parts.slice(0, -1).map((m) => m.toLowerCase()));

  return {
    ctrlKey: modifiers.has('ctrl') || modifiers.has('cmd'),
    metaKey: modifiers.has('cmd') || modifiers.has('meta'),
    shiftKey: modifiers.has('shift'),
    altKey: modifiers.has('alt'),
    key,
  };
}

function eventMatchesShortcut(e: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const keyMatches = e.key.toLowerCase() === parsed.key;
  const ctrlOrMeta = e.ctrlKey || e.metaKey;
  const needsCtrlOrMeta = parsed.ctrlKey || parsed.metaKey;
  const shiftMatches = parsed.shiftKey ? e.shiftKey : !e.shiftKey;
  const altMatches = parsed.altKey ? e.altKey : !e.altKey;

  return keyMatches && ctrlOrMeta === needsCtrlOrMeta && shiftMatches && altMatches;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const CommandPalette: Component<CommandPaletteProps> = (props) => {
  const [local] = splitProps(props, [
    'open',
    'onClose',
    'items',
    'placeholder',
    'size',
    'keybinding',
    'onKeybinding',
    'dismissOnBackdrop',
    'emptyMessage',
    'class',
  ]);

  const size = () => local.size ?? 'normal';
  const dismissOnBackdrop = () => local.dismissOnBackdrop ?? true;
  const placeholder = () => local.placeholder ?? 'Search commands...';
  const emptyMessage = () => local.emptyMessage ?? 'No commands found';

  const [query, setQuery] = createSignal('');
  const [activeIndex, setActiveIndex] = createSignal(0);

  const paletteId = generateId('command-palette');
  const listId = `${paletteId}-list`;

  let inputRef: HTMLInputElement | undefined;
  let listRef: HTMLDivElement | undefined;
  let backdropRef: HTMLDivElement | undefined;

  // ── Filtered & grouped items ─────────────────────────────────────────────

  const filteredItems = createMemo(() => {
    const q = query().trim();
    if (!q) return local.items;
    return local.items.filter((item) => matchesItem(q, item));
  });

  const groupedItems = createMemo(() => {
    const items = filteredItems();
    const groups = new Map<string, CommandPaletteItem[]>();
    const ungrouped: CommandPaletteItem[] = [];

    for (const item of items) {
      if (item.group) {
        const group = groups.get(item.group);
        if (group) {
          group.push(item);
        } else {
          groups.set(item.group, [item]);
        }
      } else {
        ungrouped.push(item);
      }
    }

    const result: Array<{ group?: string; items: CommandPaletteItem[] }> = [];

    // Ungrouped items first
    if (ungrouped.length > 0) {
      result.push({ items: ungrouped });
    }

    // Then grouped items in order
    for (const [group, groupItems] of groups) {
      result.push({ group, items: groupItems });
    }

    return result;
  });

  // Flat list for keyboard navigation — follows grouped display order
  const flatFilteredItems = createMemo(() => {
    return groupedItems().flatMap((section) => section.items);
  });

  // Pre-built index map for O(1) lookup in render (avoids O(n²) indexOf)
  const itemIndexMap = createMemo(() => {
    const map = new Map<CommandPaletteItem, number>();
    flatFilteredItems().forEach((item, index) => map.set(item, index));
    return map;
  });

  // Pre-parsed shortcuts — avoids re-parsing on every keypress in the
  // capture handler.  Excludes disabled items and reserved shortcuts.
  const parsedShortcuts = createMemo(() => {
    return local.items
      .filter((item): item is CommandPaletteItem & { shortcut: string } =>
        !!item.shortcut && !item.disabled && !isReservedShortcut(item.shortcut)
      )
      .map((item) => ({ item, parsed: parseShortcut(item.shortcut) }));
  });

  // ── Effects ──────────────────────────────────────────────────────────────

  // Reset query and active index when opening
  createEffect(() => {
    if (local.open) {
      setQuery('');
      setActiveIndex(0);
      // Focus the input after the portal renders
      requestAnimationFrame(() => {
        inputRef?.focus();
      });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Global keybinding handler (Ctrl+K / Cmd+K to toggle palette)
  const handleGlobalKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();
      local.onKeybinding?.();
    }
  };

  // Window capture-phase listener: intercepts *only* keypresses that match
  // a registered (non-reserved, non-disabled) item shortcut.  Everything
  // else — text-editing combos, unregistered modifier keys, etc. — flows
  // through to the browser naturally.
  const handleCaptureKeydown = (e: KeyboardEvent) => {
    if (!local.open) return;

    // Allow Ctrl+K / Cmd+K through for the global keybinding toggle
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') return;

    // Match against registered (non-reserved) item shortcuts
    for (const { item, parsed } of parsedShortcuts()) {
      if (eventMatchesShortcut(e, parsed)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        item.onSelect();
        local.onClose();
        return;
      }
    }
  };

  // Register capture handler on window immediately (not deferred)
  window.addEventListener('keydown', handleCaptureKeydown, true);

  // Track keybinding listener to avoid stacking on re-runs
  let keybindingListenerActive = false;

  createEffect(() => {
    if (local.keybinding && !keybindingListenerActive) {
      document.addEventListener('keydown', handleGlobalKeydown);
      keybindingListenerActive = true;
    } else if (!local.keybinding && keybindingListenerActive) {
      document.removeEventListener('keydown', handleGlobalKeydown);
      keybindingListenerActive = false;
    }
  });

  onCleanup(() => {
    document.body.style.overflow = '';
    if (keybindingListenerActive) {
      document.removeEventListener('keydown', handleGlobalKeydown);
    }
    window.removeEventListener('keydown', handleCaptureKeydown, true);
  });

  // ── Event Handlers ───────────────────────────────────────────────────────

  const handleBackdropClick = (e: MouseEvent) => {
    if (dismissOnBackdrop() && e.target === backdropRef) {
      local.onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = flatFilteredItems();
    const count = items.length;

    // The capture-phase listener (handleCaptureKeydown) only intercepts
    // modifier combos that match a registered item shortcut.  Unmatched
    // modifier combos (including text-editing shortcuts) pass through.

    if (count === 0 && e.key !== 'Escape') return;

    switch (e.key) {
      case 'Escape': {
        e.preventDefault();
        e.stopPropagation(); // Prevent bubble to backdrop's onKeyDown
        local.onClose();
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        setActiveIndex((prev) => {
          let next = (prev + 1) % count;
          // Skip disabled items
          let attempts = 0;
          while (items[next]?.disabled && attempts < count) {
            next = (next + 1) % count;
            attempts++;
          }
          return next;
        });
        scrollActiveIntoView();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setActiveIndex((prev) => {
          let next = (prev - 1 + count) % count;
          // Skip disabled items
          let attempts = 0;
          while (items[next]?.disabled && attempts < count) {
            next = (next - 1 + count) % count;
            attempts++;
          }
          return next;
        });
        scrollActiveIntoView();
        break;
      }
      case 'Home': {
        e.preventDefault();
        let next = 0;
        let attempts = 0;
        while (items[next]?.disabled && attempts < count) {
          next = (next + 1) % count;
          attempts++;
        }
        setActiveIndex(next);
        scrollActiveIntoView();
        break;
      }
      case 'End': {
        e.preventDefault();
        let next = count - 1;
        let attempts = 0;
        while (items[next]?.disabled && attempts < count) {
          next = (next - 1 + count) % count;
          attempts++;
        }
        setActiveIndex(next);
        scrollActiveIntoView();
        break;
      }
      case 'Enter': {
        e.preventDefault();
        const item = items[activeIndex()];
        if (item && !item.disabled) {
          item.onSelect();
          local.onClose();
        }
        break;
      }
    }
  };

  const scrollActiveIntoView = () => {
    requestAnimationFrame(() => {
      const active = listRef?.querySelector('.command-palette__item--active');
      if (active && typeof active.scrollIntoView === 'function') {
        active.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  // Reset active index when query changes
  createEffect(() => {
    query(); // Track dependency
    setActiveIndex(0);
  });

  const handleItemClick = (item: CommandPaletteItem) => {
    if (item.disabled) return;
    item.onSelect();
    local.onClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const paletteClasses = () => {
    const classes = ['command-palette'];
    if (size() !== 'normal') {
      classes.push(`command-palette--${size()}`);
    }
    if (local.class) {
      classes.push(local.class);
    }
    return classes.join(' ');
  };

  return (
    <Show when={local.open}>
      <Portal>
        <div
          ref={backdropRef}
          class="command-palette__backdrop"
          onClick={handleBackdropClick}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              local.onClose();
            }
          }}
        >
          <div class={paletteClasses()} role="dialog" aria-modal="true" aria-label="Command palette">
            {/* Search input */}
            <div class="command-palette__header">
              <div class="command-palette__search-icon">
                <BsSearch />
              </div>
              <input
                ref={inputRef}
                class="command-palette__input"
                type="text"
                placeholder={placeholder()}
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search commands"
                aria-activedescendant={
                  flatFilteredItems().length > 0
                    ? `${paletteId}-item-${activeIndex()}`
                    : undefined
                }
                aria-controls={listId}
                role="combobox"
                aria-expanded="true"
                aria-autocomplete="list"
              />
              <Show when={query()}>
                <button
                  class="command-palette__clear"
                  onClick={() => {
                    setQuery('');
                    inputRef?.focus();
                  }}
                  aria-label="Clear search"
                  type="button"
                >
                  <BsX />
                </button>
              </Show>
            </div>

            {/* Results list */}
            <div
              ref={listRef}
              class="command-palette__list"
              id={listId}
              role="listbox"
            >
              <Show
                when={flatFilteredItems().length > 0}
                fallback={
                  <div class="command-palette__empty">
                    {emptyMessage()}
                  </div>
                }
              >
                <For each={groupedItems()}>
                  {(section) => (
                    <>
                      <Show when={section.group}>
                        <div class="command-palette__group-header">
                          {section.group}
                        </div>
                      </Show>
                      <For each={section.items}>
                        {(item) => {
                          const itemIndex = () => itemIndexMap().get(item) ?? -1;
                          const isActive = () => itemIndex() === activeIndex();

                          return (
                            <div
                              id={`${paletteId}-item-${itemIndex()}`}
                              class={[
                                'command-palette__item',
                                isActive() ? 'command-palette__item--active' : '',
                                item.disabled ? 'command-palette__item--disabled' : '',
                              ].filter(Boolean).join(' ')}
                              role="option"
                              aria-selected={isActive()}
                              aria-disabled={item.disabled}
                              onClick={() => handleItemClick(item)}
                              onMouseEnter={() => {
                                if (!item.disabled) setActiveIndex(itemIndex());
                              }}
                            >
                              <Show when={item.icon}>
                                {(_icon) => {
                                  const IconComp = item.icon!;
                                  return (
                                    <div class="command-palette__item-icon">
                                      <IconComp />
                                    </div>
                                  );
                                }}
                              </Show>

                              <div class="command-palette__item-content">
                                <span class="command-palette__item-label">{item.label}</span>
                                <Show when={item.description}>
                                  <span class="command-palette__item-description">{item.description}</span>
                                </Show>
                              </div>

                              <div class="command-palette__item-meta">
                                <Show when={item.tags && item.tags.length > 0}>
                                  <div class="command-palette__item-tags">
                                    <For each={item.tags}>
                                      {(tag) => (
                                        <Chip size="compact" variant="neutral">{tag}</Chip>
                                      )}
                                    </For>
                                  </div>
                                </Show>
                                <Show when={item.shortcut && !isReservedShortcut(item.shortcut)}>
                                  <kbd class="command-palette__shortcut">{item.shortcut}</kbd>
                                </Show>
                              </div>
                            </div>
                          );
                        }}
                      </For>
                    </>
                  )}
                </For>
              </Show>
            </div>

            {/* Footer */}
            <div class="command-palette__footer">
              <span class="command-palette__footer-hint">
                <kbd>↑↓</kbd> navigate
              </span>
              <span class="command-palette__footer-hint">
                <kbd>↵</kbd> select
              </span>
              <span class="command-palette__footer-hint">
                <kbd>esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
