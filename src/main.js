const hilbert = require('./util/hilbert.js');

let container;
let camera, scene, raycaster, renderer, blocks = [];
let mouse = new THREE.Vector2(), INTERSECTED;

const GRID_SIZE = 32;
const GRID_DIVISIONS = GRID_SIZE/4;
const GRID_POW = Math.pow(GRID_SIZE, 2);

let radius = GRID_SIZE*2, theta = 0;
let frustumSize = GRID_SIZE*1.25;

window.addEventListener('DOMContentLoaded', ()=>{
    init();
    animate();
});

function init() {
    container = document.body;

    const aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );

    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0xf0f0f0 );

    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0.5, 1, 0.5 ).normalize();
    scene.add( light );

    const gridHelper = new THREE.GridHelper( GRID_SIZE, GRID_DIVISIONS );
    scene.add( gridHelper );

    const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    for (let i = 0; i < GRID_POW; i++) {

        const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: new THREE.Color(`hsl(${(i/GRID_POW)*360}, 100%, 50%)`) } ) );
        const position = hilbert.dToXY(i);

        object.position.x = position[0] - GRID_SIZE/2 + 0.5;
        object.position.y = 0;
        object.position.z = position[1] - GRID_SIZE/2 + 0.5;

        //object.rotation.x = Math.random() * 2 * Math.PI;
        //object.rotation.y = Math.random() * 2 * Math.PI;
        //object.rotation.z = Math.random() * 2 * Math.PI;
        object.scale.y = (i/GRID_POW)*(GRID_SIZE/5) + 1;

        scene.add( object );
        blocks.push(object);
    }

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    let aspect = window.innerWidth / window.innerHeight;
    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}

let lastFrame = Date.now();
function render() {
    const ts = Math.min(1, Math.max(1, Date.now() - lastFrame)/1000);
    lastFrame = Date.now();
    theta += 5*ts;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( 90 ) );
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    camera.lookAt( scene.position );
    camera.updateMatrixWorld();
    // find intersections

    raycaster.setFromCamera( mouse, camera );
    let intersects = raycaster.intersectObjects( blocks );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
    } else {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }

    renderer.render( scene, camera );
}
