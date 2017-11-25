/**
 * RPC Sift - A Sift demonstrating the Sift API access.
 */

import 'babel-polyfill';

import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';
import sendApiRequest from './lib/send-api-request';

export default class RPCSiftView extends SiftView {
  constructor() {
    super(); // initializes the SiftView base class

    this._userAccountId = null;
    this._apiToken = null;
    this._apiBaseUrl = null;
    this._brandHeaderPrefix = null;
    this._settings = null;

    this.controller.subscribe('settingsUpdate', this._onSettingsUpdate.bind(this));    
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  async presentView({ data }) {
    console.log('[rpc-sift|view] loadView | data:', data);

    if (!this._userAccountId) {
      const { rpcApiConfig } = data;
      const { apiToken, baseUrl, brandHeaderPrefix, userAccountId } = rpcApiConfig;

      this._userAccountId = userAccountId;
      this._apiToken = apiToken;
      this._apiBaseUrl = baseUrl;
      this._brandHeaderPrefix = brandHeaderPrefix;
    }

    document.getElementById('apiBaseUrl').textContent = this._apiBaseUrl;
    document.getElementById('brandHeaderPrefix').textContent = this._brandHeaderPrefix;
    document.getElementById('userAccountId').textContent = this._userAccountId;

    try {
      const response = await this._getDataFromAPI({
        repeatMe: 'A warm welcome from your Sift API!'
      });

      console.log('[rpc-sift] API response:', response);

      document.getElementById('apiResult').textContent = response;
    } catch(err) {
      console.error('[rpc-sift] API error:', err);

      document.getElementById('apiResult').textContent = err.message;
    }
  };

  async _getDataFromAPI({ repeatMe }) {
    const { response } = await sendApiRequest({
      userAccountId: this._userAccountId,
      apiToken: this._apiToken,
      apiBaseUrl: this._apiBaseUrl,
      brandHeaderPrefix: this._brandHeaderPrefix,
      method: 'POST',
      path: '/echo',
      data: repeatMe,
    });

    return response;
  }

  _onSettingsUpdate(data) {
    console.log('[SiftView::_onSettingsUpdate] data:', data);

    this._settings = data;

    document.getElementById('apiBaseUrl').textContent = JSON.stringify(this.settings);
  }
}

registerSiftView(new RPCSiftView(window));
