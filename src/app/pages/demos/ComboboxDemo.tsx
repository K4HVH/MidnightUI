import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Combobox } from '../../../components/inputs/Combobox';
import { BsCircle, BsSquare, BsTriangle, BsStar, BsHeart, BsBookmark } from 'solid-icons/bs';

const ComboboxDemo: Component = () => {
  const [comboValue1, setComboValue1] = createSignal('option2');
  const [comboValue2, setComboValue2] = createSignal<string>();
  const [comboValue3, setComboValue3] = createSignal('circle');
  const [comboValue4, setComboValue4] = createSignal('medium');
  const [comboValue5, setComboValue5] = createSignal<string>();
  const [comboValue6, setComboValue6] = createSignal<string>();
  const [comboValue7, setComboValue7] = createSignal<string>();

  return (
    <>
      <h2>Combobox Examples</h2>

      <Card>
        <CardHeader title="Basic Combobox" />
        <Combobox
          value={comboValue1()}
          onChange={setComboValue1}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
            { value: 'option4', label: 'Option 4' },
          ]}
        />
        <p><small>Selected: {comboValue1()}</small></p>
      </Card>

      <Card>
        <CardHeader title="With Placeholder" />
        <Combobox
          placeholder="Choose an option..."
          value={comboValue2()}
          onChange={setComboValue2}
          options={[
            { value: 'red', label: 'Red' },
            { value: 'green', label: 'Green' },
            { value: 'blue', label: 'Blue' },
          ]}
        />
        <p><small>Selected: {comboValue2() || 'None'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <Combobox
          size="compact"
          value={comboValue4()}
          onChange={setComboValue4}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
        <p><small>Selected: {comboValue4()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Disabled State" />
        <div class="grid--sm">
          <Combobox
            disabled
            value="option1"
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
            ]}
          />
          <Combobox
            disabled
            placeholder="Disabled with placeholder"
            options={[
              { value: 'option1', label: 'Option 1' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="With Icons" />
        <Combobox
          value={comboValue3()}
          onChange={setComboValue3}
          options={[
            { value: 'circle', label: 'Circle', icon: BsCircle },
            { value: 'square', label: 'Square', icon: BsSquare },
            { value: 'triangle', label: 'Triangle', icon: BsTriangle },
          ]}
        />
        <p><small>Selected: {comboValue3()}</small></p>
      </Card>

      <Card>
        <CardHeader title="With Disabled Options" />
        <Combobox
          placeholder="Select a shape..."
          value={comboValue5()}
          onChange={setComboValue5}
          options={[
            { value: 'star', label: 'Star', icon: BsStar },
            { value: 'heart', label: 'Heart', icon: BsHeart },
            { value: 'bookmark', label: 'Bookmark (disabled)', icon: BsBookmark, disabled: true },
            { value: 'circle', label: 'Circle', icon: BsCircle },
          ]}
        />
        <p><small>Selected: {comboValue5() || 'None'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Long List" />
        <Combobox
          placeholder="Select a number..."
          value={comboValue6()}
          onChange={setComboValue6}
          options={[
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
            { value: '3', label: 'Three' },
            { value: '4', label: 'Four' },
            { value: '5', label: 'Five' },
            { value: '6', label: 'Six' },
            { value: '7', label: 'Seven' },
            { value: '8', label: 'Eight' },
            { value: '9', label: 'Nine' },
            { value: '10', label: 'Ten' },
          ]}
        />
        <p><small>Selected: {comboValue6() || 'None'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Mixed Short & Long Options" subtitle="Testing text overflow" />
        <Combobox
          placeholder="Select an option..."
          value={comboValue7()}
          onChange={setComboValue7}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'long1', label: 'This is a very long option text that might get cut off if not handled properly' },
            { value: 'maybe', label: 'Maybe' },
            { value: 'long2', label: 'Another extremely long option label to test text overflow and wrapping behavior' },
            { value: 'ok', label: 'OK' },
          ]}
        />
        <p><small>Selected: {comboValue7() || 'None'}</small></p>
      </Card>
    </>
  );
};

export default ComboboxDemo;
