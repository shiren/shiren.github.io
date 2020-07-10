const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' });

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

async function createPostPage(graphql, actions) {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              categories
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug.replace(/\s/g, '-');
    const categories = node.frontmatter.categories;

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/post.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
        categoriesRegex: `/${categories.split(', ').join('|')}/g`,
      },
    });
  });
}

async function createPostListPage(graphql, actions) {
  const { createPage } = actions;
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  const posts = result.data.allMarkdownRemark.edges;
  const postsPerPage = 6;
  const numPages = Math.ceil(posts.length / postsPerPage);

  createPage({
    path: `/`,
    component: path.resolve('./src/templates/postListPage.tsx'),
    context: {
      limit: postsPerPage,
      skip: 0,
      numPages,
      currentPage: 1,
    },
  });
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: `/page${i + 1}`,
      component: path.resolve('./src/templates/postListPage.tsx'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
}

exports.createPages = async ({ graphql, actions }) => {
  await Promise.all([createPostPage(graphql, actions), createPostListPage(graphql, actions)]);
};
