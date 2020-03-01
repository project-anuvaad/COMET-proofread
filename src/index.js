import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'proxy-polyfill';
import { DireflowComponent } from 'direflow-component';
import App from './direflow-component/App';

const direflowComponent = new DireflowComponent();

const direflowProperties = {
  apiKey: '',
  apiRoot: process.env.NODE_ENV === 'production' ? 'https://api.videowiki.org' : '',
  videoId: '',
  backRoute: '',
  finishRedirectRoute: '',

};

const direflowPlugins = [
  // {
  //   name: 'font-loader',
  //   options: {
  //     google: {
  //       families: ['Advent Pro', 'Noto Sans JP'],
  //     },
  //   },
  // },
];

direflowComponent.configure({
  name: 'vw-proofread',
  // useShadow: true,
  properties: direflowProperties,
  plugins: direflowPlugins,
});

direflowComponent.create(App);
