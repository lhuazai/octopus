import Vue from 'vue';
import { Button, Toast, Lazyload } from 'vant';

Vue.use(Button).use(Toast).use(Lazyload, { lazyComponent: true });
