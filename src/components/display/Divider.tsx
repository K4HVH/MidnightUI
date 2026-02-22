import { Component, JSX, splitProps, Show, createSignal, onCleanup } from 'solid-js';
import '../../styles/components/display/Divider.css';

interface DividerProps {
  /** Orientation of the divider line */
  orientation?: 'horizontal' | 'vertical';
  /** Line style variant */
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  /** Color theme variant */
  variant?: 'default' | 'primary' | 'accent';
  /** Optional inline label text */
  label?: string;
  /** Label alignment along the divider */
  labelAlign?: 'start' | 'center' | 'end';
  /** Enable drag handle for resizing */
  draggable?: boolean;
  /** Callback with pixel delta when dragging (positive = right/down) */
  onDrag?: (delta: number) => void;
  /** Callback when drag starts */
  onDragStart?: () => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
  /** Spacing around the divider (margin) */
  spacing?: 'compact' | 'normal' | 'spacious';
  /** Additional CSS class */
  class?: string;
}

export const Divider: Component<DividerProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'orientation',
    'lineStyle',
    'variant',
    'label',
    'labelAlign',
    'draggable',
    'onDrag',
    'onDragStart',
    'onDragEnd',
    'spacing',
    'class',
  ]);

  const orientation = () => local.orientation ?? 'horizontal';
  const lineStyle = () => local.lineStyle ?? 'solid';
  const variant = () => local.variant ?? 'default';
  const labelAlign = () => local.labelAlign ?? 'center';
  const spacing = () => local.spacing ?? 'normal';

  // Drag state
  const [isDragging, setIsDragging] = createSignal(false);
  let startPos = 0;

  const handlePointerDown = (e: PointerEvent) => {
    if (!local.draggable) return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }
    setIsDragging(true);
    startPos = orientation() === 'horizontal' ? e.clientY : e.clientX;
    local.onDragStart?.();
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging()) return;
    const currentPos = orientation() === 'horizontal' ? e.clientY : e.clientX;
    const delta = currentPos - startPos;
    startPos = currentPos;
    local.onDrag?.(delta);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isDragging()) return;
    setIsDragging(false);
    local.onDragEnd?.();
  };

  // Cleanup pointer events on unmount if dragging
  onCleanup(() => {
    setIsDragging(false);
  });

  const classNames = () => {
    const classes = ['divider'];

    classes.push(`divider--${orientation()}`);
    classes.push(`divider--${lineStyle()}`);

    if (variant() !== 'default') {
      classes.push(`divider--${variant()}`);
    }

    if (spacing() !== 'normal') {
      classes.push(`divider--spacing-${spacing()}`);
    }

    if (local.label) {
      classes.push('divider--with-label');
      classes.push(`divider--label-${labelAlign()}`);
    }

    if (local.draggable) {
      classes.push('divider--draggable');
    }

    if (isDragging()) {
      classes.push('divider--dragging');
    }

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  const KEYBOARD_DRAG_STEP = 5;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!local.draggable) return;

    const isHorizontal = orientation() === 'horizontal';
    let delta: number | null = null;

    if (isHorizontal) {
      if (e.key === 'ArrowDown') delta = KEYBOARD_DRAG_STEP;
      else if (e.key === 'ArrowUp') delta = -KEYBOARD_DRAG_STEP;
    } else {
      if (e.key === 'ArrowRight') delta = KEYBOARD_DRAG_STEP;
      else if (e.key === 'ArrowLeft') delta = -KEYBOARD_DRAG_STEP;
    }

    if (delta !== null) {
      e.preventDefault();
      local.onDragStart?.();
      local.onDrag?.(delta);
      local.onDragEnd?.();
    }
  };

  return (
    <div
      class={classNames()}
      role="separator"
      aria-orientation={orientation()}
      tabIndex={local.draggable ? 0 : undefined}
      onPointerDown={local.draggable ? handlePointerDown : undefined}
      onPointerMove={local.draggable ? handlePointerMove : undefined}
      onPointerUp={local.draggable ? handlePointerUp : undefined}
      onKeyDown={local.draggable ? handleKeyDown : undefined}
      {...rest}
    >
      <Show when={local.label}>
        <span class="divider__label">{local.label}</span>
      </Show>
      <Show when={local.draggable}>
        <span class="divider__handle" aria-hidden="true">
          <span class="divider__handle-dot" />
          <span class="divider__handle-dot" />
          <span class="divider__handle-dot" />
        </span>
      </Show>
    </div>
  );
};
