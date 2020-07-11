/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    ownerName: 'Sungho Kim',
    ownerNickname: 'shiren',
    title: `shiren the creator`,
    titleTemplate: '%s · shiren the creator',
    description: 'programmer & beatmaker',
    url: 'https://blog.shiren.dev',
    image: '/assets/image/profile.jpg',
    email: 'shirenbeat@gmail.com',
    sns: {
      github: 'shiren',
      instagram: 'shiren',
      facebook: 'shirenbeat',
      twitter: '@shirenbeat',
    },
    menus: [
      { name: 'ABOUT ME', url: '/about' },
      { name: 'SOUNDCLOUD', url: 'https://soundcloud.com/shiren' },
      {
        name: 'OPENSOURCES',
        children: [{ name: 'TOAST UI Editor', url: 'https://github.com/nhn/tui.editor' }],
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        gfm: true,
        plugins: [{ resolve: `gatsby-remark-prismjs` }],
      },
    },
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
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                url
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.url + encodeURI(edge.node.fields.slug.replace(/\s/g, '-')),
                  guid:
                    site.siteMetadata.url + encodeURI(edge.node.fields.slug.replace(/\s/g, '-')),
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt(truncate: true, pruneLength: 300)
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/feed.xml',
            title: 'shiren.dev RSS Feed',
          },
        ],
      },
    },
  ],
};
