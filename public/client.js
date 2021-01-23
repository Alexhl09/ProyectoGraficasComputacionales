import * as THREE from '/build/three.module.js';
import { RectAreaLightHelper } from '/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '/jsm/lights/RectAreaLightUniformsLib.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 17;
camera.position.y = 12;
camera.position.z = 13;
camera.position.z = 13;
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

RectAreaLightUniformsLib.init();
const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);

const stats = Stats();
document.body.appendChild(stats.dom);



const geometry = new THREE.BoxGeometry();
var texture = new THREE.TextureLoader().load( 'floorTexture.jpeg' );
const material = new THREE.MeshLambertMaterial({
    map: texture,
    wireframe: false
});
const cube = new THREE.Mesh(geometry, material);
cube.receiveShadow = true;
scene.add(cube);

const exterior = new THREE.Object3D();


// Piso

const floorGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
floorGeometry.widthSegments = 2;
floorGeometry.heightSegments = 2;
const floorMaterial = new THREE.MeshBasicMaterial( {color: 0xff69b4, side: THREE.DoubleSide, wireframe: true} );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = Math.PI / 2;
floor.position.y = 0;
exterior.add( floor );


// Techo

const ceilingGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
ceilingGeometry.widthSegments = 2;
ceilingGeometry.heightSegments = 2;
const ceilingMaterial = new THREE.MeshBasicMaterial( {color: 0xff69b4, side: THREE.DoubleSide, wireframe: true} );
const ceiling = new THREE.Mesh( ceilingGeometry, ceilingMaterial );
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 20;
exterior.add( ceiling );



// Pared

var walls = []

for(var i = 0; i<3; i++){
const wallGeometry = new THREE.PlaneGeometry( 20, 100, 32 );
wallGeometry.widthSegments = 2;
wallGeometry.heightSegments = 2;
const wallMaterial = new THREE.MeshBasicMaterial( {color: 0xff69b4, side: THREE.DoubleSide, wireframe: true} );
const wall = new THREE.Mesh( wallGeometry, wallMaterial );
wall.rotation.x = Math.PI / 2;
wall.rotation.y = Math.PI / 2;
wall.position.y = 10;
wall.position.z = 0;

switch(i){
    case 0:
        wall.position.x = 50;
        break;
     case 1:
        wall.position.x = -50;
         break;
    case 2:
        wall.rotation.x = 0;
        wall.rotation.z = Math.PI/2;
        wall.rotation.y = Math.PI ;
        wall.position.z = 50;
        break;
}
walls[i] = wall;
exterior.add( walls[i] );
}

// LUZ
var spot1 = new THREE.SpotLight(0xfafafa);
spot1.position.set(20, 50, 30);
exterior.add(spot1);

var animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    render();
    stats.update();
};


// Ventanas izquierdas

var windowsLeft = []

for(var i = 0; i<2; i++){
const windowGeometry = new THREE.PlaneGeometry( 20, 20, 32 );
windowGeometry.widthSegments = 2;
windowGeometry.heightSegments = 2;
const windowGMaterial = new THREE.MeshBasicMaterial( {color: 0xb569ff, side: THREE.DoubleSide, wireframe: true} );
const windowObject = new THREE.Mesh( windowGeometry, windowGMaterial );
windowObject.rotation.x = Math.PI;
windowObject.rotation.y = Math.PI;
windowObject.rotation.z = Math.PI / 2;
windowObject.position.y = 10;
windowObject.position.x = -40 + (20 * i);
windowObject.position.z = -50;
windowsLeft[i] = windowObject;
exterior.add( windowsLeft[i] );
}


// Ventanas izquierdas

var windowsRight = []

for(var i = 0; i<2; i++){
const windowGeometry = new THREE.PlaneGeometry( 20, 20, 32 );
windowGeometry.widthSegments = 2;
windowGeometry.heightSegments = 2;
const windowGMaterial = new THREE.MeshBasicMaterial( {color: 0xb569ff, side: THREE.DoubleSide, wireframe: true} );
const windowObject = new THREE.Mesh( windowGeometry, windowGMaterial );
windowObject.rotation.x = Math.PI;
windowObject.rotation.y = Math.PI;
windowObject.rotation.z = Math.PI / 2;
windowObject.position.y = 10;
windowObject.position.x = 40 - (20 * i);
windowObject.position.z = -50;
windowsRight[i] = windowObject;
exterior.add( windowsRight[i] );
}

// Ventanas arriba donde esta logo

const windowUpGeometry = new THREE.PlaneGeometry( 8, 20, 10 );
windowUpGeometry.widthSegments = 2;
windowUpGeometry.heightSegments = 2;
const windowUpGaterial = new THREE.MeshBasicMaterial( {color: 0xb569ff, side: THREE.DoubleSide, wireframe: true} );
const windowUpObject = new THREE.Mesh( windowUpGeometry, windowUpGaterial );
windowUpObject.rotation.x = Math.PI;
windowUpObject.rotation.y = Math.PI;
windowUpObject.rotation.z = Math.PI / 2;
windowUpObject.position.y = 16;
windowUpObject.position.x = 0;
windowUpObject.position.z = -50;
exterior.add( windowUpObject);

// Pantallas izquierdas

var screens = []

for(var i = 0; i<2; i++){
const screenGeometry = new THREE.PlaneGeometry( 80, 8, 48 );
screenGeometry.widthSegments = 2;
screenGeometry.heightSegments = 2;
const screenMaterial = new THREE.MeshBasicMaterial( {color: 0xbaffaa, side: THREE.DoubleSide, wireframe: true} );
const screenObject = new THREE.Mesh( screenGeometry, screenMaterial );
screenObject.rotation.x = Math.PI;
screenObject.rotation.y = Math.PI/2;
screenObject.position.y = 10;
screenObject.position.x = -50 + (i*100);
screenObject.position.z = 0;
screens[i] = screenObject;
exterior.add( screens[i] );
}




// Lamparas techo

var lamparas = []
for(var i = 0; i< 5; i++){
for(var j = 0;j <5;j++){
    const width = 10;
const height = 10;
const intensity = 1;
const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
rectLight.position.set( 30, 20, -40 );
rectLight.rotation.x = Math.PI/2;
rectLight.position.z += j * 20;
rectLight.position.x -= i * 20;
rectLight.rotation.y = Math.PI;
lamparas[i] = rectLight;
exterior.add( lamparas[i] )

const rectLightHelper = new RectAreaLightHelper( rectLight );
rectLight.add( rectLightHelper );
}
}




scene.add(exterior);
function render() {
    renderer.render(scene, camera);
}

animate();

