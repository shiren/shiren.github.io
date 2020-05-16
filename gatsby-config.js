/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `shiren the creator`,
    titleTemplate: '%s · shiren the creator',
    description: 'programmer & beatmaker',
    url: 'https://blog.shiren.dev',
    image: '/assets/image/profile.jpg',
    twitterUsername: '@shirenbeat',
    menus: [
      {name: 'ABOUT ME', url: '/about'},
      {name: 'SOUNDCLOUD', url: 'https://soundcloud.com/shiren'},
      {
        name: 'OPENSOURCES',
        children: [
          {name: 'TOAST UI Editor', url: 'https://github.com/nhn/tui.editor'},
        ],
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/posts/`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/assets/`,
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        // isTSX: true,
        // jsxPragma: `jsx`,
        // allExtensions: true,
      },
    },
  ],
};
