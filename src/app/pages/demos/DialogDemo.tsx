import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { TextField } from '../../../components/inputs/TextField';
import { Dialog, DialogHeader, DialogFooter } from '../../../components/feedback/Dialog';

const DialogDemo: Component = () => {
  const [dialogOpen1, setDialogOpen1] = createSignal(false);
  const [dialogOpen2, setDialogOpen2] = createSignal(false);
  const [dialogOpen3, setDialogOpen3] = createSignal(false);
  const [dialogOpen4, setDialogOpen4] = createSignal(false);
  const [dialogOpen5, setDialogOpen5] = createSignal(false);
  const [dialogOpen6, setDialogOpen6] = createSignal(false);

  return (
    <>
      <h2>Dialog Component Examples</h2>

      <Card>
        <CardHeader title="Basic Dialog" />
        <div class="flex--sm">
          <Button onClick={() => setDialogOpen1(true)}>Open Basic Dialog</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Dialog Sizes" />
        <div class="flex--sm flex--wrap">
          <Button onClick={() => setDialogOpen2(true)}>Small Dialog</Button>
          <Button onClick={() => setDialogOpen3(true)}>Medium Dialog</Button>
          <Button onClick={() => setDialogOpen4(true)}>Large Dialog</Button>
          <Button onClick={() => setDialogOpen5(true)}>Full Screen Dialog</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Dialog with Form" />
        <div class="flex--sm">
          <Button onClick={() => setDialogOpen6(true)}>Open Form Dialog</Button>
        </div>
      </Card>

      {/* Dialog instances */}
      <Dialog open={dialogOpen1()} onClose={() => setDialogOpen1(false)}>
        <DialogHeader
          title="Basic Dialog"
          subtitle="This is a simple dialog example"
          onClose={() => setDialogOpen1(false)}
        />
        <p>This is the dialog content. You can put any content here.</p>
        <p>Click outside, press ESC, or click the X button to close.</p>
        <DialogFooter>
          <Button variant="subtle" onClick={() => setDialogOpen1(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setDialogOpen1(false)}>Confirm</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={dialogOpen2()} onClose={() => setDialogOpen2(false)} size="small">
        <DialogHeader
          title="Small Dialog"
          subtitle="This dialog has a smaller width"
          onClose={() => setDialogOpen2(false)}
        />
        <p>This is a small dialog, perfect for simple confirmations or alerts.</p>
        <DialogFooter>
          <Button variant="subtle" onClick={() => setDialogOpen2(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setDialogOpen2(false)}>OK</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={dialogOpen3()} onClose={() => setDialogOpen3(false)} size="medium">
        <DialogHeader
          title="Medium Dialog"
          subtitle="This is the default size"
          onClose={() => setDialogOpen3(false)}
        />
        <p>This is a medium dialog, the default size. It's suitable for most use cases.</p>
        <p>You can include multiple paragraphs or components here.</p>
        <DialogFooter>
          <Button variant="subtle" onClick={() => setDialogOpen3(false)}>Close</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={dialogOpen4()} onClose={() => setDialogOpen4(false)} size="large">
        <DialogHeader
          title="Large Dialog"
          subtitle="This dialog has more space for content"
          onClose={() => setDialogOpen4(false)}
        />
        <p>This is a large dialog with more horizontal space for complex content.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <DialogFooter>
          <Button variant="danger" onClick={() => setDialogOpen4(false)}>Delete</Button>
          <Button variant="subtle" onClick={() => setDialogOpen4(false)}>Cancel</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={dialogOpen5()} onClose={() => setDialogOpen5(false)} size="fullscreen">
        <DialogHeader
          title="Full Screen Dialog"
          subtitle="This dialog takes up the entire viewport"
          onClose={() => setDialogOpen5(false)}
        />
        <p>This is a full-screen dialog that maximizes the available space.</p>
        <p>Perfect for complex forms or detailed content that needs more room.</p>
        <div class="grid--sm" style={{ "margin-top": "var(--g-spacing)" }}>
          <Card variant="subtle">
            <h3>Section 1</h3>
            <p>Content goes here...</p>
          </Card>
          <Card variant="subtle">
            <h3>Section 2</h3>
            <p>More content...</p>
          </Card>
        </div>
        <DialogFooter>
          <Button variant="subtle" onClick={() => setDialogOpen5(false)}>Close</Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={dialogOpen6()} onClose={() => setDialogOpen6(false)}>
        <DialogHeader
          title="User Information"
          subtitle="Please fill out the form below"
          onClose={() => setDialogOpen6(false)}
        />
        <div class="grid--sm">
          <TextField
            label="Full Name"
            placeholder="Enter your name"
          />
          <TextField
            type="email"
            label="Email Address"
            placeholder="Enter your email"
          />
          <TextField
            type="tel"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
          <TextField
            multiline
            label="Message"
            placeholder="Enter your message"
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="subtle" onClick={() => setDialogOpen6(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setDialogOpen6(false)}>Submit</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default DialogDemo;
