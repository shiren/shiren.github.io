import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';

describe('unified test', () => {
  it('basic', async () => {
    const processor = unified().use(markdown).use(remark2rehype).use(html);
  });

  it('mark down parse', async () => {
    const processor = unified().use(markdown);
    const result = await processor.parse('# hello world');
  });

  it('plugin', async () => {
    function myplugin() {
      this.Parser = parse;

      function parse(doc) {
        console.log('doc', doc);
      }
    }

    const processor = unified().use(myplugin);
    const result = await processor.parse('# hello world');
  });
});
