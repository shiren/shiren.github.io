const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const POST_PER_PAGE = 6;

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

async function createSubPage(graphql, actions) {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark(filter: { frontmatter: { layout: { eq: "page" } } }) {
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

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug.replace(/\s/g, '-');

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/page.tsx`),
      context: {
        slug: node.fields.slug,
      },
    });
  });
}

async function createPostPage(graphql, actions) {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark(filter: { frontmatter: { layout: { eq: "post" } } }) {
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
        allMarkdownRemark(
          filter: { frontmatter: { layout: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
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
    `
  );

  const posts = result.data.allMarkdownRemark.edges;
  const numPages = Math.ceil(posts.length / POST_PER_PAGE);

  createPage({
    path: `/`,
    component: path.resolve('./src/templates/postListPage.tsx'),
    context: {
      limit: POST_PER_PAGE,
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
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        numPages,
        currentPage: i + 1,
      },
    });
  });
}

async function createPostListByTag(graphql, actions) {
  const { createPage } = actions;
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { frontmatter: { layout: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
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
    `
  );

  const posts = result.data.allMarkdownRemark.edges;

  const categoriesCount = posts.reduce((res, post) => {
    post.node.frontmatter.categories.split(', ').forEach((category) => {
      res[category] = res[category] ? res[category] + 1 : 1;
    });

    return res;
  }, {});

  Object.keys(categoriesCount).forEach((category) => {
    const numPages = Math.ceil(categoriesCount[category] / POST_PER_PAGE);

    Array.from({ length: numPages }).forEach((_, i) => {
      const currentPage = i + 1;

      createPage({
        path: `/${category}/${currentPage}`,
        component: path.resolve('./src/templates/postListPageByTag.tsx'),
        context: {
          category,
          categoryRegex: `/${category}/`,
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numPages,
          currentPage,
        },
      });
    });
  });
}

exports.createPages = async ({ graphql, actions }) => {
  await Promise.all([
    createPostPage(graphql, actions),
    createPostListPage(graphql, actions),
    createSubPage(graphql, actions),
    createPostListByTag(graphql, actions),
  ]);
};
