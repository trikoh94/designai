exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'",
      'Referrer-Policy': 'no-referrer',
    },
    body: JSON.stringify({ message: 'Hello from serverless function!' }),
  };
};
