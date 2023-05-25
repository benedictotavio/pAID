export default () => ({
  port: process.env.PORT || 8080,
  logLevel: 'info',
  mongo_uri: process.env.MONGO_URI,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,
  smtp: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
  web_url: process.env.WEB_URL,
});
