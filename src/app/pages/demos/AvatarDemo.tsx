import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { Avatar } from '../../../components/display/Avatar';
import { AvatarGroup } from '../../../components/display/AvatarGroup';
import { Badge } from '../../../components/display/Badge';
import { useNotification } from '../../../components/feedback/Notification';
import { BsStar, BsGear, BsHeart, BsPerson } from 'solid-icons/bs';

const AvatarDemo: Component = () => {
  const { notify } = useNotification();

  return (
    <>
      <h2>Avatar Component Examples</h2>

      <Card>
        <CardHeader title="Avatar with Images" />
        <div class="flex--sm flex--wrap">
          <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
          <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" />
          <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
          <Avatar src="https://i.pravatar.cc/150?img=4" alt="User 4" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar with Initials" subtitle="Auto-generated from name prop" />
        <div class="flex--sm flex--wrap">
          <Avatar name="John Doe" />
          <Avatar name="Sarah Smith" />
          <Avatar name="Mike Johnson" />
          <Avatar name="Emily Brown" />
          <Avatar name="David" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Manual Initials" subtitle="Using the initials prop directly" />
        <div class="flex--sm flex--wrap">
          <Avatar initials="AB" />
          <Avatar initials="CD" />
          <Avatar initials="XY" />
          <Avatar initials="Z" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar Sizes" />
        <div class="flex--sm flex--wrap" style={{ "align-items": "center" }}>
          <Avatar name="JD" size="compact" />
          <Avatar name="JD" size="normal" />
          <Avatar name="JD" size="spacious" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar Shapes" />
        <div class="flex--sm flex--wrap">
          <Avatar name="JD" shape="circle" />
          <Avatar name="JD" shape="square" />
          <Avatar src="https://i.pravatar.cc/150?img=5" shape="circle" />
          <Avatar src="https://i.pravatar.cc/150?img=6" shape="square" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar Variants" />
        <div class="flex--sm flex--wrap">
          <Avatar name="AB" variant="primary" />
          <Avatar name="CD" variant="secondary" />
          <Avatar name="EF" variant="subtle" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Variants with Icons" />
        <div class="flex--sm flex--wrap">
          <Avatar icon={BsStar} variant="primary" />
          <Avatar icon={BsGear} variant="secondary" />
          <Avatar icon={BsPerson} variant="subtle" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Fallback" subtitle="Shows when no image or initials" />
        <div class="flex--sm flex--wrap">
          <Avatar />
          <Avatar icon={BsStar} />
          <Avatar icon={BsGear} />
          <Avatar icon={BsHeart} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Interactive Avatars" subtitle="Clickable with hover effects" />
        <div class="flex--sm flex--wrap">
          <Avatar
            name="John Doe"
            onClick={() => notify({ title: 'Avatar clicked!', message: 'John Doe' })}
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=10"
            onClick={() => notify({ title: 'Avatar clicked!', message: 'User avatar' })}
          />
          <Avatar
            icon={BsStar}
            onClick={() => notify({ title: 'Avatar clicked!', message: 'Star icon' })}
          />
          <Avatar
            name="Disabled"
            onClick={() => notify({ title: 'Should not appear' })}
            disabled
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Interactive States Showcase" subtitle="Hover, focus, and active states" />
        <div class="grid--sm">
          <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)" }}>
            <Avatar
              name="Hover Me"
              onClick={() => {}}
              size="spacious"
            />
            <span>Hover for effect, click for active state</span>
          </div>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)" }}>
            <Avatar
              src="https://i.pravatar.cc/150?img=11"
              onClick={() => {}}
              size="spacious"
            />
            <span>Tab to focus (keyboard navigation)</span>
          </div>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)" }}>
            <Avatar
              name="Disabled"
              onClick={() => {}}
              size="spacious"
              disabled
            />
            <span>Disabled state (no hover effect)</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Interactive Variants" subtitle="Clickable avatars with different styles" />
        <div class="flex--sm flex--wrap">
          <Avatar
            name="AB"
            variant="primary"
            onClick={() => notify({ title: 'Primary clicked!' })}
          />
          <Avatar
            name="CD"
            variant="secondary"
            onClick={() => notify({ title: 'Secondary clicked!' })}
          />
          <Avatar
            name="EF"
            variant="subtle"
            onClick={() => notify({ title: 'Subtle clicked!' })}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Image Error Fallback" subtitle="Falls back to initials when image fails to load" />
        <div class="flex--sm flex--wrap">
          <Avatar src="invalid-url.jpg" name="John Doe" />
          <Avatar src="invalid-url.jpg" name="Sarah Smith" />
          <Avatar src="invalid-url.jpg" initials="AB" />
        </div>
      </Card>

      <Card>
        <CardHeader title="All Sizes with Shapes" />
        <div class="grid--sm">
          <div>
            <h4>Circle</h4>
            <div class="flex--sm flex--wrap" style={{ "align-items": "center" }}>
              <Avatar name="JD" size="compact" shape="circle" />
              <Avatar name="JD" size="normal" shape="circle" />
              <Avatar name="JD" size="spacious" shape="circle" />
            </div>
          </div>
          <div>
            <h4>Square</h4>
            <div class="flex--sm flex--wrap" style={{ "align-items": "center" }}>
              <Avatar name="JD" size="compact" shape="square" />
              <Avatar name="JD" size="normal" shape="square" />
              <Avatar name="JD" size="spacious" shape="square" />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatars with Badges" subtitle="Combine with Badge component for status indicators" />
        <div class="flex--sm flex--wrap">
          <Badge dot variant="success" placement="bottom-right">
            <Avatar src="https://i.pravatar.cc/150?img=7" />
          </Badge>
          <Badge dot variant="warning" placement="bottom-right">
            <Avatar name="Sarah Smith" />
          </Badge>
          <Badge dot variant="error" placement="bottom-right">
            <Avatar name="Mike Johnson" />
          </Badge>
          <Badge content={3} placement="top-right">
            <Avatar name="Emily Brown" />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar Group" subtitle="Overlapping avatars with automatic spacing" />
        <div class="grid--sm">
          <div>
            <h4>Default</h4>
            <AvatarGroup>
              <Avatar src="https://i.pravatar.cc/150?img=8" />
              <Avatar name="John Doe" />
              <Avatar name="Sarah Smith" />
              <Avatar name="Mike Johnson" />
              <Avatar name="Emily Brown" />
            </AvatarGroup>
          </div>
          <div>
            <h4>With Max Count</h4>
            <AvatarGroup max={3}>
              <Avatar src="https://i.pravatar.cc/150?img=8" />
              <Avatar name="John Doe" />
              <Avatar name="Sarah Smith" />
              <Avatar name="Mike Johnson" />
              <Avatar name="Emily Brown" />
              <Avatar name="David Wilson" />
              <Avatar name="Lisa Anderson" />
            </AvatarGroup>
          </div>
          <div>
            <h4>Compact Size</h4>
            <AvatarGroup size="compact">
              <Avatar src="https://i.pravatar.cc/150?img=9" />
              <Avatar name="AB" />
              <Avatar name="CD" />
              <Avatar name="EF" />
            </AvatarGroup>
          </div>
          <div>
            <h4>Spacious Size</h4>
            <AvatarGroup size="spacious">
              <Avatar src="https://i.pravatar.cc/150?img=10" />
              <Avatar name="XY" />
              <Avatar name="ZW" />
            </AvatarGroup>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatar Group Spacing" subtitle="Control overlap with spacing variants" />
        <div class="grid--sm">
          <div>
            <h4>Tight Spacing</h4>
            <AvatarGroup spacing="tight">
              <Avatar src="https://i.pravatar.cc/150?img=11" />
              <Avatar name="John Doe" />
              <Avatar name="Sarah Smith" />
              <Avatar name="Mike Johnson" />
            </AvatarGroup>
          </div>
          <div>
            <h4>Normal Spacing</h4>
            <AvatarGroup spacing="normal">
              <Avatar src="https://i.pravatar.cc/150?img=12" />
              <Avatar name="John Doe" />
              <Avatar name="Sarah Smith" />
              <Avatar name="Mike Johnson" />
            </AvatarGroup>
          </div>
          <div>
            <h4>Loose Spacing</h4>
            <AvatarGroup spacing="loose">
              <Avatar src="https://i.pravatar.cc/150?img=13" />
              <Avatar name="John Doe" />
              <Avatar name="Sarah Smith" />
              <Avatar name="Mike Johnson" />
            </AvatarGroup>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Interactive Avatar Groups" subtitle="Hover for animation, click avatars for interaction" />
        <div class="grid--sm">
          <div>
            <h4>Clickable Avatars</h4>
            <AvatarGroup>
              <Avatar
                src="https://i.pravatar.cc/150?img=14"
                alt="John Doe"
                onClick={() => notify({ title: 'Avatar clicked!', message: 'John Doe' })}
              />
              <Avatar
                name="Sarah Smith"
                onClick={() => notify({ title: 'Avatar clicked!', message: 'Sarah Smith' })}
              />
              <Avatar
                name="Mike Johnson"
                onClick={() => notify({ title: 'Avatar clicked!', message: 'Mike Johnson' })}
              />
              <Avatar
                name="Emily Brown"
                onClick={() => notify({ title: 'Avatar clicked!', message: 'Emily Brown' })}
              />
            </AvatarGroup>
          </div>
          <div>
            <h4>Interactive Overflow</h4>
            <AvatarGroup
              max={3}
              onOverflowClick={() => notify({ title: 'Overflow clicked!', message: 'Show all 7 members' })}
            >
              <Avatar name="Alice" onClick={() => notify({ title: 'Alice' })} />
              <Avatar name="Bob" onClick={() => notify({ title: 'Bob' })} />
              <Avatar name="Charlie" onClick={() => notify({ title: 'Charlie' })} />
              <Avatar name="David" />
              <Avatar name="Emily" />
              <Avatar name="Frank" />
              <Avatar name="Grace" />
            </AvatarGroup>
          </div>
          <div>
            <h4>Mixed Interactive States</h4>
            <AvatarGroup spacing="normal">
              <Avatar src="https://i.pravatar.cc/150?img=15" onClick={() => notify({ title: 'User 1' })} />
              <Avatar name="User 2" />
              <Avatar name="User 3" onClick={() => notify({ title: 'User 3' })} />
              <Avatar name="User 4" />
              <Avatar name="User 5" onClick={() => notify({ title: 'User 5' })} />
            </AvatarGroup>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Avatars in Context" subtitle="Real-world usage examples" />
        <div class="grid--sm">
          <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)" }}>
            <Avatar src="https://i.pravatar.cc/150?img=9" size="compact" />
            <div>
              <div style={{ "font-weight": "var(--font-weight-medium)" }}>John Doe</div>
              <div style={{ "font-size": "14px", color: "var(--g-text-secondary)" }}>john@example.com</div>
            </div>
          </div>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)" }}>
            <Badge dot variant="success" placement="bottom-right">
              <Avatar name="Sarah Smith" size="compact" />
            </Badge>
            <div>
              <div style={{ "font-weight": "var(--font-weight-medium)" }}>Sarah Smith</div>
              <div style={{ "font-size": "14px", color: "var(--g-text-secondary)" }}>Online</div>
            </div>
          </div>
          <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)", "justify-content": "space-between" }}>
            <div style={{ display: "flex", "align-items": "center", gap: "var(--g-spacing)" }}>
              <Avatar name="Mike Johnson" size="compact" shape="square" />
              <div>
                <div style={{ "font-weight": "var(--font-weight-medium)" }}>Mike Johnson</div>
                <div style={{ "font-size": "14px", color: "var(--g-text-secondary)" }}>Typing...</div>
              </div>
            </div>
            <Button variant="subtle" size="compact">Message</Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AvatarDemo;
