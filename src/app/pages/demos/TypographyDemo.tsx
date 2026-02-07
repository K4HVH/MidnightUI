import type { Component } from 'solid-js';
import { Card } from '../../../components/surfaces/Card';

const TypographyDemo: Component = () => {
  return (
    <>
      <Card>
        <h2>Typography Examples</h2>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>

        <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>. Here's a <a href="#">link example</a>.</p>
        <p><small>This is small text for captions or footnotes.</small></p>

        <ul>
          <li>Unordered list item 1</li>
          <li>Unordered list item 2</li>
          <li>Unordered list item 3</li>
        </ul>

        <ol>
          <li>Ordered list item 1</li>
          <li>Ordered list item 2</li>
          <li>Ordered list item 3</li>
        </ol>

        <p>Inline code example: <code>const foo = 'bar';</code></p>

        <pre>{`function example() {
  console.log('Code block example');
  return true;
}`}</pre>

        <blockquote>
          This is a blockquote for highlighting important information or quotes.
        </blockquote>

        <hr />

        <div class="flex--sm flex--wrap">
          <span class="text-xs">Extra Small</span>
          <span class="text-sm">Small</span>
          <span class="text-base">Base</span>
          <span class="text-lg">Large</span>
          <span class="text-xl">XL</span>
        </div>
      </Card>
    </>
  );
};

export default TypographyDemo;
