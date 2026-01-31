import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { NotificationProvider } from '../components/feedback/Notification';
import Test from './pages/Test';

const App: Component = () => {
  return (
    <NotificationProvider>
      <Router>
        <Route path="/" component={Test} />
      </Router>
    </NotificationProvider>
  );
};

export default App;
