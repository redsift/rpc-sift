/**
 * RPC Demo Sift. DAG's 'Node1' node implementation
 */

'use strict';

//
// Entry point for DAG node
//
// got = {
//   in: ... // contains the key/value pairs that match the given query
//   with: ... // key/value pairs selected based on the with selection
//   lookup: ... // an array with result of lookup for a specific key
//   query: ... // an array containing the key hierarchy
// }
//
// For more info have a look at:
// http://docs.redsift.com/docs/server-code-implementation
//
module.exports = function (got) {
  const {
    in: inData,
    lookup: inLookup,
  } = got;

  //
  // Debug output for lookup data:
  //
  inLookup.forEach(item => {
    const { data } = item;
    console.log('[rpc-sift|rpc.js] lookup key:', data.key);

    if (data.value) {
      console.log('[rpc-sift|rpc.js] lookup value:', data.value.toString());
    }
  });

  const outData = [];

  //
  // Collect output data for 'api_rpc' store:
  //
  for (const item of inData.data) {
    const { key, value } = item;

    if (value) {
      try {
        const req = JSON.parse(item.value);
        const { header, body } = req;

        outData.push({
          name: 'api_rpc',
          key,
          value: {
            status_code: 200,
            header,
            body,
          }
        });
      } catch (err) {
        console.error(`[rpc-sift|rpc.js] Error parsing value | key: ${key} | err:`, err);
        continue;
      }
    }
  }

  //
  // Collect output data for 'settings' export bucket:
  //
  const settings = inLookup[2].data.value ?
    JSON.parse(inLookup[2].data.value) :
    null;

  console.log('[rpc-sift|rpc.js] settings:', JSON.stringify(settings, null, 4));

  outData.push({
      name: 'settings',
      key: 'user',
      value: settings,
  });

  return outData;
};
