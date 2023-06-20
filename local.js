const {generatePng} = require( './crawler' );
const args = require( 'yargs' ).argv;

( async () => {
    const dockerComposePath = args['docker-compose-path'];
    const configFile = args['file'];
    const outputFile = args['out'];
    generatePng(dockerComposePath, configFile, outputFile);
} )();
