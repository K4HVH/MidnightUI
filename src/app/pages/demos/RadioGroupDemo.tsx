import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { RadioGroup } from '../../../components/inputs/RadioGroup';
import { BsBookmark, BsBookmarkFill, BsHeart, BsHeartFill, BsStar, BsStarFill } from 'solid-icons/bs';

const RadioGroupDemo: Component = () => {
  const [radioValue1, setRadioValue1] = createSignal('option2');
  const [radioValue2, setRadioValue2] = createSignal('green');
  const [radioValue3, setRadioValue3] = createSignal('star');
  const [radioValue4, setRadioValue4] = createSignal('c2');

  return (
    <>
      <h2>Radio Group Examples</h2>

      <Card>
        <CardHeader title="Basic Radio Group" />
        <RadioGroup
          name="basic"
          value={radioValue1()}
          onChange={setRadioValue1}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
            { value: 'option4', label: 'Option 4 (disabled)', disabled: true },
          ]}
        />
        <p><small>Selected: {radioValue1()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Horizontal Orientation" />
        <RadioGroup
          name="color"
          value={radioValue2()}
          onChange={setRadioValue2}
          orientation="horizontal"
          options={[
            { value: 'red', label: 'Red' },
            { value: 'green', label: 'Green' },
            { value: 'blue', label: 'Blue' },
            { value: 'yellow', label: 'Yellow', disabled: true },
          ]}
        />
        <p><small>Selected: {radioValue2()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <RadioGroup
          name="compact"
          value={radioValue4()}
          onChange={setRadioValue4}
          size="compact"
          options={[
            { value: 'c1', label: 'Compact option 1' },
            { value: 'c2', label: 'Compact option 2' },
            { value: 'c3', label: 'Compact option 3' },
          ]}
        />
        <p><small>Selected: {radioValue4()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Icon Radio Group" />
        <RadioGroup
          name="icon-rating"
          value={radioValue3()}
          onChange={setRadioValue3}
          options={[
            { value: 'bookmark', label: 'Bookmark', iconUnchecked: BsBookmark, iconChecked: BsBookmarkFill },
            { value: 'heart', label: 'Heart', iconUnchecked: BsHeart, iconChecked: BsHeartFill },
            { value: 'star', label: 'Star', iconUnchecked: BsStar, iconChecked: BsStarFill },
          ]}
        />
        <p><small>Selected: {radioValue3()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Icon Radio Group - Horizontal & Compact" />
        <RadioGroup
          name="icon-horizontal"
          orientation="horizontal"
          size="compact"
          options={[
            { value: 'b1', label: 'Bookmark', iconUnchecked: BsBookmark, iconChecked: BsBookmarkFill },
            { value: 'h1', label: 'Heart', iconUnchecked: BsHeart, iconChecked: BsHeartFill },
            { value: 's1', label: 'Star', iconUnchecked: BsStar, iconChecked: BsStarFill },
          ]}
        />
      </Card>
    </>
  );
};

export default RadioGroupDemo;
