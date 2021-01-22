import * as THREE from '/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry();

var texture = new THREE.TextureLoader().load( 'floorTexture.jpeg' );
const material = new THREE.MeshBasicMaterial({
    map: texture,
    wireframe: false
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


var animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    render();
};

function render() {
    renderer.render(scene, camera);
}

animate();