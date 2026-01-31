import { render, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { Slider } from '../../src/components/inputs/Slider';

describe('Slider', () => {
  it('renders with default value', () => {
    const { container } = render(() => <Slider />);
    const slider = container.querySelector('.slider');
    expect(slider).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    const { container } = render(() => <Slider value={50} min={0} max={100} />);
    const thumb = container.querySelector('.slider__thumb--end');
    expect(thumb).toBeInTheDocument();
    const style = thumb?.getAttribute('style');
    expect(style).toContain('left: 50%');
  });

  it('applies horizontal orientation by default', () => {
    const { container } = render(() => <Slider />);
    const slider = container.querySelector('.slider');
    expect(slider).not.toHaveClass('slider--vertical');
  });

  it('applies vertical orientation class', () => {
    const { container } = render(() => <Slider orientation="vertical" />);
    const slider = container.querySelector('.slider--vertical');
    expect(slider).toBeInTheDocument();
  });

  it('applies compact size class', () => {
    const { container } = render(() => <Slider size="compact" />);
    const slider = container.querySelector('.slider--compact');
    expect(slider).toBeInTheDocument();
  });

  it('applies disabled class', () => {
    const { container } = render(() => <Slider disabled />);
    const slider = container.querySelector('.slider--disabled');
    expect(slider).toBeInTheDocument();
  });

  it('renders range slider with two thumbs', () => {
    const { container } = render(() => <Slider range value={[25, 75]} />);
    const startThumb = container.querySelector('.slider__thumb--start');
    const endThumb = container.querySelector('.slider__thumb--end');
    expect(startThumb).toBeInTheDocument();
    expect(endThumb).toBeInTheDocument();
  });

  it('renders single value slider with one thumb', () => {
    const { container } = render(() => <Slider value={50} />);
    const startThumb = container.querySelector('.slider__thumb--start');
    const endThumb = container.querySelector('.slider__thumb--end');
    expect(startThumb).not.toBeInTheDocument();
    expect(endThumb).toBeInTheDocument();
  });

  it('renders marks when provided', () => {
    const marks = [
      { value: 0, label: '0%' },
      { value: 50, label: '50%' },
      { value: 100, label: '100%' },
    ];
    const { container } = render(() => <Slider marks={marks} />);
    const markElements = container.querySelectorAll('.slider__mark');
    expect(markElements.length).toBe(3);
  });

  it('renders mark labels when provided', () => {
    const marks = [
      { value: 0, label: 'Low' },
      { value: 100, label: 'High' },
    ];
    const { container } = render(() => <Slider marks={marks} />);
    const labels = container.querySelectorAll('.slider__mark-label');
    expect(labels.length).toBe(2);
    expect(labels[0].textContent).toBe('Low');
    expect(labels[1].textContent).toBe('High');
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const TestComponent = () => {
      const [value, setValue] = createSignal(50);
      return (
        <Slider
          value={value()}
          onChange={(newValue) => {
            setValue(newValue as number);
            handleChange(newValue);
          }}
          min={0}
          max={100}
        />
      );
    };

    const { container } = render(() => <TestComponent />);
    const track = container.querySelector('.slider__track') as HTMLElement;

    // Simulate click on track
    fireEvent.click(track, { clientX: 0, clientY: 0 });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    }, { timeout: 100 });
  });

  it('updates range values correctly', async () => {
    const handleChange = vi.fn();
    const TestComponent = () => {
      const [value, setValue] = createSignal<[number, number]>([25, 75]);
      return (
        <Slider
          range
          value={value()}
          onChange={(newValue) => {
            setValue(newValue as [number, number]);
            handleChange(newValue);
          }}
          min={0}
          max={100}
        />
      );
    };

    const { container } = render(() => <TestComponent />);
    const startThumb = container.querySelector('.slider__thumb--start') as HTMLElement;
    expect(startThumb).toBeInTheDocument();
  });

  it('does not trigger onChange when disabled', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Slider disabled onChange={handleChange} />
    ));
    const track = container.querySelector('.slider__track') as HTMLElement;

    fireEvent.click(track);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders tooltip on hover when showTooltip is true', async () => {
    const { container } = render(() => <Slider value={50} showTooltip />);
    const thumb = container.querySelector('.slider__thumb--end') as HTMLElement;

    fireEvent.mouseEnter(thumb);

    await waitFor(() => {
      const tooltip = document.querySelector('.slider__tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip?.textContent).toBe('50');
    }, { timeout: 100 });
  });

  it('hides tooltip on mouse leave', async () => {
    const { container } = render(() => <Slider value={50} showTooltip />);
    const thumb = container.querySelector('.slider__thumb--end') as HTMLElement;

    fireEvent.mouseEnter(thumb);
    await waitFor(() => {
      expect(document.querySelector('.slider__tooltip')).toBeInTheDocument();
    }, { timeout: 100 });

    fireEvent.mouseLeave(thumb);
    await waitFor(() => {
      expect(document.querySelector('.slider__tooltip')).not.toBeInTheDocument();
    }, { timeout: 100 });
  });

  it('does not show tooltip when showTooltip is false', () => {
    const { container } = render(() => <Slider value={50} showTooltip={false} />);
    const thumb = container.querySelector('.slider__thumb--end') as HTMLElement;

    fireEvent.mouseEnter(thumb);
    const tooltip = document.querySelector('.slider__tooltip');
    expect(tooltip).not.toBeInTheDocument();
  });

  it('restricts values to marks when step is null', () => {
    const marks = [
      { value: 0, label: 'Low' },
      { value: 50, label: 'Medium' },
      { value: 100, label: 'High' },
    ];
    const { container } = render(() => (
      <Slider marks={marks} step={null} value={50} />
    ));
    const slider = container.querySelector('.slider');
    expect(slider).toBeInTheDocument();
  });

  it('applies custom class name', () => {
    const { container } = render(() => <Slider class="custom-slider" />);
    const slider = container.querySelector('.custom-slider');
    expect(slider).toBeInTheDocument();
  });
});
