export default () => ({
  port: process.env.PORT || 3030,
  mongo_uri: process.env.MONGO_URI,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,
  web_url: process.env.WEB_URL,
  smtp: {
    service: 'gmail',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
  },
  time: {
    fixed_time: process.env.FIXED_TIME_TRADE,
  },
});


