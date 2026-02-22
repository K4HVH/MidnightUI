import { render, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { Divider } from '../../src/components/display/Divider';

describe('Divider', () => {
  // === Rendering ===

  it('renders a separator element', () => {
    const { container } = render(() => <Divider />);
    const divider = container.querySelector('.divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('role', 'separator');
  });

  it('renders horizontal by default', () => {
    const { container } = render(() => <Divider />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--horizontal');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders vertical when orientation is vertical', () => {
    const { container } = render(() => <Divider orientation="vertical" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  // === Line Styles ===

  it('applies solid line style by default', () => {
    const { container } = render(() => <Divider />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--solid');
  });

  it('applies dashed line style', () => {
    const { container } = render(() => <Divider lineStyle="dashed" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--dashed');
  });

  it('applies dotted line style', () => {
    const { container } = render(() => <Divider lineStyle="dotted" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--dotted');
  });

  // === Color Variants ===

  it('does not add variant class for default', () => {
    const { container } = render(() => <Divider />);
    const divider = container.querySelector('.divider');
    expect(divider).not.toHaveClass('divider--default');
  });

  it('applies primary variant', () => {
    const { container } = render(() => <Divider variant="primary" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--primary');
  });

  it('applies accent variant', () => {
    const { container } = render(() => <Divider variant="accent" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--accent');
  });

  // === Spacing ===

  it('does not add spacing class for normal', () => {
    const { container } = render(() => <Divider />);
    const divider = container.querySelector('.divider');
    expect(divider).not.toHaveClass('divider--spacing-normal');
  });

  it('applies compact spacing', () => {
    const { container } = render(() => <Divider spacing="compact" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--spacing-compact');
  });

  it('applies spacious spacing', () => {
    const { container } = render(() => <Divider spacing="spacious" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--spacing-spacious');
  });

  // === Label ===

  it('renders label text when provided', () => {
    const { getByText } = render(() => <Divider label="OR" />);
    expect(getByText('OR')).toBeInTheDocument();
  });

  it('adds with-label class when label is provided', () => {
    const { container } = render(() => <Divider label="Section" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--with-label');
  });

  it('does not render label element when no label', () => {
    const { container } = render(() => <Divider />);
    const label = container.querySelector('.divider__label');
    expect(label).not.toBeInTheDocument();
  });

  it('applies label-center alignment by default', () => {
    const { container } = render(() => <Divider label="Center" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--label-center');
  });

  it('applies label-start alignment', () => {
    const { container } = render(() => <Divider label="Start" labelAlign="start" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--label-start');
  });

  it('applies label-end alignment', () => {
    const { container } = render(() => <Divider label="End" labelAlign="end" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--label-end');
  });

  // === Custom class ===

  it('accepts additional class prop', () => {
    const { container } = render(() => <Divider class="my-custom-class" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('my-custom-class');
  });

  // === Draggable ===

  it('adds draggable class when draggable prop is set', () => {
    const { container } = render(() => <Divider draggable />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--draggable');
  });

  it('renders drag handle dots when draggable', () => {
    const { container } = render(() => <Divider draggable />);
    const handle = container.querySelector('.divider__handle');
    expect(handle).toBeInTheDocument();
    const dots = container.querySelectorAll('.divider__handle-dot');
    expect(dots).toHaveLength(3);
  });

  it('does not render drag handle when not draggable', () => {
    const { container } = render(() => <Divider />);
    const handle = container.querySelector('.divider__handle');
    expect(handle).not.toBeInTheDocument();
  });

  it('sets tabIndex 0 when draggable for keyboard focus', () => {
    const { container } = render(() => <Divider draggable />);
    const divider = container.querySelector('.divider') as HTMLElement;
    expect(divider).toHaveAttribute('tabindex', '0');
  });

  it('does not set tabIndex when not draggable', () => {
    const { container } = render(() => <Divider />);
    const divider = container.querySelector('.divider') as HTMLElement;
    expect(divider).not.toHaveAttribute('tabindex');
  });

  it('calls onDragStart on pointer down', () => {
    const onDragStart = vi.fn();
    const { container } = render(() => <Divider draggable onDragStart={onDragStart} />);
    const divider = container.querySelector('.divider') as HTMLElement;

    divider.setPointerCapture = vi.fn();

    fireEvent.pointerDown(divider, { clientX: 100, clientY: 100, pointerId: 1 });
    expect(onDragStart).toHaveBeenCalledOnce();
  });

  it('calls onDrag with delta during pointer move', () => {
    const onDrag = vi.fn();
    const { container } = render(() => <Divider draggable onDrag={onDrag} />);
    const divider = container.querySelector('.divider') as HTMLElement;

    // Mock setPointerCapture since jsdom doesn't support it
    divider.setPointerCapture = vi.fn();

    fireEvent.pointerDown(divider, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(divider, { clientX: 100, clientY: 120, pointerId: 1 });
    expect(onDrag).toHaveBeenCalledWith(20);
  });

  it('calls onDragEnd on pointer up', () => {
    const onDragEnd = vi.fn();
    const { container } = render(() => <Divider draggable onDragEnd={onDragEnd} />);
    const divider = container.querySelector('.divider') as HTMLElement;

    divider.setPointerCapture = vi.fn();

    fireEvent.pointerDown(divider, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(divider, { pointerId: 1 });
    expect(onDragEnd).toHaveBeenCalledOnce();
  });

  it('adds dragging class during drag', () => {
    const { container } = render(() => <Divider draggable />);
    const divider = container.querySelector('.divider') as HTMLElement;

    divider.setPointerCapture = vi.fn();

    expect(divider).not.toHaveClass('divider--dragging');
    fireEvent.pointerDown(divider, { clientX: 100, clientY: 100, pointerId: 1 });
    expect(divider).toHaveClass('divider--dragging');
    fireEvent.pointerUp(divider, { pointerId: 1 });
    expect(divider).not.toHaveClass('divider--dragging');
  });

  it('uses clientX for vertical orientation drag delta', () => {
    const onDrag = vi.fn();
    const { container } = render(() => <Divider orientation="vertical" draggable onDrag={onDrag} />);
    const divider = container.querySelector('.divider') as HTMLElement;

    divider.setPointerCapture = vi.fn();

    fireEvent.pointerDown(divider, { clientX: 200, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(divider, { clientX: 230, clientY: 100, pointerId: 1 });
    expect(onDrag).toHaveBeenCalledWith(30);
  });

  // === Combination tests ===

  it('applies all class combinations correctly', () => {
    const { container } = render(() => (
      <Divider
        orientation="vertical"
        lineStyle="dashed"
        variant="primary"
        spacing="spacious"
        label="Test"
        labelAlign="end"
        draggable
        class="extra"
      />
    ));
    const divider = container.querySelector('.divider');
    expect(divider).toHaveClass('divider--vertical');
    expect(divider).toHaveClass('divider--dashed');
    expect(divider).toHaveClass('divider--primary');
    expect(divider).toHaveClass('divider--spacing-spacious');
    expect(divider).toHaveClass('divider--with-label');
    expect(divider).toHaveClass('divider--label-end');
    expect(divider).toHaveClass('divider--draggable');
    expect(divider).toHaveClass('extra');
  });

  it('spreads rest props onto the element', () => {
    const { container } = render(() => <Divider data-testid="my-divider" />);
    const divider = container.querySelector('.divider');
    expect(divider).toHaveAttribute('data-testid', 'my-divider');
  });
});
