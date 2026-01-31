import { describe, it, expect, vi } from 'vitest';
import { NotificationProvider, useNotification, type NotificationOptions } from '../../src/components/feedback/Notification';
import { render } from '@solidjs/testing-library';
import { Component } from 'solid-js';

describe('Notification', () => {
  it('throws error when useNotification is used outside provider', () => {
    const TestComponent: Component = () => {
      expect(() => useNotification()).toThrow('useNotification must be used within NotificationProvider');
      return <div>Test</div>;
    };

    render(() => <TestComponent />);
  });

  it('provides notification context', () => {
    const TestComponent: Component = () => {
      const { notify, dismiss, dismissAll } = useNotification();
      expect(notify).toBeDefined();
      expect(dismiss).toBeDefined();
      expect(dismissAll).toBeDefined();
      expect(typeof notify).toBe('function');
      expect(typeof dismiss).toBe('function');
      expect(typeof dismissAll).toBe('function');
      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });

  it('notify returns a notification id', () => {
    let notificationId: string = '';

    const TestComponent: Component = () => {
      const { notify } = useNotification();
      const id = notify({
        variant: 'success',
        title: 'Test',
      });
      notificationId = id;
      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));

    expect(notificationId).toBeTruthy();
    expect(typeof notificationId).toBe('string');
  });

  it('accepts all notification options', () => {
    const TestComponent: Component = () => {
      const { notify } = useNotification();

      const options: NotificationOptions = {
        id: 'custom-id',
        variant: 'error',
        title: 'Error Title',
        message: 'Error message',
        duration: 3000,
        position: 'top-center',
        actions: [
          { label: 'Action 1', onClick: vi.fn() },
        ],
        onClose: vi.fn(),
      };

      const id = notify(options);
      expect(id).toBe('custom-id');
      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });

  it('generates unique ids when not provided', () => {
    const ids: string[] = [];

    const TestComponent: Component = () => {
      const { notify } = useNotification();

      ids.push(notify({ title: 'Test 1' }));
      ids.push(notify({ title: 'Test 2' }));
      ids.push(notify({ title: 'Test 3' }));

      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));

    expect(ids.length).toBe(3);
    expect(new Set(ids).size).toBe(3); // All unique
  });

  it('supports all variant types', () => {
    const TestComponent: Component = () => {
      const { notify } = useNotification();

      notify({ variant: 'success', title: 'Success' });
      notify({ variant: 'error', title: 'Error' });
      notify({ variant: 'warning', title: 'Warning' });
      notify({ variant: 'info', title: 'Info' });

      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });

  it('supports all position types', () => {
    const TestComponent: Component = () => {
      const { notify } = useNotification();

      notify({ position: 'top-right', title: 'Top Right' });
      notify({ position: 'top-center', title: 'Top Center' });
      notify({ position: 'bottom-right', title: 'Bottom Right' });
      notify({ position: 'bottom-center', title: 'Bottom Center' });

      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });

  it('supports persistent notifications with null duration', () => {
    const TestComponent: Component = () => {
      const { notify } = useNotification();

      notify({ title: 'Persistent', duration: null });

      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });

  it('supports custom duration', () => {
    const TestComponent: Component = () => {
      const { notify } = useNotification();

      notify({ title: 'Custom Duration', duration: 10000 });

      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });

  it('supports action buttons', () => {
    const action1 = vi.fn();
    const action2 = vi.fn();

    const TestComponent: Component = () => {
      const { notify } = useNotification();

      notify({
        title: 'With Actions',
        actions: [
          { label: 'Action 1', onClick: action1 },
          { label: 'Action 2', onClick: action2 },
        ],
      });

      return <div>Test</div>;
    };

    render(() => (
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    ));
  });
});
