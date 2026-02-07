import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { Checkbox } from '../../../components/inputs/Checkbox';
import { Badge } from '../../../components/display/Badge';
import { BsBell, BsEnvelope, BsStar, BsGear, BsHeart, BsCheck, BsLightning, BsFire, BsDownload } from 'solid-icons/bs';

const BadgeDemo: Component = () => {
  return (
    <>
      <h2>Badge Component Examples</h2>

      <Card>
        <CardHeader title="Notification Badges on Buttons" />
        <div class="flex--sm flex--wrap">
          <Badge content={5}>
            <Button variant="primary" icon={BsBell}>Notifications</Button>
          </Badge>
          <Badge content={12} variant="primary">
            <Button variant="secondary" icon={BsEnvelope}>Messages</Button>
          </Badge>
          <Badge content={99}>
            <Button variant="subtle" icon={BsStar}>Updates</Button>
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Badge on Icon-Only Buttons" />
        <div class="flex--sm flex--wrap">
          <Badge content={3}>
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={8} variant="success">
            <Button variant="subtle" icon={BsEnvelope} />
          </Badge>
          <Badge content={150}>
            <Button variant="subtle" icon={BsStar} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Badge Variants" />
        <div class="flex--sm flex--wrap">
          <Badge content={5} variant="error">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={5} variant="primary">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={5} variant="success">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={5} variant="warning">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={5} variant="info">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={5} variant="neutral">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Badge Placements" />
        <div class="flex--sm flex--wrap" style={{ gap: "calc(var(--g-spacing) * 2)" }}>
          <Badge content={5} placement="top-right">
            <Button variant="secondary">Placement: TR</Button>
          </Badge>
          <Badge content={5} placement="top-left">
            <Button variant="secondary">Placement: TL</Button>
          </Badge>
          <Badge content={5} placement="bottom-right">
            <Button variant="secondary">Placement: BR</Button>
          </Badge>
          <Badge content={5} placement="bottom-left">
            <Button variant="secondary">Placement: BL</Button>
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Dot Badges" subtitle="Simple status indicators" />
        <div class="flex--sm flex--wrap">
          <Badge dot variant="success">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge dot variant="warning">
            <Button variant="subtle" icon={BsEnvelope} />
          </Badge>
          <Badge dot variant="error">
            <Button variant="subtle" icon={BsStar} />
          </Badge>
          <Badge dot variant="primary" placement="bottom-right">
            <Button variant="subtle" icon={BsGear} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Badges" />
        <div class="flex--sm flex--wrap">
          <Badge icon={BsCheck} variant="success">
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge icon={BsLightning} variant="warning">
            <Button variant="subtle" icon={BsEnvelope} />
          </Badge>
          <Badge icon={BsFire} variant="error">
            <Button variant="subtle" icon={BsStar} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Large Numbers" subtitle="Shows 99+ for numbers over max" />
        <div class="flex--sm flex--wrap">
          <Badge content={150}>
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={1523}>
            <Button variant="subtle" icon={BsEnvelope} />
          </Badge>
          <Badge content={500} max={999}>
            <Button variant="subtle" icon={BsStar} />
          </Badge>
          <Badge content={1500} max={999}>
            <Button variant="subtle" icon={BsHeart} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Text Content Badges" />
        <div class="flex--sm flex--wrap">
          <Badge content="New">
            <Button variant="secondary">Updates</Button>
          </Badge>
          <Badge content="!" variant="warning">
            <Button variant="subtle" icon={BsGear} />
          </Badge>
          <Badge content="PRO" variant="primary">
            <Button variant="secondary">Feature</Button>
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Zero Values" subtitle="Hidden by default, shown with showZero" />
        <div class="flex--sm flex--wrap">
          <Badge content={0}>
            <Button variant="subtle" icon={BsBell} />
          </Badge>
          <Badge content={0} showZero>
            <Button variant="subtle" icon={BsEnvelope} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="Badges on Different Elements" />
        <div class="flex--sm flex--wrap">
          <Badge content={3}>
            <Checkbox label="Notifications" iconUnchecked={BsBell} iconChecked={BsBell} />
          </Badge>
          <Badge content="New" variant="success">
            <Button variant="primary" icon={BsDownload}>Download</Button>
          </Badge>
          <Badge dot variant="error" placement="bottom-right">
            <span style={{
              display: "inline-block",
              width: "48px",
              height: "48px",
              "border-radius": "50%",
              background: "var(--color-gray-700)"
            }} />
          </Badge>
        </div>
      </Card>

      <Card>
        <CardHeader title="All Placement Combinations" />
        <div style={{
          display: "grid",
          "grid-template-columns": "repeat(2, 1fr)",
          gap: "calc(var(--g-spacing) * 2)",
          "max-width": "400px",
          "justify-items": "center"
        }}>
          <Badge content={1} placement="top-left">
            <div style={{
              display: "inline-block",
              padding: "var(--g-spacing)",
              background: "var(--g-background-elevated)",
              "border-radius": "var(--g-radius)",
              "text-align": "center",
              "min-width": "120px"
            }}>TL Corner</div>
          </Badge>
          <Badge content={2} placement="top-right">
            <div style={{
              display: "inline-block",
              padding: "var(--g-spacing)",
              background: "var(--g-background-elevated)",
              "border-radius": "var(--g-radius)",
              "text-align": "center",
              "min-width": "120px"
            }}>TR Corner</div>
          </Badge>
          <Badge content={3} placement="bottom-left">
            <div style={{
              display: "inline-block",
              padding: "var(--g-spacing)",
              background: "var(--g-background-elevated)",
              "border-radius": "var(--g-radius)",
              "text-align": "center",
              "min-width": "120px"
            }}>BL Corner</div>
          </Badge>
          <Badge content={4} placement="bottom-right">
            <div style={{
              display: "inline-block",
              padding: "var(--g-spacing)",
              background: "var(--g-background-elevated)",
              "border-radius": "var(--g-radius)",
              "text-align": "center",
              "min-width": "120px"
            }}>BR Corner</div>
          </Badge>
        </div>
      </Card>
    </>
  );
};

export default BadgeDemo;
