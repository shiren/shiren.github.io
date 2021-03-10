function testTs(tt: string) {
  return `${tt} hello`;
}

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};

exports.createPages = async () => {
  console.log(testTs('122222222222222222222222222222222222222'));
};
