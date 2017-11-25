  // TODO: integrate into sift-sdk-web!
  export default function sendApiRequest({
    userAccountId,
    apiToken,
    apiBaseUrl,
    brandHeaderPrefix,
    method,
    path,
    data = null,
    headers = [],
    contentType = 'application/json',
  }) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.addEventListener('load', () => {
        resolve({
          response: req.response,
          status: req.status,
        });
      });

      req.addEventListener('error', () => {
        reject({
          message: `Error accessing the API | method: ${method} | path: ${path} | status: ${req.status}`,
          status: req.status,
        });
      });

      req.open(method, `${apiBaseUrl}${path}`, true);

      req.setRequestHeader(`${brandHeaderPrefix}-Account`, userAccountId);
      req.setRequestHeader('Authorization', `Bearer ${apiToken}`);

      headers.forEach((header) => {
        req.setRequestHeader(header.key, header.value);
      });

      if (data) {
        req.setRequestHeader('Content-type', contentType);
      }

      const _data = data ? data : undefined;

      req.send(_data);
    });
  }