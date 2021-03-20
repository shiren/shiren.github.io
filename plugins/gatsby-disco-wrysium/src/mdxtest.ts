import mdx from '@mdx-js/mdx';

const result = mdx(`# Hello, MDX`).then((res) => {
  console.log('123', res);
});

console.log(result);
