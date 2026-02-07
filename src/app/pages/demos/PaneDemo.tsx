import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { Checkbox } from '../../../components/inputs/Checkbox';
import { Pane, type PaneState } from '../../../components/navigation/Pane';
import { BsStar, BsSearch, BsGear, BsPerson, BsBell, BsFire, BsLightning, BsHeart } from 'solid-icons/bs';

const PaneDemo: Component = () => {
  const [tempPaneOpen, setTempPaneOpen] = createSignal(false);
  const [fixedPaneOpen, setFixedPaneOpen] = createSignal(false);
  const [paneState1, setPaneState1] = createSignal<PaneState>('partial');
  const [paneState2, setPaneState2] = createSignal<PaneState>('closed');

  return (
    <>
      {/* Viewport-level temporary overlay panes (fixed) */}
      <Pane
        position="left"
        mode="temporary"
        behavior="overlay"
        fixed
        state={tempPaneOpen() ? 'open' : 'closed'}
        onStateChange={(s) => setTempPaneOpen(s !== 'closed')}
        openSize="280px"
      >
        <div style={{ padding: "var(--g-spacing)" }}>
          <h5>Quick Actions</h5>
          <div style={{ display: "flex", "flex-direction": "column", gap: "var(--g-spacing-sm)", "margin-top": "var(--g-spacing-sm)" }}>
            <div class="flex--sm"><BsSearch /> <span>Search</span></div>
            <div class="flex--sm"><BsBell /> <span>Notifications</span></div>
            <div class="flex--sm"><BsGear /> <span>Settings</span></div>
          </div>
        </div>
      </Pane>
      <Pane
        position="right"
        mode="temporary"
        behavior="overlay"
        fixed
        state={fixedPaneOpen() ? 'open' : 'closed'}
        onStateChange={(s) => setFixedPaneOpen(s !== 'closed')}
        openSize="300px"
      >
        <div style={{ padding: "var(--g-spacing)" }}>
          <h5>Settings</h5>
          <div style={{ display: "flex", "flex-direction": "column", gap: "var(--g-spacing-sm)", "margin-top": "var(--g-spacing-sm)" }}>
            <Checkbox label="Dark mode" checked={true} onChange={() => {}} />
            <Checkbox label="Notifications" checked={false} onChange={() => {}} />
            <Checkbox label="Compact layout" checked={false} onChange={() => {}} />
          </div>
        </div>
      </Pane>

      {/* ================================================================
          Pane Component Examples
          ================================================================ */}
      <h2>Pane Component Examples</h2>

      <Card>
        <CardHeader title="Permanent Push Pane" subtitle="Handle cycles through closed → partial → open states" />
        <div style={{ position: "relative", height: "200px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
          <Pane
            position="left"
            mode="permanent"
            defaultState="partial"
            openSize="160px"
            partialSize="40px"
            partialChildren={
              <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "var(--g-spacing-sm)", padding: "var(--g-spacing-sm) 0" }}>
                <BsStar style={{ color: "var(--g-text-muted)" }} />
                <BsSearch style={{ color: "var(--g-text-muted)" }} />
                <BsGear style={{ color: "var(--g-text-muted)" }} />
              </div>
            }
          >
            <div style={{ padding: "var(--g-spacing)" }}>
              <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
                <div class="flex--sm"><BsStar /> <span>Favorites</span></div>
                <div class="flex--sm"><BsSearch /> <span>Search</span></div>
                <div class="flex--sm"><BsGear /> <span>Settings</span></div>
              </div>
            </div>
          </Pane>
          <div style={{ flex: "1", padding: "var(--g-spacing)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-sm)" }}>
            Click the handle to cycle states
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Positions" subtitle="Panes attach to any edge of their container" />
        <div class="grid--sm" style={{ "grid-template-columns": "1fr 1fr" }}>
          <div>
            <h4>Left</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" defaultState="open" openSize="80px">
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Left</div>
              </Pane>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content</div>
            </div>
          </div>
          <div>
            <h4>Right</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content</div>
              <Pane position="right" mode="permanent" defaultState="open" openSize="80px">
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Right</div>
              </Pane>
            </div>
          </div>
          <div>
            <h4>Top</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", "flex-direction": "column", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="top" mode="permanent" defaultState="open" openSize="50px">
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Top</div>
              </Pane>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content</div>
            </div>
          </div>
          <div>
            <h4>Bottom</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", "flex-direction": "column", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content</div>
              <Pane position="bottom" mode="permanent" defaultState="open" openSize="50px">
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Bottom</div>
              </Pane>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Controlled State" subtitle="External buttons control pane state" />
        <div class="grid--sm">
          <div class="flex--sm">
            <Button size="compact" variant={paneState2() === 'closed' ? 'primary' : 'subtle'} onClick={() => setPaneState2('closed')}>Closed</Button>
            <Button size="compact" variant={paneState2() === 'partial' ? 'primary' : 'subtle'} onClick={() => setPaneState2('partial')}>Partial</Button>
            <Button size="compact" variant={paneState2() === 'open' ? 'primary' : 'subtle'} onClick={() => setPaneState2('open')}>Open</Button>
          </div>
          <div style={{ position: "relative", height: "180px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
            <Pane
              position="left"
              mode="permanent"
              state={paneState2()}
              onStateChange={setPaneState2}
              openSize="140px"
              partialSize="40px"
              partialChildren={
                <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "var(--g-spacing-sm)", padding: "var(--g-spacing-sm) 0" }}>
                  <BsStar style={{ color: "var(--g-text-muted)" }} />
                  <BsPerson style={{ color: "var(--g-text-muted)" }} />
                </div>
              }
            >
              <div style={{ padding: "var(--g-spacing)" }}>
                <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
                  <div class="flex--sm"><BsStar /> <span>Favorites</span></div>
                  <div class="flex--sm"><BsPerson /> <span>Profile</span></div>
                </div>
              </div>
            </Pane>
            <div style={{ flex: "1", padding: "var(--g-spacing)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-sm)" }}>
              Main content
            </div>
          </div>
          <p><small>Current state: {paneState2()}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Push vs Overlay" subtitle="Push displaces content, overlay slides over it" />
        <div class="grid--sm" style={{ "grid-template-columns": "1fr 1fr" }}>
          <div>
            <h4>Push</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" behavior="push" defaultState="open" openSize="80px">
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Push pane</div>
              </Pane>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content pushed aside</div>
            </div>
          </div>
          <div>
            <h4>Overlay</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" behavior="overlay" defaultState="open" openSize="80px" handle>
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Overlay pane</div>
              </Pane>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content underneath</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Size Variants" subtitle="Handle dimensions adapt to size variant" />
        <div class="grid--sm" style={{ "grid-template-columns": "1fr 1fr 1fr" }}>
          <div>
            <h4>Compact</h4>
            <div style={{ position: "relative", height: "120px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" size="compact" defaultState="open" openSize="60px">
                <div style={{ padding: "var(--g-spacing-xs)", color: "var(--g-text-muted)", "font-size": "10px" }}>Compact</div>
              </Pane>
              <div style={{ flex: "1" }} />
            </div>
          </div>
          <div>
            <h4>Normal</h4>
            <div style={{ position: "relative", height: "120px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" size="normal" defaultState="open" openSize="60px">
                <div style={{ padding: "var(--g-spacing-xs)", color: "var(--g-text-muted)", "font-size": "10px" }}>Normal</div>
              </Pane>
              <div style={{ flex: "1" }} />
            </div>
          </div>
          <div>
            <h4>Spacious</h4>
            <div style={{ position: "relative", height: "120px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" size="spacious" defaultState="open" openSize="60px">
                <div style={{ padding: "var(--g-spacing-xs)", color: "var(--g-text-muted)", "font-size": "10px" }}>Spacious</div>
              </Pane>
              <div style={{ flex: "1" }} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Partial Content Cross-fade" subtitle="Different content for partial and open states with animated transitions" />
        <div style={{ position: "relative", height: "200px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
          <Pane
            position="left"
            mode="permanent"
            state={paneState1()}
            onStateChange={setPaneState1}
            openSize="160px"
            partialSize="44px"
            partialChildren={
              <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "var(--g-spacing-sm)", padding: "var(--g-spacing-sm) 0" }}>
                <BsFire style={{ color: "var(--color-danger)" }} />
                <BsLightning style={{ color: "var(--color-primary)" }} />
                <BsHeart style={{ color: "var(--g-text-muted)" }} />
              </div>
            }
          >
            <div style={{ padding: "var(--g-spacing)" }}>
              <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
                <div class="flex--sm"><BsFire style={{ color: "var(--color-danger)" }} /> <span>Trending</span></div>
                <div class="flex--sm"><BsLightning style={{ color: "var(--color-primary)" }} /> <span>Quick Access</span></div>
                <div class="flex--sm"><BsHeart style={{ color: "var(--g-text-muted)" }} /> <span>Favorites</span></div>
              </div>
            </div>
          </Pane>
          <div style={{ flex: "1", padding: "var(--g-spacing)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-sm)" }}>
            Partial shows icons — open shows labels
          </div>
        </div>
        <p><small>State: {paneState1()} — click handle to cycle through closed → partial → open</small></p>
      </Card>

      <Card>
        <CardHeader title="Temporary Overlay Panes" subtitle="Fixed viewport-level panes with backdrop dismiss" />
        <div class="flex--sm">
          <Button onClick={() => setTempPaneOpen(true)}>Open Left Pane</Button>
          <Button onClick={() => setFixedPaneOpen(true)}>Open Right Pane</Button>
        </div>
        <p><small>Fixed overlay panes render at the viewport level. Click backdrop or press Escape to dismiss.</small></p>
      </Card>

      <Card>
        <CardHeader title="Custom Sizes" subtitle="Override open and partial dimensions via props" />
        <div class="grid--sm" style={{ "grid-template-columns": "1fr 1fr" }}>
          <div>
            <h4>Wide (240px)</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" defaultState="open" openSize="240px">
                <div style={{ padding: "var(--g-spacing)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>240px wide pane</div>
              </Pane>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content</div>
            </div>
          </div>
          <div>
            <h4>Narrow (100px)</h4>
            <div style={{ position: "relative", height: "140px", display: "flex", overflow: "hidden", border: "1px solid var(--g-border-color)", "border-radius": "var(--g-radius)" }}>
              <Pane position="left" mode="permanent" defaultState="open" openSize="100px">
                <div style={{ padding: "var(--g-spacing-sm)", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>100px</div>
              </Pane>
              <div style={{ flex: "1", padding: "var(--g-spacing-sm)", display: "flex", "align-items": "center", "justify-content": "center", color: "var(--g-text-muted)", "font-size": "var(--font-size-xs)" }}>Content</div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PaneDemo;
