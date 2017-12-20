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
    this._google = null;

    this.controller.subscribe('settingsUpdate', this._onSettingsUpdate.bind(this));
    this.controller.subscribe('googleUpdate', this._onGoogleUpdate.bind(this));
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
        repeatMe: 'A warm welcome from your Sift API!',
      });

      console.log('[rpc-sift] API response:', response);

      document.getElementById('apiResult').textContent = response;
    } catch(err) {
      console.error('[rpc-sift] API error:', err);

      document.getElementById('apiResult').textContent = err.message;
    }

    document.getElementById('update').onclick = async () => {
      const response = await this._getDataFromAPI({
        repeatMe: 'Updated settings!',
      });

      document.getElementById('apiResult').textContent = response;
    };
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

    document.getElementById('settings').textContent =
      this._settings ? JSON.stringify(this._settings) : 'No settings';
  }

  _onGoogleUpdate(data) {
    console.log('[SiftView::_onGoogleUpdate] data:', data);

    this._google = data;

    document.getElementById('google').textContent =
      this._google ? JSON.stringify(this._google) : 'No settings';
  }
}

registerSiftView(new RPCSiftView(window));
