const core = require( '@actions/core' );
const github = require( '@actions/github' );
const {generatePng} = require( './crawler' );

try {
    const dockerComposePath = core.getInput('docker-compose-directory');
    const configFile = core.getInput('input-file');
    const outputFile = core.getInput('output-file');
    generatePng(dockerComposePath, configFile, outputFile);
    console.log('Success');
} catch ( error ) {
    core.setFailed( error.message );
}
