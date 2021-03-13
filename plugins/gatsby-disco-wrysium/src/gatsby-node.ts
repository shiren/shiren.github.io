import { GatsbyNode } from 'gatsby';

function testTs(tt: string) {
  return `${tt} hello`;
}

export const onPostBuild: GatsbyNode['onPostBuild'] = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built222`);
};

export const createPages: GatsbyNode['createPages'] = async () => {
  console.log(testTs('12222222222222222222222222222222222222212312312312'));
};
