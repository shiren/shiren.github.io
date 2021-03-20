import micromark from 'micromark';

xdescribe('micro mark', () => {
  it('hello world', async () => {
    const result = await micromark(`# Hello, micromark`);

    console.log(result);
  });
});
