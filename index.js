const core = require( '@actions/core' );
const github = require( '@actions/github' );

try {
    const dockerComposePath = core.getInput('docker-compose-directory');
    const configFile = core.getInput('input-file');
    const outputFile = core.getInput('output-file');
    console.log( `Hello ${dockerComposePath}!` );
} catch ( error ) {
    core.setFailed( error.message );
}
