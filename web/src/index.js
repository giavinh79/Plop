import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Routes from './Routes';
import axios from 'axios';
import './index.css';

axios.defaults.withCredentials = true;

Sentry.init({
  dsn: "https://f9764aecb0804579aca6ba0028ee1395@o516250.ingest.sentry.io/5860784",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0,
});

ReactDOM.render(<Routes />, document.getElementById('root'));
