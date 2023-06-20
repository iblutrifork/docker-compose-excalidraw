const puppeteer = require( 'puppeteer' );
const fs = require( 'fs' ).promises;
const jsdom = require( "jsdom" );
const {JSDOM} = jsdom;
const util = require( 'util' );
const exec = util.promisify( require( 'child_process' ).exec );
const args = require( 'yargs' ).argv;
const spawn = require('child_process').spawn;
const path = require('path');

function sleep( ms ) {
    return new Promise( ( resolve ) => {
        setTimeout( resolve, ms );
    } );
}

( async () => {
    const reactServer = spawn('npm', ['run', 'serve'], {detached: true});
    await sleep( 1500 );
    
    const dockerComposePath = args['docker-compose-path'];
    const configFile = args['file'];
    const outputFile = args['out'];
    if (configFile === undefined || outputFile === undefined) {
        console.log('Usage:')
        console.log('--docker-compose-path=<path to docker compose files>')
        console.log('--file=<docker compose file.yaml>')
        console.log('--out=<output file.png>')
        console.log("Example: node crawler.js --docker-compose-path=../cheetah-example-processing/docker-compose --file=demo-job.yaml --out 1.png")
        return 1;
    }

    let out = '';
    if (dockerComposePath === undefined) {
        const {stdout} = await exec(`docker run --rm -e INPUT_PATH=${configFile} etolbakov/excalidocker:latest`);
        out = stdout;
    } else {
        const absoluteDockerComposePath = path.resolve(dockerComposePath);
        const {stdout} = await exec(`docker run --rm -v "${absoluteDockerComposePath}:/tmp/" -e INPUT_PATH=/tmp/${configFile} etolbakov/excalidocker:latest`);
        out = stdout;
    }
    const base64EncodedExcalidrawJson = Buffer.from(out).toString('base64');

    //initiate the browser 
    const browser = await puppeteer.launch({headless: "new"});

    //create a new in headless chrome 
    const page = await browser.newPage();

    //go to target website 
    await page.goto( 'http://localhost:47312/' + base64EncodedExcalidrawJson, {
        //wait for content to load 
        waitUntil: 'networkidle0',
    } );

    //get full page html 
    const html = await page.content();
    const dom = new JSDOM(html);
    const base64png = dom.window.document.querySelector('#root').textContent;
    const pngBytes = Buffer.from(base64png, 'base64');

    //store html content in the reactstorefront file 
    await fs.writeFile( outputFile, pngBytes );

    //close headless chrome 
    await browser.close();
    //shut down excalidraw react server
    reactServer.kill();
} )();