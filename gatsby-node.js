const path = require(`path`);
const {createFilePath} = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({node, getNode, actions}) => {
  const {createNodeField} = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({node, getNode, basePath: 'pages'});

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

async function createPostPage(graphql, actions) {
  const {createPage} = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/post.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    });
  });
}

async function createPostListPage(graphql, actions) {
  const {createPage} = actions;
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: {fields: [frontmatter___date], order: DESC}
          limit: 1000
        ) {
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
  Array.from({length: numPages}).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/post/` : `/post/${i + 1}`,
      component: path.resolve('./src/templates/postList.tsx'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
}

exports.createPages = async ({graphql, actions}) => {
  await Promise.all([
    createPostPage(graphql, actions),
    createPostListPage(graphql, actions),
  ]);
};
