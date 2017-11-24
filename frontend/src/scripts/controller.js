/**
 * RPC Sift - A Sift demonstrating the Sift API access.
 */

import 'babel-polyfill';

import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class RPCSiftController extends SiftController {
  constructor() {
    super()
    this.onStorageUpdate = this.onStorageUpdate.bind(this);
  }
  // for more info: http://docs.redsift.com/docs/client-code-siftcontroller
  loadView({ params }) {
    console.log('[rpc-sift|controller] loadView | params:', params);

     this.storage.subscribe(['test'], this.onStorageUpdate)

    const {rpcApiConfig} = params
    return {
      html: 'summary.html',
      data: {
        rpcApiConfig
      }
    };
  }

  onStorageUpdate() {
    this.storage.getAll({bucket: 'test'}).then(d => {
      console.log('server/settings', d);
    });
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new RPCSiftController());
