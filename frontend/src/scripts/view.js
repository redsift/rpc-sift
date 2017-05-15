/**
 * Botfwk Demo Sift. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    console.log('botfwk-sift: presentView: ', value);
    Object.keys(value.data).forEach((k) => {
      document.getElementById(k).textContent = value.data[k];
    });
  };

  willPresentView(value) {
    console.log('botfwk-sift: willPresentView: ', value);
  };

}

registerSiftView(new MyView(window));
