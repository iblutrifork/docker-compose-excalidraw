const core = require( '@actions/core' );
const github = require( '@actions/github' );
const {generatePng} = require( './crawler' );
const spawn = require( 'child_process' ).spawn;

const run = async function() {
    const dockerComposePath = core.getInput( 'docker-compose-directory' );
    const configFile = core.getInput( 'input-file' );
    const outputFile = core.getInput( 'output-file' );
    await generatePng( dockerComposePath, configFile, outputFile, '/opt/hostedtoolcache/chromium/latest/x64/chrome' );
    console.log( 'Success' );
}

try {
    run();
} catch ( error ) {
    core.setFailed( error.message );
}
