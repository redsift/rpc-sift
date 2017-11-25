/**
 * RPC Sift - A Sift demonstrating the Sift API access.
 */

import 'babel-polyfill';

import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class RPCSiftController extends SiftController {
  constructor() {
    super()
    this._onStorageUpdate = this._onStorageUpdate.bind(this);
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftcontroller
  loadView({ params }) {
    console.log('[rpc-sift|controller] loadView | params:', params);

    this.storage.subscribe(['settings'], this._onStorageUpdate)

    const { rpcApiConfig } = params;

    return {
      html: 'summary.html',
      data: {
        rpcApiConfig
      }
    };
  }

  _onStorageUpdate() {
    this.storage.getAll({ bucket: 'settings' }).then(bucket => {
      console.log('[SiftController::onStorageUpdate] settings bucket:', bucket);

      const settings = JSON.parse(bucket[0].value);

      this.publish('settingsUpdate', settings);
    });
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new RPCSiftController());
