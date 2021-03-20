import unified from 'unified';
import stream from 'unified-stream';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';

describe('unified test', async () => {
  it('basic', async () => {
    const processor = unified().use(markdown).use(remark2rehype).use(html);

    console.log(String(await processor.process('# Hello World')));
  });
});
