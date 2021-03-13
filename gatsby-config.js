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
    description: 'code for life, life for music',
    url: 'https://blog.shiren.dev',
    image: '/image/profile.jpg',
    email: 'shirenbeat@gmail.com',
    sns: {
      github: 'shiren',
      instagram: 'shiren',
      facebook: 'shirenbeat',
      twitter: '@shirenbeat',
    },
    menus: [
      { name: 'ABOUT ME', url: '/aboutme' },
      { name: 'SOUNDCLOUD', url: 'https://soundcloud.com/shiren' },
      {
        name: 'OPENSOURCES',
        children: [
          { name: 'TOAST UI', url: 'https://ui.toast.com' },
          { name: 'UPBO Emacs + Karma integration', url: 'https://github.com/shiren/upbo' },
          { name: 'Karma narrow reporter', url: 'https://github.com/shiren/karma-narrow-reporter' },
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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/pages/`,
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
    `gatsby-plugin-react-helmet`,
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
                site_url: url # 파일안에 link를 제대로 만들려면 필요하다.
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
                  filter: { frontmatter: { layout: { eq: "post" } } },
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
            link: 'https://blog.shiren.dev',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-59192630-1',
        pageTransitionDelay: 0,
        head: false,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'G-9LD1FTDX8D', // Google Analytics / GA
          'ca-pub-4811193197471582', // Google Ads / Adwords / AW
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        query: `
        {
          site {
            siteMetadata {
              url
            }
          }
          allSitePage {
            nodes {
              path
            }
          }
        }`,
        resolveSiteUrl: ({ site }) => {
          return site.siteMetadata.url;
        },
      },
    },
    {
      resolve: `@isamrish/gatsby-plugin-google-adsense`,
      options: {
        googleAdClientId: 'ca-pub-4811193197471582',
        head: true,
      },
    },
    {
      resolve: 'gatsby-disco-wrysium'
    }
  ],
};
