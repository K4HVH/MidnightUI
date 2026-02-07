import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Combobox } from '../../../components/inputs/Combobox';
import { BsStar, BsStarFill, BsHeart, BsHeartFill, BsBookmark, BsBookmarkFill, BsCircle, BsCircleFill } from 'solid-icons/bs';

const MultiSelectComboboxDemo: Component = () => {
  const [comboMulti1, setComboMulti1] = createSignal<string[]>(['option2']);
  const [comboMulti2, setComboMulti2] = createSignal<string[]>([]);
  const [comboMulti3, setComboMulti3] = createSignal<string[]>(['star', 'heart']);

  return (
    <>
      <h2>Multi-Select Combobox Examples</h2>

      <Card>
        <CardHeader title="Basic Multi-Select" />
        <Combobox
          multiple
          value={comboMulti1()}
          onChange={setComboMulti1}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
            { value: 'option4', label: 'Option 4' },
          ]}
        />
        <p><small>Selected: {comboMulti1().join(', ') || 'None'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Multi-Select with Placeholder" />
        <Combobox
          multiple
          placeholder="Select multiple colors..."
          value={comboMulti2()}
          onChange={setComboMulti2}
          options={[
            { value: 'red', label: 'Red' },
            { value: 'green', label: 'Green' },
            { value: 'blue', label: 'Blue' },
            { value: 'yellow', label: 'Yellow' },
            { value: 'purple', label: 'Purple' },
          ]}
        />
        <p><small>Selected: {comboMulti2().join(', ') || 'None'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Multi-Select with Icons" />
        <Combobox
          multiple
          placeholder="Select favorites..."
          value={comboMulti3()}
          onChange={setComboMulti3}
          options={[
            { value: 'star', label: 'Star', iconUnchecked: BsStar, iconChecked: BsStarFill },
            { value: 'heart', label: 'Heart', iconUnchecked: BsHeart, iconChecked: BsHeartFill },
            { value: 'bookmark', label: 'Bookmark', iconUnchecked: BsBookmark, iconChecked: BsBookmarkFill },
            { value: 'circle', label: 'Circle', iconUnchecked: BsCircle, iconChecked: BsCircleFill },
          ]}
        />
        <p><small>Selected: {comboMulti3().join(', ') || 'None'}</small></p>
      </Card>
    </>
  );
};

export default MultiSelectComboboxDemo;
