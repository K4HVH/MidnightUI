import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { useNotification } from '../../../components/feedback/Notification';

const NotificationDemo: Component = () => {
  const { notify } = useNotification();

  return (
    <>
      <h2>Notification Component Examples</h2>

      <Card>
        <CardHeader title="Notification Variants" />
        <div class="flex--sm flex--wrap">
          <Button
            variant="primary"
            onClick={() => notify({
              variant: 'success',
              title: 'Success!',
              message: 'Your changes have been saved successfully.',
            })}
          >
            Show Success
          </Button>
          <Button
            variant="secondary"
            onClick={() => notify({
              variant: 'error',
              title: 'Error',
              message: 'Something went wrong. Please try again.',
            })}
          >
            Show Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => notify({
              variant: 'warning',
              title: 'Warning',
              message: 'This action cannot be undone.',
            })}
          >
            Show Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() => notify({
              variant: 'info',
              title: 'Information',
              message: 'This is an informational message.',
            })}
          >
            Show Info
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Notification Positions" />
        <div class="flex--sm flex--wrap">
          <Button
            onClick={() => notify({
              variant: 'info',
              title: 'Top Right',
              message: 'This notification appears in the top-right corner.',
              position: 'top-right',
            })}
          >
            Top Right
          </Button>
          <Button
            onClick={() => notify({
              variant: 'info',
              title: 'Top Center',
              message: 'This notification appears at the top-center.',
              position: 'top-center',
            })}
          >
            Top Center
          </Button>
          <Button
            onClick={() => notify({
              variant: 'info',
              title: 'Bottom Right',
              message: 'This notification appears in the bottom-right corner.',
              position: 'bottom-right',
            })}
          >
            Bottom Right
          </Button>
          <Button
            onClick={() => notify({
              variant: 'info',
              title: 'Bottom Center',
              message: 'This notification appears at the bottom-center.',
              position: 'bottom-center',
            })}
          >
            Bottom Center
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Persistent Notification" />
        <div class="flex--sm flex--wrap">
          <Button
            onClick={() => notify({
              variant: 'warning',
              title: 'Persistent',
              message: 'This notification will not auto-dismiss. Click the X to close.',
              duration: null,
            })}
          >
            Show Persistent
          </Button>
          <Button
            onClick={() => notify({
              variant: 'success',
              title: 'Quick (2s)',
              message: 'This will auto-dismiss in 2 seconds.',
              duration: 2000,
            })}
          >
            Quick Dismiss
          </Button>
          <Button
            onClick={() => notify({
              variant: 'info',
              title: 'Long (10s)',
              message: 'This will auto-dismiss in 10 seconds.',
              duration: 10000,
            })}
          >
            Long Dismiss
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Notifications with Actions" />
        <div class="flex--sm flex--wrap">
          <Button
            onClick={() => notify({
              variant: 'info',
              title: 'Update Available',
              message: 'A new version is available. Would you like to update?',
              duration: null,
              actions: [
                {
                  label: 'Update Now',
                  onClick: () => console.log('Update clicked'),
                },
                {
                  label: 'Later',
                  onClick: () => console.log('Later clicked'),
                },
              ],
            })}
          >
            Update Notification
          </Button>
          <Button
            onClick={() => notify({
              variant: 'success',
              title: 'File Uploaded',
              message: 'Your file has been uploaded successfully.',
              actions: [
                {
                  label: 'View',
                  onClick: () => console.log('View clicked'),
                },
              ],
            })}
          >
            With Single Action
          </Button>
          <Button
            onClick={() => notify({
              variant: 'error',
              title: 'Connection Lost',
              message: 'Your connection was interrupted.',
              duration: null,
              actions: [
                {
                  label: 'Retry',
                  onClick: () => console.log('Retry clicked'),
                },
                {
                  label: 'Cancel',
                  onClick: () => console.log('Cancel clicked'),
                },
              ],
            })}
          >
            Error with Actions
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Multiple Notifications" />
        <div class="flex--sm flex--wrap">
          <Button
            onClick={() => {
              notify({ variant: 'success', title: 'First notification', message: 'This is the first one.' });
              setTimeout(() => notify({ variant: 'info', title: 'Second notification', message: 'This is the second one.' }), 300);
              setTimeout(() => notify({ variant: 'warning', title: 'Third notification', message: 'This is the third one.' }), 600);
            }}
          >
            Show Multiple
          </Button>
          <Button
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                setTimeout(() => {
                  notify({
                    variant: ['success', 'error', 'warning', 'info'][i % 4] as any,
                    title: `Notification ${i}`,
                    message: `This is notification number ${i}.`,
                  });
                }, i * 200);
              }
            }}
          >
            Show Stack
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Simple Notifications" />
        <div class="flex--sm flex--wrap">
          <Button
            onClick={() => notify({
              variant: 'success',
              title: 'Saved!',
            })}
          >
            Title Only
          </Button>
          <Button
            onClick={() => notify({
              variant: 'error',
              title: 'Failed',
              duration: 3000,
            })}
          >
            Short Duration
          </Button>
        </div>
      </Card>
    </>
  );
};

export default NotificationDemo;
