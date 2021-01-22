import * as THREE from '/build/three.module.js';
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


// Piso

const floorGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
floorGeometry.widthSegments = 2;
floorGeometry.heightSegments = 2;
const floorMaterial = new THREE.MeshBasicMaterial( {color: 0xff69b4, side: THREE.DoubleSide, wireframe: true} );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = Math.PI / 2;
floor.position.y = 0;
scene.add( floor );


// Techo

const ceilingGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
ceilingGeometry.widthSegments = 2;
ceilingGeometry.heightSegments = 2;
const ceilingMaterial = new THREE.MeshBasicMaterial( {color: 0xff69b4, side: THREE.DoubleSide, wireframe: true} );
const ceiling = new THREE.Mesh( ceilingGeometry, ceilingMaterial );
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 20;
scene.add( ceiling );



// Pared

var walls = []

for(var i = 0; i<4; i++){
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
    case 3:
        wall.rotation.x = 0;
        wall.rotation.z = Math.PI/2;
        wall.rotation.y = Math.PI ;
        wall.position.z = -50;
        break;
}
walls[i] = wall;
scene.add( walls[i] );
}

// LUZ
var spot1 = new THREE.SpotLight(0xfafafa);
spot1.position.set(20, 50, 30);
scene.add(spot1);

var animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    render();
    stats.update();
};


function render() {
    renderer.render(scene, camera);
}

animate();

