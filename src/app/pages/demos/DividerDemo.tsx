import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Divider } from '../../../components/display/Divider';

const panelStyle = {
  padding: "var(--g-spacing)",
  display: "flex",
  "align-items": "center",
  "justify-content": "center",
  "font-size": "var(--font-size-sm)",
} as const;

const mutedPanel = { ...panelStyle, color: "var(--g-text-muted)" } as const;
const subtlePanel = { ...panelStyle, color: "var(--g-text-secondary)" } as const;

const DividerDemo: Component = () => {
  const [leftWidth, setLeftWidth] = createSignal(200);
  const [topHeight, setTopHeight] = createSignal(80);
  const [labeledTopHeight, setLabeledTopHeight] = createSignal(80);
  const [labeledLeftWidth, setLabeledLeftWidth] = createSignal(200);

  return (
    <>
      <h2>Divider Component Examples</h2>

      <Card>
        <CardHeader title="Basic Horizontal Divider" subtitle="Default solid line separator" />
        <p style={{ color: "var(--g-text-secondary)" }}>Content above the divider</p>
        <Divider />
        <p style={{ color: "var(--g-text-secondary)" }}>Content below the divider</p>
      </Card>

      <Card>
        <CardHeader title="Line Style Variants" subtitle="Solid, dashed, and dotted" />
        <p style={{ color: "var(--g-text-muted)", "font-size": "var(--font-size-sm)" }}>Solid</p>
        <Divider lineStyle="solid" />
        <p style={{ color: "var(--g-text-muted)", "font-size": "var(--font-size-sm)" }}>Dashed</p>
        <Divider lineStyle="dashed" />
        <p style={{ color: "var(--g-text-muted)", "font-size": "var(--font-size-sm)" }}>Dotted</p>
        <Divider lineStyle="dotted" />
      </Card>

      <Card>
        <CardHeader title="Color Theme Variants" subtitle="Default, primary, and accent colors" />
        <Divider variant="default" label="Default" />
        <Divider variant="primary" label="Primary" />
        <Divider variant="accent" label="Accent" />
      </Card>

      <Card>
        <CardHeader title="Combined Variants" subtitle="Line styles with color themes" />
        <Divider variant="primary" lineStyle="dashed" label="Primary Dashed" />
        <Divider variant="accent" lineStyle="dotted" label="Accent Dotted" />
        <Divider variant="primary" lineStyle="solid" label="Primary Solid" />
      </Card>

      <Card>
        <CardHeader title="With Labels" subtitle="Inline text along the divider" />
        <Divider label="OR" />
        <Divider label="Section Break" />
        <Divider label="Continue" variant="primary" />
      </Card>

      <Card>
        <CardHeader title="Label Alignment" subtitle="Start, center, and end positioning" />
        <Divider label="Start" labelAlign="start" />
        <Divider label="Center" labelAlign="center" />
        <Divider label="End" labelAlign="end" />
      </Card>

      <Card>
        <CardHeader title="Spacing Variants" subtitle="Compact, normal, and spacious margin" />
        <p style={{ color: "var(--g-text-secondary)" }}>Compact spacing</p>
        <Divider spacing="compact" />
        <p style={{ color: "var(--g-text-secondary)" }}>Normal spacing (default)</p>
        <Divider spacing="normal" />
        <p style={{ color: "var(--g-text-secondary)" }}>Spacious spacing</p>
        <Divider spacing="spacious" />
        <p style={{ color: "var(--g-text-secondary)" }}>End of section</p>
      </Card>

      <Card>
        <CardHeader title="Vertical Dividers" subtitle="Used between inline items" />
        <div style={{ display: "flex", "align-items": "center", height: "40px", gap: "0" }}>
          <span style={{ color: "var(--g-text-secondary)" }}>Home</span>
          <Divider orientation="vertical" />
          <span style={{ color: "var(--g-text-secondary)" }}>About</span>
          <Divider orientation="vertical" variant="primary" />
          <span style={{ color: "var(--g-text-secondary)" }}>Contact</span>
          <Divider orientation="vertical" variant="accent" lineStyle="dashed" />
          <span style={{ color: "var(--g-text-secondary)" }}>Help</span>
        </div>
      </Card>

      <Card>
        <CardHeader title="Vertical Dividers with Labels" subtitle="Labeled separators in vertical orientation" />
        <div style={{ display: "flex", height: "120px", gap: "0", "align-items": "stretch" }}>
          <div style={{ ...subtlePanel, flex: "1" }}>
            Section A
          </div>
          <Divider orientation="vertical" label="OR" />
          <div style={{ ...subtlePanel, flex: "1" }}>
            Section B
          </div>
          <Divider orientation="vertical" label="AND" variant="primary" />
          <div style={{ ...subtlePanel, flex: "1" }}>
            Section C
          </div>
        </div>
        <div style={{ display: "flex", height: "120px", gap: "0", "align-items": "stretch", "margin-top": "var(--g-spacing)" }}>
          <div style={{ ...subtlePanel, flex: "1" }}>
            Left
          </div>
          <Divider orientation="vertical" label="vs" variant="accent" lineStyle="dashed" />
          <div style={{ ...subtlePanel, flex: "1" }}>
            Right
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Draggable Horizontal Divider" subtitle="Drag to resize panels — resizes the top area" />
        <div style={{ border: `1px solid var(--g-border-color)`, "border-radius": "var(--g-radius)", overflow: "hidden" }}>
          <div style={{ ...mutedPanel, height: `${topHeight()}px` }}>
            Top panel ({topHeight()}px)
          </div>
          <Divider
            draggable
            onDrag={(delta) => setTopHeight(h => Math.max(40, Math.min(200, h + delta)))}
          />
          <div style={{ ...mutedPanel, height: "80px" }}>
            Bottom panel
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Draggable Vertical Divider" subtitle="Drag to resize side-by-side panels" />
        <div style={{ display: "flex", height: "120px", border: `1px solid var(--g-border-color)`, "border-radius": "var(--g-radius)", overflow: "hidden" }}>
          <div style={{ ...mutedPanel, width: `${leftWidth()}px`, "flex-shrink": "0" }}>
            Left ({leftWidth()}px)
          </div>
          <Divider
            orientation="vertical"
            draggable
            onDrag={(delta) => setLeftWidth(w => Math.max(80, Math.min(400, w + delta)))}
          />
          <div style={{ ...mutedPanel, flex: "1" }}>
            Right panel
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Draggable with Labels" subtitle="Labeled drag handles for horizontal and vertical dividers" />
        <div style={{ border: `1px solid var(--g-border-color)`, "border-radius": "var(--g-radius)", overflow: "hidden" }}>
          <div style={{ ...mutedPanel, height: `${labeledTopHeight()}px` }}>
            Header ({labeledTopHeight()}px)
          </div>
          <Divider
            draggable
            label="Resize"
            variant="primary"
            onDrag={(delta) => setLabeledTopHeight(h => Math.max(40, Math.min(200, h + delta)))}
          />
          <div style={{ ...mutedPanel, height: "80px" }}>
            Content
          </div>
        </div>
        <div style={{ display: "flex", height: "120px", border: `1px solid var(--g-border-color)`, "border-radius": "var(--g-radius)", overflow: "hidden", "margin-top": "var(--g-spacing)" }}>
          <div style={{ ...mutedPanel, width: `${labeledLeftWidth()}px`, "flex-shrink": "0" }}>
            Sidebar ({labeledLeftWidth()}px)
          </div>
          <Divider
            orientation="vertical"
            draggable
            label="Drag"
            variant="accent"
            onDrag={(delta) => setLabeledLeftWidth(w => Math.max(80, Math.min(400, w + delta)))}
          />
          <div style={{ ...mutedPanel, flex: "1" }}>
            Main content
          </div>
        </div>
      </Card>
    </>
  );
};

export default DividerDemo;
