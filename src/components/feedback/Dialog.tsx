import { Component, JSX, Show, createContext, createEffect, onCleanup, splitProps, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Card } from '../surfaces/Card';
import { generateId } from '../../utils/generateId';
import { BsX } from 'solid-icons/bs';
import '../../styles/components/feedback/Dialog.css';

// Lets DialogHeader label the dialog (aria-labelledby) without the consumer
// having to wire ids manually. DialogHeader works without it (no id) too.
const DialogContext = createContext<{ titleId: string }>();

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  dismissOnBackdrop?: boolean;
  dismissOnEscape?: boolean;
  children?: JSX.Element;
  class?: string;
}

export const Dialog: Component<DialogProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'open',
    'onClose',
    'size',
    'dismissOnBackdrop',
    'dismissOnEscape',
    'children',
    'class',
  ]);

  const size = () => local.size ?? 'medium';
  const dismissOnBackdrop = () => local.dismissOnBackdrop ?? true;
  const dismissOnEscape = () => local.dismissOnEscape ?? true;

  const titleId = generateId('dialog-title');

  let dialogRef: HTMLDivElement | undefined; // backdrop
  let panelRef: HTMLDivElement | undefined; // the role="dialog" element
  let previouslyFocused: HTMLElement | null = null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (dismissOnBackdrop() && e.target === dialogRef) {
      local.onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!local.open) return;

    if (e.key === 'Escape' && dismissOnEscape()) {
      local.onClose();
      return;
    }

    // Focus trap: keep Tab/Shift+Tab cycling within the dialog.
    if (e.key === 'Tab' && panelRef) {
      const focusable = Array.from(panelRef.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        e.preventDefault();
        panelRef.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  createEffect(() => {
    if (local.open) {
      // Remember what to restore focus to, lock body scroll, listen for keys.
      previouslyFocused = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Move focus into the dialog once the portal has mounted.
      queueMicrotask(() => {
        if (!local.open || !panelRef) return;
        const focusable = panelRef.querySelectorAll<HTMLElement>(FOCUSABLE);
        (focusable.length ? focusable[0] : panelRef).focus();
      });
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to whatever had it before the dialog opened.
      previouslyFocused?.focus();
      previouslyFocused = null;
    }
  });

  onCleanup(() => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
    previouslyFocused?.focus();
  });

  const dialogClassNames = () => {
    const classes = ['dialog'];

    if (size() !== 'medium') {
      classes.push(`dialog--${size()}`);
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
          ref={dialogRef}
          class="dialog__backdrop"
          onClick={handleBackdropClick}
          {...rest}
        >
          <div
            ref={panelRef}
            class={dialogClassNames()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabindex={-1}
          >
            <Card variant="emphasized" padding="normal">
              <DialogContext.Provider value={{ titleId }}>
                {local.children}
              </DialogContext.Provider>
            </Card>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

interface DialogHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  showClose?: boolean;
}

export const DialogHeader: Component<DialogHeaderProps> = (props) => {
  const showClose = () => props.showClose ?? true;
  // Links the dialog's aria-labelledby to this title when rendered inside a Dialog.
  const dialog = useContext(DialogContext);

  return (
    <div class="dialog__header">
      <div class="dialog__header-content">
        <h2 class="dialog__title" id={dialog?.titleId}>{props.title}</h2>
        {props.subtitle && <p class="dialog__subtitle">{props.subtitle}</p>}
      </div>
      <Show when={showClose() && props.onClose}>
        <button
          type="button"
          class="dialog__close"
          onClick={props.onClose}
          aria-label="Close dialog"
        >
          <BsX />
        </button>
      </Show>
    </div>
  );
};

interface DialogFooterProps {
  children?: JSX.Element;
  align?: 'left' | 'center' | 'right';
}

export const DialogFooter: Component<DialogFooterProps> = (props) => {
  const align = () => props.align ?? 'right';

  const classNames = () => {
    const classes = ['dialog__footer'];

    if (align() !== 'right') {
      classes.push(`dialog__footer--${align()}`);
    }

    return classes.join(' ');
  };

  return (
    <div class={classNames()}>
      {props.children}
    </div>
  );
};
