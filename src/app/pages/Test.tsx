import type { Component } from 'solid-js';
import { createSignal, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { GridBackground } from '../../components/surfaces/GridBackground';
import { Pane, type PaneState } from '../../components/navigation/Pane';
import { Tabs } from '../../components/navigation/Tabs';
import {
  BsType, BsInputCursor, BsCardText, BsCheckSquare, BsCircle,
  BsList, BsChevronExpand, BsSliders, BsCursor, BsGrid,
  BsArrowRepeat, BsWindowStack, BsBell, BsChat, BsAward,
  BsPerson, BsFolder, BsLayoutSidebar,
} from 'solid-icons/bs';

import TypographyDemo from './demos/TypographyDemo';
import TextFieldDemo from './demos/TextFieldDemo';
import CardDemo from './demos/CardDemo';
import CheckboxDemo from './demos/CheckboxDemo';
import RadioGroupDemo from './demos/RadioGroupDemo';
import ComboboxDemo from './demos/ComboboxDemo';
import MultiSelectComboboxDemo from './demos/MultiSelectComboboxDemo';
import SliderDemo from './demos/SliderDemo';
import ButtonDemo from './demos/ButtonDemo';
import ButtonGroupDemo from './demos/ButtonGroupDemo';
import SpinnerDemo from './demos/SpinnerDemo';
import DialogDemo from './demos/DialogDemo';
import NotificationDemo from './demos/NotificationDemo';
import TooltipDemo from './demos/TooltipDemo';
import BadgeDemo from './demos/BadgeDemo';
import AvatarDemo from './demos/AvatarDemo';
import TabsDemo from './demos/TabsDemo';
import PaneDemo from './demos/PaneDemo';

const demos = [
  { value: 'typography', label: 'Typography', icon: BsType, component: TypographyDemo },
  { value: 'textfield', label: 'TextField', icon: BsInputCursor, component: TextFieldDemo },
  { value: 'card', label: 'Card', icon: BsCardText, component: CardDemo },
  { value: 'checkbox', label: 'Checkbox', icon: BsCheckSquare, component: CheckboxDemo },
  { value: 'radiogroup', label: 'RadioGroup', icon: BsCircle, component: RadioGroupDemo },
  { value: 'combobox', label: 'Combobox', icon: BsList, component: ComboboxDemo },
  { value: 'multiselect', label: 'Multi-Select', icon: BsChevronExpand, component: MultiSelectComboboxDemo },
  { value: 'slider', label: 'Slider', icon: BsSliders, component: SliderDemo },
  { value: 'button', label: 'Button', icon: BsCursor, component: ButtonDemo },
  { value: 'buttongroup', label: 'ButtonGroup', icon: BsGrid, component: ButtonGroupDemo },
  { value: 'spinner', label: 'Spinner', icon: BsArrowRepeat, component: SpinnerDemo },
  { value: 'dialog', label: 'Dialog', icon: BsWindowStack, component: DialogDemo },
  { value: 'notification', label: 'Notification', icon: BsBell, component: NotificationDemo },
  { value: 'tooltip', label: 'Tooltip', icon: BsChat, component: TooltipDemo },
  { value: 'badge', label: 'Badge', icon: BsAward, component: BadgeDemo },
  { value: 'avatar', label: 'Avatar', icon: BsPerson, component: AvatarDemo },
  { value: 'tabs', label: 'Tabs', icon: BsFolder, component: TabsDemo },
  { value: 'pane', label: 'Pane', icon: BsLayoutSidebar, component: PaneDemo },
];

const tabOptions = demos.map(d => ({ value: d.value, label: d.label, icon: d.icon }));

const Test: Component = () => {
  const [activeDemo, setActiveDemo] = createSignal('typography');
  const [paneState, setPaneState] = createSignal<PaneState>('partial');

  const activeComponent = createMemo(() => {
    const demo = demos.find(d => d.value === activeDemo());
    return demo?.component;
  });

  return (
    <>
      <GridBackground gridSize={10} />

      <div class="content" style={{ display: "flex", height: "100%", width: "100%" }}>
        <Pane
          position="left"
          mode="permanent"
          openSize="200px"
          partialSize="50px"
          state={paneState()}
          onStateChange={setPaneState}
        >
          <Tabs
            orientation="vertical"
            variant="subtle"
            value={activeDemo()}
            onChange={setActiveDemo}
            options={tabOptions}
            class={paneState() !== 'open' ? 'tabs--labels-hidden' : ''}
          />
        </Pane>

        <div style={{ flex: 1, overflow: "auto" }}>
          <div class="container grid">
            <h1>Design System Test Page</h1>
            <Dynamic component={activeComponent()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
