import { Component, JSX, splitProps } from 'solid-js';
import '../../styles/components/surfaces/Card.css';

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'emphasized' | 'subtle';
  interactive?: boolean;
  accent?: 'primary' | 'secondary' | 'accent' | 'none';
  padding?: 'compact' | 'normal' | 'spacious';
  children?: JSX.Element;
}

export const Card: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'interactive',
    'accent',
    'padding',
    'children',
    'class',
  ]);

  const variant = () => local.variant ?? 'default';
  const interactive = () => local.interactive ?? false;
  const accent = () => local.accent ?? 'none';
  const padding = () => local.padding ?? 'normal';

  const classNames = () => {
    const classes = ['card'];

    classes.push(`card--${variant()}`);

    if (interactive()) {
      classes.push('card--interactive');
    }

    if (accent() !== 'none') {
      classes.push('card--accent-left');
      classes.push(`card--${accent()}`);
    }

    if (padding() !== 'normal') {
      classes.push(`card--${padding()}`);
    }

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  return (
    <div class={classNames()} {...rest}>
      {local.children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

export const CardHeader: Component<CardHeaderProps> = (props) => {
  return (
    <div class="card__header">
      <h3>{props.title}</h3>
      {props.subtitle && <small>{props.subtitle}</small>}
    </div>
  );
};
