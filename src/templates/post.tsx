import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';

import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Share from '../components/share';
import RecomendPost from '../components/recomendPost';

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
  const [recomendPost, setRecomendPost] = useState<RecomendPostData[]>([]);

  const post = data.markdownRemark;

  const foundedImageFromContentsOrNot = (post.html.match(/<img.*?src="(.*?)"/) || [])[1];

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

    const recomendPostCandidates = [...data.recomendPost.nodes, ...data.recentPost.nodes]
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

    recomendPostCandidates.splice(4, recomendPostCandidates.length - 4);

    setRecomendPost(recomendPostCandidates);
  }, [data, post, setRecomendPost]);

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
        <Article dangerouslySetInnerHTML={{ __html: html }} />
        <BuyMeACoffee
          onClick={sendShareGa}
          href="https://www.buymeacoffee.com/shiren"
          target="_blank"
        >
          <img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" />
        </BuyMeACoffee>
        <AD href="https://ui.toast.com" target="_blank">
          Why not?
          <br />
          <img src="/image/toastui.png" alt="TOAST UI" />
        </AD>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
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
  margin-top: 40px;
  text-align: center;

  & img {
    height: 51px;
    width: 217px;
  }
`;

const Headline = styled.header`
  position: relative;
  margin: 130px 0 40px;

  & > h1 {
    font-size: 50px;
  }

  & > p {
    margin: 0 0 10px;
    font-size: 18px;
    font-style: italic;
    color: #808080;
  }
`;

const Article = styled.article`
  margin-top: -86px;

  @media only screen and (max-width: 1080px) {
    margin-top: 0;
  }
`;

const AD = styled.a`
  display: block;
  width: 200px;
  margin: 10px auto 10px;
  color: #404040;
  text-decoration: none;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const CC = styled.p`
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
