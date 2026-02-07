import type { Component } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Button } from '../../../components/inputs/Button';
import { Checkbox } from '../../../components/inputs/Checkbox';
import { Tooltip } from '../../../components/display/Tooltip';
import { BsPlus, BsTrash, BsPencil, BsDownload, BsUpload, BsGear, BsStar, BsStarFill, BsHeart, BsHeartFill, BsBookmark, BsBookmarkFill, BsInfoCircle, BsQuestionCircle } from 'solid-icons/bs';

const TooltipDemo: Component = () => {
  return (
    <>
      <h2>Tooltip Component Examples</h2>

      <Card>
        <CardHeader title="Basic Tooltips" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="This is a tooltip">
            <Button variant="secondary">Hover me</Button>
          </Tooltip>
          <Tooltip content="Tooltips work on any element">
            <Button variant="primary">Hover me too</Button>
          </Tooltip>
          <Tooltip content="You can also focus me with Tab key">
            <Button variant="subtle">Focus me</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Tooltip Placements" subtitle="Hover to see different positions" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="Top placement (default)" placement="top">
            <Button variant="secondary">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom placement" placement="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left placement" placement="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
          <Tooltip content="Right placement" placement="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Auto-Flip Behavior" subtitle="Try hovering near screen edges" />
        <div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', padding: 'var(--g-spacing)' }}>
          <Tooltip content="This tooltip will flip to the right if there's not enough space on the left" placement="left">
            <Button variant="secondary">Left edge</Button>
          </Tooltip>
          <Tooltip content="This tooltip will flip to the left if there's not enough space on the right" placement="right">
            <Button variant="secondary">Right edge</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Size Variants" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="Normal sized tooltip with regular text" size="normal">
            <Button variant="secondary">Normal size</Button>
          </Tooltip>
          <Tooltip content="Compact sized tooltip" size="compact">
            <Button variant="secondary">Compact size</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Disabled Tooltips" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="This tooltip is disabled" disabled>
            <Button variant="secondary">Disabled tooltip</Button>
          </Tooltip>
          <Tooltip content="This tooltip is enabled">
            <Button variant="secondary">Enabled tooltip</Button>
          </Tooltip>
          <Tooltip content="Tooltip on disabled button">
            <Button variant="secondary" disabled>Disabled button</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Rich Content Tooltips" />
        <div class="flex--sm flex--wrap">
          <Tooltip content={<div><strong>Bold</strong> and <em>italic</em> text</div>}>
            <Button variant="secondary">Rich content</Button>
          </Tooltip>
          <Tooltip content={
            <div>
              <div><strong>User Settings</strong></div>
              <div style={{ "margin-top": "4px", "font-size": "12px", opacity: 0.8 }}>
                Configure your preferences
              </div>
            </div>
          }>
            <Button variant="secondary" icon={BsGear}>Settings</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Tooltips on Different Elements" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="Tooltip on primary button">
            <Button variant="primary" icon={BsPlus}>Add Item</Button>
          </Tooltip>
          <Tooltip content="Delete this item">
            <Button variant="danger" icon={BsTrash} />
          </Tooltip>
          <Tooltip content="Edit settings">
            <Button variant="subtle" icon={BsPencil} />
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Buttons with Tooltips" subtitle="Useful for explaining icon-only buttons" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="Add new item">
            <Button variant="primary" icon={BsPlus} size="compact" />
          </Tooltip>
          <Tooltip content="Download file">
            <Button variant="secondary" icon={BsDownload} size="compact" />
          </Tooltip>
          <Tooltip content="Upload file">
            <Button variant="secondary" icon={BsUpload} size="compact" />
          </Tooltip>
          <Tooltip content="Edit content">
            <Button variant="subtle" icon={BsPencil} size="compact" />
          </Tooltip>
          <Tooltip content="Delete permanently">
            <Button variant="danger" icon={BsTrash} size="compact" />
          </Tooltip>
          <Tooltip content="Open settings">
            <Button variant="subtle" icon={BsGear} size="compact" />
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Tooltips with Checkboxes" />
        <div class="grid--sm">
          <Tooltip content="Save this item to your favorites" placement="right">
            <Checkbox label="Favorite" iconUnchecked={BsStar} iconChecked={BsStarFill} />
          </Tooltip>
          <Tooltip content="Add this to your bookmarks" placement="right">
            <Checkbox label="Bookmark" iconUnchecked={BsBookmark} iconChecked={BsBookmarkFill} />
          </Tooltip>
          <Tooltip content="Like this content">
            <Checkbox label="Like" iconUnchecked={BsHeart} iconChecked={BsHeartFill} />
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Informational Tooltips" subtitle="Using icons to indicate help text" />
        <div class="grid--sm">
          <div style={{ display: 'flex', 'align-items': 'center', gap: 'var(--g-spacing-sm)' }}>
            <span>Username</span>
            <Tooltip content="Your username must be unique and between 3-20 characters" placement="right">
              <span style={{ cursor: 'help', color: 'var(--g-text-secondary)' }}>
                <BsQuestionCircle />
              </span>
            </Tooltip>
          </div>
          <div style={{ display: 'flex', 'align-items': 'center', gap: 'var(--g-spacing-sm)' }}>
            <span>Email notifications</span>
            <Tooltip content="You will receive email updates when someone comments on your posts" placement="right">
              <span style={{ cursor: 'help', color: 'var(--color-primary)' }}>
                <BsInfoCircle />
              </span>
            </Tooltip>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Compact Tooltips" subtitle="Using compact size for subtle hints" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="Save" size="compact" placement="bottom">
            <Button size="compact" variant="primary">Save</Button>
          </Tooltip>
          <Tooltip content="Cancel" size="compact" placement="bottom">
            <Button size="compact" variant="subtle">Cancel</Button>
          </Tooltip>
          <Tooltip content="Delete" size="compact" placement="bottom">
            <Button size="compact" variant="danger">Delete</Button>
          </Tooltip>
        </div>
      </Card>

      <Card>
        <CardHeader title="Long Tooltip Content" subtitle="Tooltips automatically wrap text" />
        <div class="flex--sm flex--wrap">
          <Tooltip content="This is a longer tooltip with more detailed information. The text will automatically wrap to multiple lines when it exceeds the maximum width.">
            <Button variant="secondary">Long tooltip</Button>
          </Tooltip>
          <Tooltip content="Tooltips have a maximum width of 250px by default, which helps keep them readable and prevents them from stretching too wide across the screen.">
            <Button variant="secondary">Very long tooltip</Button>
          </Tooltip>
        </div>
      </Card>
    </>
  );
};

export default TooltipDemo;
