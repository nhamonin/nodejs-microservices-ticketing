export const getServerHeaders = () => {
  if (typeof window === 'undefined') {
    const { headers } = require('next/headers');
    const headerObj = {};
    const serverHeadersInstance = headers();
    serverHeadersInstance.forEach((value, key) => {
      headerObj[key] = value;
    });
    return headerObj;
  }
  return {};
};
