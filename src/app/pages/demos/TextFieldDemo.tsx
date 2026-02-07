import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { TextField } from '../../../components/inputs/TextField';
import { Combobox } from '../../../components/inputs/Combobox';
import { BsSearch, BsEnvelope } from 'solid-icons/bs';

const TextFieldDemo: Component = () => {
  const [textValue1, setTextValue1] = createSignal('');
  const [textValue2, setTextValue2] = createSignal('John Doe');
  const [textValue3, setTextValue3] = createSignal('');
  const [textValue4, setTextValue4] = createSignal('');
  const [textValue5, setTextValue5] = createSignal('example@email.com');
  const [textValue6, setTextValue6] = createSignal('');
  const [textValue7, setTextValue7] = createSignal('Short text');
  const [textValue8, setTextValue8] = createSignal('');
  const [textValue9, setTextValue9] = createSignal('');
  const [multilineValue1, setMultilineValue1] = createSignal('');
  const [multilineValue2, setMultilineValue2] = createSignal('This is a textarea that automatically grows as you type more content. Try adding several lines of text to see it expand!');
  const [multilineValue3, setMultilineValue3] = createSignal('');
  const [currency, setCurrency] = createSignal('usd');
  const [protocol, setProtocol] = createSignal('https');

  return (
    <>
      <h2>TextField Component Examples</h2>

      <Card>
        <CardHeader title="Basic TextField" />
        <div class="grid--sm">
          <TextField
            placeholder="Enter text..."
            value={textValue1()}
            onChange={setTextValue1}
          />
          <p><small>Value: {textValue1() || '(empty)'}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="With Label" />
        <div class="grid--sm">
          <TextField
            label="Username"
            placeholder="Enter your username"
            value={textValue2()}
            onChange={setTextValue2}
          />
          <p><small>Value: {textValue2()}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Disabled State" />
        <TextField
          label="Disabled"
          value="Cannot edit this"
          disabled
        />
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <div class="grid--sm">
          <TextField
            size="compact"
            label="Compact TextField"
            placeholder="Smaller size"
            value={textValue4()}
            onChange={setTextValue4}
          />
          <p><small>Value: {textValue4() || '(empty)'}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="With Character Count" />
        <div class="grid--sm">
          <TextField
            label="Bio"
            placeholder="Tell us about yourself"
            maxLength={100}
            showCount
            value={textValue3()}
            onChange={setTextValue3}
          />
          <p><small>Characters: {textValue3().length}/100</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Clearable TextField" />
        <div class="grid--sm">
          <TextField
            label="Search Query"
            placeholder="Type to search..."
            clearable
            value={textValue5()}
            onChange={setTextValue5}
          />
          <p><small>Value: {textValue5() || '(empty)'}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="With Prefix and Suffix" />
        <div class="grid--sm">
          <TextField
            label="Price"
            placeholder="0.00"
            prefix="$"
            suffix="USD"
          />
          <TextField
            label="Weight"
            placeholder="Enter weight"
            suffix="kg"
          />
          <TextField
            label="Website"
            placeholder="example.com"
            prefix="https://"
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="With Icon Prefix/Suffix" />
        <div class="grid--sm">
          <TextField
            label="Search"
            placeholder="Search..."
            prefix={<BsSearch />}
          />
          <TextField
            label="Email"
            type="email"
            placeholder="your@email.com"
            suffix={<BsEnvelope />}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Different Input Types" />
        <div class="grid--sm">
          <TextField
            label="Text"
            type="text"
            placeholder="Regular text input"
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Enter password"
          />
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
          <TextField
            label="Number"
            type="number"
            placeholder="123"
          />
          <TextField
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
          <TextField
            label="URL"
            type="url"
            placeholder="https://example.com"
          />
          <TextField
            label="Search"
            type="search"
            placeholder="Search..."
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Combined Features" />
        <div class="grid--sm">
          <TextField
            label="Bio"
            placeholder="Tell us about yourself..."
            maxLength={50}
            showCount
            clearable
            value={textValue6()}
            onChange={setTextValue6}
          />
          <p><small>Value: {textValue6() || '(empty)'}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Max Length Test" subtitle="Try typing more than 20 characters" />
        <div class="grid--sm">
          <TextField
            label="Limited Input"
            placeholder="Max 20 characters"
            maxLength={20}
            showCount
            clearable
            value={textValue7()}
            onChange={setTextValue7}
          />
          <p><small>Value: "{textValue7()}" ({textValue7().length} chars)</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="With Selectable Suffix" subtitle="Combobox for currency selection" />
        <div class="grid--sm">
          <TextField
            label="Price"
            type="number"
            placeholder="0.00"
            value={textValue8()}
            onChange={setTextValue8}
            suffix={
              <Combobox
                size="compact"
                value={currency()}
                onChange={setCurrency}
                options={[
                  { value: 'usd', label: 'USD' },
                  { value: 'aud', label: 'AUD' },
                  { value: 'eur', label: 'EUR' },
                  { value: 'gbp', label: 'GBP' },
                  { value: 'jpy', label: 'JPY' },
                ]}
              />
            }
          />
          <p><small>Price: {textValue8() || '0'} {currency().toUpperCase()}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="With Selectable Prefix" subtitle="Combobox for protocol selection" />
        <div class="grid--sm">
          <TextField
            label="Website URL"
            placeholder="example.com"
            value={textValue9()}
            onChange={setTextValue9}
            prefix={
              <Combobox
                size="compact"
                value={protocol()}
                onChange={setProtocol}
                options={[
                  { value: 'https', label: 'https://' },
                  { value: 'http', label: 'http://' },
                ]}
              />
            }
          />
          <p><small>Full URL: {protocol()}://{textValue9() || 'example.com'}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Multi-Line TextField" subtitle="Basic textarea" />
        <div class="grid--sm">
          <TextField
            label="Comments"
            multiline
            placeholder="Enter your comments..."
            value={multilineValue1()}
            onChange={setMultilineValue1}
          />
          <p><small>Lines: {(multilineValue1().match(/\n/g) || []).length + 1}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Auto-Growing Textarea" subtitle="Grows from 3 to 10 rows" />
        <div class="grid--sm">
          <TextField
            label="Description"
            multiline
            rows={3}
            maxRows={10}
            placeholder="Start typing to see it grow..."
            value={multilineValue2()}
            onChange={setMultilineValue2}
            clearable
          />
          <p><small>Characters: {multilineValue2().length}</small></p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Multi-Line with Character Limit" />
        <div class="grid--sm">
          <TextField
            label="Bio"
            multiline
            rows={4}
            maxRows={6}
            maxLength={200}
            showCount
            placeholder="Write a short bio..."
            value={multilineValue3()}
            onChange={setMultilineValue3}
          />
        </div>
      </Card>
    </>
  );
};

export default TextFieldDemo;
