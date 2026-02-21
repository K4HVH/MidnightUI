import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Checkbox } from '../../../components/inputs/Checkbox';
import { BsBookmark, BsBookmarkFill, BsHeart, BsHeartFill, BsStar, BsStarFill } from 'solid-icons/bs';

const CheckboxDemo: Component = () => {
  const [checked1, setChecked1] = createSignal(false);
  const [checked2, setChecked2] = createSignal(true);
  const [checked3, setChecked3] = createSignal(false);

  return (
    <>
      <h2>Checkbox Component Examples</h2>

      <Card>
        <CardHeader title="Basic Checkboxes" />
        <div class="grid--sm">
          <Checkbox label="Unchecked checkbox" />
          <Checkbox label="Checked checkbox" checked />
          <Checkbox label="Disabled checkbox" disabled />
          <Checkbox label="Disabled checked" checked disabled />
        </div>
      </Card>

      <Card>
        <CardHeader title="Interactive Checkboxes" />
        <div class="grid--sm">
          <Checkbox
            label="Toggle me"
            checked={checked1()}
            onChange={setChecked1}
          />
          <Checkbox
            label="Toggle me too"
            checked={checked2()}
            onChange={setChecked2}
          />
          <p>
            <small>
              Checkbox 1: {checked1() ? 'checked' : 'unchecked'} |
              Checkbox 2: {checked2() ? 'checked' : 'unchecked'}
            </small>
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Indeterminate State" />
        <div class="grid--sm">
          <Checkbox label="Indeterminate checkbox" indeterminate />
          <Checkbox
            label="Toggle all states"
            checked={checked3()}
            indeterminate={checked3() === undefined}
            onChange={setChecked3}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <div class="grid--sm">
          <Checkbox label="Compact unchecked" size="compact" />
          <Checkbox label="Compact checked" size="compact" checked />
          <Checkbox label="Compact indeterminate" size="compact" indeterminate />
        </div>
      </Card>

      <Card>
        <CardHeader title="Without Labels" />
        <div class="flex--sm">
          <Checkbox />
          <Checkbox checked />
          <Checkbox indeterminate />
          <Checkbox size="compact" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Checkboxes" subtitle="Using solid-icons library" />
        <div class="grid--sm">
          <Checkbox label="Bookmark" iconUnchecked={BsBookmark} iconChecked={BsBookmarkFill} />
          <Checkbox label="Bookmark (checked)" iconUnchecked={BsBookmark} iconChecked={BsBookmarkFill} checked />
          <Checkbox label="Heart" iconUnchecked={BsHeart} iconChecked={BsHeartFill} />
          <Checkbox label="Heart (checked)" iconUnchecked={BsHeart} iconChecked={BsHeartFill} checked />
          <Checkbox label="Star" iconUnchecked={BsStar} iconChecked={BsStarFill} />
          <Checkbox label="Star (checked)" iconUnchecked={BsStar} iconChecked={BsStarFill} checked />
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Checkboxes - Compact" />
        <div class="grid--sm">
          <Checkbox label="Compact bookmark" iconUnchecked={BsBookmark} iconChecked={BsBookmarkFill} size="compact" />
          <Checkbox label="Compact heart" iconUnchecked={BsHeart} iconChecked={BsHeartFill} size="compact" checked />
          <Checkbox label="Compact star" iconUnchecked={BsStar} iconChecked={BsStarFill} size="compact" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Icon Checkboxes - No Labels" />
        <div class="flex--sm">
          <Checkbox iconUnchecked={BsBookmark} iconChecked={BsBookmarkFill} />
          <Checkbox iconUnchecked={BsBookmark} iconChecked={BsBookmarkFill} checked />
          <Checkbox iconUnchecked={BsHeart} iconChecked={BsHeartFill} />
          <Checkbox iconUnchecked={BsHeart} iconChecked={BsHeartFill} checked />
          <Checkbox iconUnchecked={BsStar} iconChecked={BsStarFill} />
          <Checkbox iconUnchecked={BsStar} iconChecked={BsStarFill} checked />
        </div>
      </Card>
    </>
  );
};

export default CheckboxDemo;
