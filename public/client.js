/**
 Proyecto de la clase de graficas computacionales del periodo intensivo de invierno 2021.
 Hecho por Alejandro Hernandez Lopez y Yulisa Medina Maldonado

 El proyecto esta realizado con THREE.JS y con algunos modelos obtenidos de internet, a excepcion del logo de Apple en la entrada.
 Ese fue creado con Blender para el proyecto.

 Modelo del iMac de la pagina:
 https://www.modelplusmodel.com/tech/electronics/f18-desktop-computer.html

 Modelo del Macbook Pro de la pagina:
 https://www.modelplusmodel.com/tech/electronics/apple-macbook-pro-15.html

 Modelo del iPad de la pagina:
 https://www.modelplusmodel.com/tech/electronics/apple-ipad-2.html

 Modelo del iPhone de la pagina:
 https://www.modelplusmodel.com/tech/electronics/f10-phone.html

 Texturas obtenidas de:
 whiteFloor:
 https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fphoto_50552654_white-laminate-parquet-floor-texture-background.html&psig=AOvVaw2DZEDpVeRv4HInabEoC6uO&ust=1612213113655000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJidwP-Hx-4CFQAAAAAdAAAAABAD

 floorTexture:
 https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.sheridanseating.com%2Fbasketball-floor-texture%2F&psig=AOvVaw28WVxk76Zq1BC4X9JwzNuU&ust=1612213137947000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIi8y4uIx-4CFQAAAAAdAAAAABAD

 silver:
 https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.myfreetextures.com%2Fgreat-silver-brushed-metal-texture-background%2F&psig=AOvVaw0D4uVjo4J_dprWKPbou9vk&ust=1612213163805000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMCwgJqIx-4CFQAAAAAdAAAAABAD

 banner:
 https://www.google.com/url?sa=i&url=https%3A%2F%2Fsupport.apple.com%2Fes-es%2Fapps&psig=AOvVaw2D2RsmrUxbkCFMAqSf06i_&ust=1612213211981000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPCdwq6Ix-4CFQAAAAAdAAAAABAD

 apple:
 https://www.google.com/url?sa=i&url=https%3A%2F%2Ffondos.wallpaperstock.net%2Fsimple-white-de-apple-wallpapers_w44562.html&psig=AOvVaw2TQOzNRWf2HUO4gJbMiQ8V&ust=1612213286783000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOC599aIx-4CFQAAAAAdAAAAABAD

 */


import * as THREE from '/build/three.module.js';
  
import { RectAreaLightHelper } from '/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '/jsm/lights/RectAreaLightUniformsLib.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import {FirstPersonControls} from '/jsm/controls/FirstPersonControls.js';
import Stats from '/jsm/libs/stats.module.js';
import {OBJLoader} from '/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = -80;
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//renderer.shadowMap.enabled = true;
RectAreaLightUniformsLib.init();

const stats = Stats();
document.body.appendChild(stats.dom);
const exterior = new THREE.Object3D();
var clock = new THREE.Clock();


// Apple Logo
var appleLogo;
var appleLogoAnim;
var emission = [0xffffff, 0x7d7d7d, 0x000000];

// Para la animacion de cambiar el glow de logo en el render
function update(){
	// console.log("Actualizando logo");
	var delta = clock.getDelta();
	appleLogoAnim.update( 1000 * delta );
}

function EmissionAnimation(object, emission, numEm, emDuration){
	this.emDisplayDuration = emDuration;
	this.currentDisplayTime = 0;
	this.currentEm = 0;
	this.numberOfEm = numEm;

	this.update = function( milliSec ){
		// console.log("TIEMPO " , this.currentDisplayTime);
		this.currentDisplayTime += milliSec;
		
		while( this.currentDisplayTime > this.emDisplayDuration ){
			this.currentDisplayTime -= this.emDisplayDuration;
			this.currentEm++;
			object.material.emissive = new THREE.Color( emission[this.currentEm] );
			console.log(object.material.emissive);
			
			if ( this.currentEm == this.numberOfEm){
				this.currentEm = 0;
			}
		}
	};
}

const loader = new GLTFLoader();

loader.load( '/models/apple_logo/apple_logo.glb', function ( gltf ) {

	appleLogo = gltf.scene;

    appleLogo.rotation.x = -Math.PI / 2;
    appleLogo.rotation.y = Math.PI / 2;

    // Centrando modelo en la entrada
   	appleLogo.position.x = -0.5;
    appleLogo.position.y = 15;
    appleLogo.position.z = -50;

    // Agregando valor emissive incial para la animacion (para que parezca que emite luz)
	appleLogo.traverse( function( object ){
		if (( object instanceof THREE.Mesh)){
			object.material.emissive = new THREE.Color( emission[0] );
			object.material.emissive.Intensity = 1.5;
			appleLogoAnim = new EmissionAnimation(object, emission, 3, 1000);
		}
	});


    scene.add( appleLogo );

}, undefined, function ( error ) {
    console.log("Error cargando logo");
    console.error( error );

} );



// Piso

const floorGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
floorGeometry.widthSegments = 2;
floorGeometry.heightSegments = 2;
var floorTexture = new THREE.TextureLoader().load( 'textures/whiteFloor.jpg' );
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(8,8);
const floorMaterial = new THREE.MeshBasicMaterial( {map: floorTexture, wireframe: false} );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = Math.PI/2;
floor.rotation.y = Math.PI;
floor.position.y = 0;
floor.receiveShadow = true;
exterior.add( floor );


// Techo

const ceilingGeometry = new THREE.PlaneGeometry( 100, 100, 32 );
ceilingGeometry.widthSegments = 2;
ceilingGeometry.heightSegments = 2;
var ceilingTexture = new THREE.TextureLoader().load( 'textures/silver.jpg' );
ceilingTexture.wrapS = THREE.RepeatWrapping;
ceilingTexture.wrapT = THREE.RepeatWrapping;
ceilingTexture.repeat.set(10,4);
const ceilingMaterial = new THREE.MeshBasicMaterial( {map: ceilingTexture, side: THREE.DoubleSide, wireframe: false} );
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
var wallTexture = new THREE.TextureLoader().load( 'textures/silver.jpg' );
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(10,4);
const wallMaterial = new THREE.MeshBasicMaterial( {map: wallTexture, side: THREE.DoubleSide, wireframe: false} );
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
// var spot1 = new THREE.SpotLight(0xfafafa);
// spot1.position.set(20, 50, 30);
// exterior.add(spot1);


// Ventanas izquierdas

var windowsLeft = []

for(var i = 0; i<2; i++){
const windowGeometry = new THREE.PlaneGeometry( 20, 20, 32 );
windowGeometry.widthSegments = 2;
windowGeometry.heightSegments = 2;
const windowGMaterial = new THREE.MeshBasicMaterial( {color: 0xe1ebe3, side: THREE.DoubleSide, wireframe: false, opacity: 0.2, transparent: true} );
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
const windowGMaterial = new THREE.MeshBasicMaterial( {color: 0xe1ebe3, side: THREE.DoubleSide, wireframe: false, opacity: 0.2, transparent: true} );
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
const windowUpGaterial = new THREE.MeshBasicMaterial( {color: 0xe1ebe3, side: THREE.DoubleSide, wireframe: false, opacity: 0.2, transparent: true} );
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
var texture = new THREE.TextureLoader().load( 'textures/banner.jpg' );
texture.repeat.set(2, 1);
const screenMaterial = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, wireframe: false} );
const screenObject = new THREE.Mesh( screenGeometry, screenMaterial );
screenObject.rotation.x = Math.PI;
screenObject.rotation.z =  Math.PI;
screenObject.rotation.y = (i % 2 == false) ? Math.PI/2 :  (Math.PI * 3)/2;
screenObject.position.y = 10;
screenObject.position.x = (i % 2 == false) ? -49.85 : 49.85
screenObject.position.z = 0;
screens[i] = screenObject;
exterior.add( screens[i] );
}


const backScreenGeometry = new THREE.PlaneGeometry( 30, 8, 10 );
backScreenGeometry.widthSegments = 2;
backScreenGeometry.heightSegments = 2;
var screenTexture = new THREE.TextureLoader().load( 'textures/apple.jpg' );
screenTexture.repeat.set(1.7,1);
const backScreenMaterial = new THREE.MeshBasicMaterial( {map: screenTexture, wireframe: false} );
const backScreen = new THREE.Mesh( backScreenGeometry, backScreenMaterial );
backScreen.rotation.x = Math.PI;
backScreen.rotation.y = Math.PI*2;
backScreen.rotation.z = Math.PI;
backScreen.position.y = 10;
backScreen.position.z = 49.8;
exterior.add( backScreen);




// Lamparas techo

var lamparas = []
for(var i = 0; i< 5; i++){
for(var j = 0;j <5;j++){
    const width = 10;
const height = 10;
const intensity = 1;
const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
rectLight.position.set( 40, 19.8, -40 );
rectLight.rotation.x = Math.PI/2;
rectLight.position.z += j * 20;
rectLight.position.x -= i * 20;
rectLight.rotation.y = Math.PI;
lamparas[i] = rectLight;
const light = new THREE.DirectionalLight( 0xFFffff, 0.05);
light.position.set( 40, 20, -40 )
light.position.z += j * 20;
light.position.x -= i * 20;
exterior.add( light );
light.castShadow = true;
exterior.add( lamparas[i] )

const rectLightHelper = new RectAreaLightHelper( rectLight );
rectLight.add( rectLightHelper );
}
}


// Mesa
var stant = [];
for(var i = 0; i < 2;i++){
    const geometry = new THREE.BoxGeometry(4, 1, 60, 8);
    var texture = new THREE.TextureLoader().load( 'textures/floorTexture.jpeg' );
    texture.repeat.set(1,30);
    const material = new THREE.MeshLambertMaterial({
    map : texture,
    wireframe: false
    });
    const tabla = new THREE.Mesh(geometry, material);
    tabla.castShadow = true;
    tabla.receiveShadow = true;
    tabla.position.y = 4;
    tabla.position.x = (i % 2 == true) ? 48 : -48;
    stant[i] = tabla;
    exterior.add(stant[i]);
}


// Mesa
const mesa = new THREE.Object3D();
const tableGeometry = new THREE.BoxGeometry(9, 1, 20, 8);
var tableTexture = new THREE.TextureLoader().load( 'textures/floorTexture.jpeg' );
const tableMaterial = new THREE.MeshLambertMaterial({
    map : tableTexture,
    wireframe: false
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.receiveShadow = true;
table.position.y = 4;
mesa.add(table);

var patasMesa = []
for(var i = 0; i < 4;i < i++){
    const pataGeometry = new THREE.BoxGeometry(1, 4, 1, 5);
    var tableTexture = new THREE.TextureLoader().load( 'textures/floorTexture.jpeg' );
    const pataMaterial = new THREE.MeshLambertMaterial({
        map : tableTexture,
        wireframe: false
    });
    const pata = new THREE.Mesh(pataGeometry, pataMaterial);
    pata.receiveShadow = true;
    pata.position.y = 2;
    pata.position.x += (i < 2) ? -4 : 4 
    pata.position.z = (i % 2 == true) ? 9.5 : -9.5
    patasMesa[i] = pata;
    mesa.add(patasMesa[i]);
}

var mesas = []
for(var i = -1; i < 2; i++){
    mesas[i] = [];
    for(var j = -1; j < 2; j++){
        var m = mesa.clone()
        m.position.set(i * 32, 0, j * 23)
        m.position.z -= 9
        mesas[i][j] = m
        scene.add(m);
    }
}

// Mesa principal
var mesaPrincipal = mesa.clone()
mesaPrincipal.position.set(0, 0,38)
mesaPrincipal.rotation.y = Math.PI/2
scene.add(mesaPrincipal);



// Computadoras mbp
var compuQueRota;
var computadoras = []
var mtlLoader = new MTLLoader();
mtlLoader.load('/models/mbp/mbp.mtl',function (materials){
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/models/mbp/mbp.obj', function(object){
        object.scale.set(0.01,0.01,0.01);
        for(var i = -1; i < 2; i++){
            computadoras[i] = [];
            for(var j = -2; j < 4; j++){
                var mbp = object.clone()
                mbp.position.set(i * 32, 0, j * 11)
                mbp.position.z -= 14
                mbp.position.x += 2
                mbp.position.y = 4.5
                mbp.rotation.y = Math.PI /2;
                computadoras[i][j] = mbp
                scene.add(mbp);
            }
        }
        compuQueRota = object.clone()
        compuQueRota.position.set(0, 4.5,38)
        scene.add(compuQueRota);
        //scene.add(object);
    })
})


// Computadoras mbp

var computadorasMac = []
var mtlLoader = new MTLLoader();
mtlLoader.load('/models/mac/mpm_f18__Apple_iMac_27.mtl',function (materials){
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/models/mac/mpm_f18__Apple_iMac_27.obj', function(object){
        object.scale.set(0.01,0.01,0.01);
        for(var i = -1; i < 2; i++){
            computadorasMac[i] = [];
            for(var j = -2; j < 4; j++){
                var mac = object.clone()
                mac.position.set(i * 32, 0, j * 11)
                mac.position.z -= 14
                mac.position.x -= 2
                mac.position.y = 4.5
                mac.rotation.y = Math.PI * 3.5;
                computadorasMac[i][j] = mac
                scene.add(mac);
            }
        }
   
    })
})



// Computadora que va a rotar


var iphones = []
var mtlLoader = new MTLLoader();
mtlLoader.load('/models/iphone/mpm_f10__Apple_iPhone_4.mtl',function (materials){
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/models/iphone/mpm_f10__Apple_iPhone_4.obj', function(object){
        object.scale.set(0.01,0.01,0.01);
        for(var i = -4; i < 5; i++){
            var phone = object.clone()
                phone.position.set(48, 4.5, 0)
                phone.position.z += 6 * i
                phone.rotation.y = Math.PI * 3.5;
                iphones[i] = phone
                scene.add(phone);
        }
        //scene.add(object);
    })
})

var ipads = []
var mtlLoader = new MTLLoader();
mtlLoader.load('/models/ipad/mpm_f20__Apple_iPad_2.mtl',function (materials){
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/models/ipad/mpm_f20__Apple_iPad_2.obj', function(object){
        object.scale.set(0.01,0.01,0.01);
        for(var i = -2; i < 3; i++){
            var ipad = object.clone()
            ipad.position.set(-48, 5.5, 0)
            ipad.position.z += 12 * i
            ipad.rotation.y = Math.PI*2.3;
            ipad.rotation.z = (Math.PI*3)/2;
            ipad.rotation.x = Math.PI/2;

                ipads[i] = ipad
                scene.add(ipad);
        }
    })
})

scene.add(exterior);

var cameraControllsFirstPerson = new FirstPersonControls(camera);
cameraControllsFirstPerson.lookSpeed = 0.05;
cameraControllsFirstPerson.movementSpeed = 10;

var step = 0
var stepy = 0

// var clock = new THREE.Clock();

function render() {
    step += 0.005
    stepy += 0.00005
    var delta = clock.getDelta();
    cameraControllsFirstPerson.update(delta);
    renderer.render(scene, camera);
}

// const controls = new OrbitControls(camera, renderer.domElement);

// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     render();
// }, false);

var animate = function () {
    requestAnimationFrame(animate);
   //controls.update();

   compuQueRota.rotation.y += 0.01;
    render();
    stats.update();
    update();
};

console.log("Comenzando ejecucion...");
animate();
// update();

