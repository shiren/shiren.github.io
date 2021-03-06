import React, { useEffect } from 'react';
import { graphql } from 'gatsby';

import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Share from '../components/share';
import RecomendPost from '../components/recomendPost';
import PostImage from '../components/postImage';

import { trackCustomEvent } from 'gatsby-plugin-google-analytics';

type Props = {
  data: {
    markdownRemark: {
      html: string;
      excerpt: string;
      frontmatter: {
        title: string;
        date: string;
        categories: string;
        image: string;
        imageAuthor: string;
        imageAuthorLink: string;
        imageFrom: string;
        imageFromLink: string;
      };
      fields: {
        slug: string;
      };
    };
    recomendPost: {
      nodes: Array<{
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          categories: string;
          date: string;
        };
        excerpt: string;
      }>;
    };
    recentPost: {
      nodes: Array<{
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          categories: string;
          date: string;
        };
        excerpt: string;
      }>;
    };
  };
};

type RecomendPostData = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories: string[];
};

const addAdsenseToHtml = (html: string): string => {
  let pCount = 0;
  let adCount = 0;

  const adHTML =
    '<ins class="adsbygoogle" style="display: block;text-align: center" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-4811193197471582" data-ad-slot="7153541064"></ins>';

  return html
    .split('\n')
    .map((item) => {
      if (/^<p>/g.test(item)) {
        pCount += 1;
      }

      if (pCount === 3 && adCount < 1) {
        adCount += 1;

        return `${item}${adHTML}`;
      }

      return item;
    })
    .join('\n');
};

const Post: React.FC<Props> = ({ data }) => {
  const post = data.markdownRemark;

  const foundedImageFromContentsOrNot =
    post.frontmatter.image ?? (post.html.match(/<img.*?src="(.*?)"/) || [])[1];

  const sendShareGa = () => {
    trackCustomEvent({
      category: 'BuyMeACoffee',
      action: 'click',
    });

    typeof window !== 'undefined' &&
      (window as any).gtag('event', 'click', {
        event_category: 'BuyMeACoffee', // eslint-disable-line camelcase
      });
  };

  const html = addAdsenseToHtml(post.html);

  useEffect(() => {
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];

    let adLength = document.querySelectorAll('.adsbygoogle[data-ad-slot]').length;

    while (adLength > 0) {
      (window as any).adsbygoogle.push({});
      adLength -= 1;
    }
  }, [data, post]);

  const recomendPost: RecomendPostData[] = [...data.recomendPost.nodes, ...data.recentPost.nodes]
    .map<RecomendPostData>((node) => ({
      title: node.frontmatter.title,
      slug: node.fields.slug,
      excerpt: node.excerpt,
      date: node.frontmatter.date,
      categories: node.frontmatter.categories.split(', '),
    }))
    .filter((node) => node.slug !== post.fields.slug)
    .reduce<RecomendPostData[]>(
      (unique, node) =>
        unique.find((unode) => unode.slug === node.slug) ? unique : [...unique, node],
      []
    )
    .sort((node) => (node.categories.includes('translation') ? 1 : Math.random() * 2 - 1));

  recomendPost.splice(4, recomendPost.length - 4);

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        article={true}
        image={foundedImageFromContentsOrNot}
        date={post.frontmatter.date}
      />
      <Layout indicator={true}>
        <Headline>
          <h1>{post.frontmatter.title}</h1>
          <p>Posted on {post.frontmatter.date} </p>
        </Headline>
        <Share
          title={post.frontmatter.title}
          path={post.fields.slug}
          tags={post.frontmatter.categories.split(', ')}
        />
        {post.frontmatter.image ? (
          <PostImage
            image={post.frontmatter.image}
            imageAuthor={post.frontmatter.imageAuthor}
            imageAuthorLink={post.frontmatter.imageAuthorLink}
            imageFrom={post.frontmatter.imageFrom}
            imageFromLink={post.frontmatter.imageFromLink}
          />
        ) : null}
        <Article
          hasImage={typeof post.frontmatter.image === 'string'}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <BuyMeACoffee
          onClick={sendShareGa}
          href="https://www.buymeacoffee.com/shiren"
          target="_blank"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
            alt="Buy Me A Coffee"
          />
        </BuyMeACoffee>
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center',
            // width: 650,
            // height: 163,
            // border: '1px solid red',
          }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-4811193197471582"
          data-ad-slot="7153541064"
        />
        <CC>
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
            <img
              alt="크리에이티브 커먼즈 라이선스"
              style={{ borderWidth: 0 }}
              src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
            />
          </a>
          이 저작물은{' '}
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">
            크리에이티브 커먼즈 저작자표시-비영리-변경금지 4.0 국제 라이선스
          </a>
          에 따라 이용할 수 있습니다.
        </CC>
        {recomendPost.length ? <RecomendPost posts={recomendPost} /> : null}
      </Layout>
    </>
  );
};

const BuyMeACoffee = styled.a`
  display: block;
  margin: 40px 0 20px;
  text-align: center;

  & img {
    height: 60px;
    width: 217px;
  }
`;

const Headline = styled.header`
  position: relative;
  margin: 0 0 40px;

  & > h1 {
    font-size: 50px;
  }

  & > p {
    margin: 0 0 10px;
    font-size: 18px;
    font-style: italic;
    color: #808080;
  }
  
  @media only screen and (max-width: 460px) {
    & > p {
      font-size: 12px;
    }
`;

const Article = styled.article<{ hasImage: boolean }>`
  margin-top: ${(props) => (props.hasImage ? 0 : `-86px`)};

  @media only screen and (max-width: 1080px) {
    margin-top: 0;
  }
`;

const CC = styled.p`
  padding-top: 30px;
  font-size: 13px;
  line-height: 1;

  & > a:first-child {
    float: left;
    margin-right: 10px;
    vertical-align: middle;
  }
`;

export default Post;

export const query = graphql`
  query($slug: String!, $categoriesRegex: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      excerpt(truncate: true, pruneLength: 300)
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
        categories
        image
        imageAuthor
        imageAuthorLink
        imageFromLink
        imageFrom
      }
    }
    recomendPost: allMarkdownRemark(
      filter: {
        frontmatter: { categories: { regex: $categoriesRegex }, layout: { eq: "post" } }
        fields: { slug: { ne: $slug } }
      }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 4
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          categories
          date(formatString: "DD MMMM, YYYY")
        }
        excerpt(truncate: true, pruneLength: 300)
      }
    }
    recentPost: allMarkdownRemark(
      filter: { frontmatter: { layout: { eq: "post" } } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 6
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          categories
          date(formatString: "DD MMMM, YYYY")
        }
        excerpt(truncate: true, pruneLength: 300)
      }
    }
  }
`;
