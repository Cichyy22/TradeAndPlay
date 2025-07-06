module.exports = {
  siteUrl: 'https://trade-and-play.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/user', '/api/'],
      },
    ],
  },
};