// import THREE from "three.js";

const WIDTH = window.innerWidth - 50;
const HEIGHT = window.innerHeight - 50;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, WIDTH/HEIGHT, 0.5, 5000);
var renderer = new THREE.WebGLRenderer();

scene.fog = new THREE.Fog(0x000000, 5, 500);

camera.position.y = 20;

var isForward=false, isBackward=false, isLeft=false, isRight=false, isJumping = false;
var isColliderOnFloor = false;
var spd = 3;

var points = document.getElementById("points");
var pts = 0;

var gv = 1.0;
var rb = 0.0;

function CREATE_WORLD() {
    //FLOOR
    var floorGeometry = new THREE.BoxGeometry(1000, 1, 1000);
    var textureFloorGeometry = new THREE.TextureLoader().load("floor.png");
    var materialFloorGeometry = new THREE.MeshBasicMaterial({});
    textureFloorGeometry.wrapS = THREE.RepeatWrapping;
    textureFloorGeometry.wrapT = THREE.RepeatWrapping;
    textureFloorGeometry.repeat.set( 25, 25 );
    materialFloorGeometry.map = textureFloorGeometry;
    var meshFloor = new THREE.Mesh(floorGeometry, materialFloorGeometry);

    //WALLS
    var wallForwardGeometry = new THREE.BoxGeometry(1,350,1000);
    var wallForwardGeometryTexture = new THREE.TextureLoader().load("floor.png");
    var wallForwardGeometryMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
    wallForwardGeometryTexture.wrapS = THREE.RepeatWrapping;
    wallForwardGeometryTexture.wrapT = THREE.RepeatWrapping;
    wallForwardGeometryTexture.repeat.set( 10, 5 );
    wallForwardGeometryMaterial.map = wallForwardGeometryTexture;
    var meshForwardGeometry = new THREE.Mesh(wallForwardGeometry, wallForwardGeometryMaterial);
    meshForwardGeometry.position.x = 500;

    var wallBackwardGeometry = new THREE.BoxGeometry(1,350,1000);
    var wallBackwardGeometryMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
    wallBackwardGeometryMaterial.map = wallForwardGeometryTexture;
    var meshBackwardGeometry = new THREE.Mesh(wallBackwardGeometry, wallBackwardGeometryMaterial);
    meshBackwardGeometry.position.x = -500;

    var wallLeftGeometry = new THREE.BoxGeometry(1000,350,1);
    var wallLeftGeometryMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
    wallLeftGeometryMaterial.map = wallForwardGeometryTexture;
    var meshLeftGeometry = new THREE.Mesh(wallLeftGeometry, wallLeftGeometryMaterial);
    meshLeftGeometry.position.z = 500;

    var wallRightGeometry = new THREE.BoxGeometry(1000,350,1);
    var wallRightGeometryMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
    wallRightGeometryMaterial.map = wallForwardGeometryTexture;
    var meshRightGeometry = new THREE.Mesh(wallRightGeometry, wallRightGeometryMaterial);
    meshRightGeometry.position.z = -500;

    var wallCellingGeometry = new THREE.BoxGeometry(1000,1,1000);
    var wallCellingGeometryTexture = new THREE.TextureLoader().load("celling.png");
    var wallCellingGeometryMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
    wallCellingGeometryMaterial.map = wallCellingGeometryTexture;
    var meshCellingGeometry = new THREE.Mesh(wallCellingGeometry, wallCellingGeometryMaterial);
    meshCellingGeometry.position.y = 100;

    scene.add(meshFloor);

    scene.add(meshForwardGeometry);
    scene.add(meshBackwardGeometry);
    scene.add(meshLeftGeometry);
    scene.add(meshRightGeometry);
    scene.add(meshCellingGeometry);
}

CREATE_WORLD();

var BlockGeometry = new THREE.BoxGeometry(20, 50, 20);
var BlockGeometryMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff});
var BlockGeometryMesh = new THREE.Mesh(BlockGeometry, BlockGeometryMaterial);

BlockGeometryMesh.position.y = 2;
BlockGeometryMesh.position.z = 50;

scene.add(BlockGeometryMesh);

renderer.setSize(WIDTH, HEIGHT);

document.body.appendChild(renderer.domElement);

function UPDATE() {

    points.innerHTML = `<h3 style="color: white; user-select: none; position: absolute; margin-left: 20px;" id="points">Pontos:${pts}</h3>`;

    collisionBox();

    PLAYERMOVEMENT();

    renderer.render(scene, camera);

    requestAnimationFrame(UPDATE);
}
UPDATE();

addEventListener("keydown", function(e) {
    if(e.key == "w") {
        isForward = true;
    }
    if(e.key == "a") {
        isLeft = true;
    }
    if(e.key == "s") {
        isBackward = true;
    }
    if(e.key == "d") {
        isRight = true;
    }

    if(e.keyCode == 32) {
        isJumping = true;
    }
});

addEventListener("keyup", function(e) {
    if(e.key == "w") {
        isForward = false;
    }
    if(e.key == "a") {
        isLeft = false;
    }
    if(e.key == "s") {
        isBackward = false;
    }
    if(e.key == "d") {
        isRight = false;
    }

    if(e.keyCode == 32) {
        isJumping = false;
    }
});

function PLAYERMOVEMENT() {
    
    if(isForward) {
        camera.translateZ(-spd);
    }

    if(isBackward) {
        camera.translateZ(spd);
    }

    if(isLeft) {
        camera.translateX(-spd);
    }

    if(isRight) {
        camera.translateX(spd);
    }

    rb += gv;

    if(rb > 2) {
        rb = 0;
    }

    if(isJumping == true && isColliderOnFloor == true) {
        camera.position.y += rb * 10;
    }

    if(camera.position.x >= 490) {
        camera.position.x = 490;
    }

    if(camera.position.x <= -490) {
        camera.position.x = -490;
    }

    if(camera.position.z >= 490) {
        camera.position.z = 490;
    }

    if(camera.position.z <= -490) {
        camera.position.z = -490;
    }

    //JUMP
    if(camera.position.y <= 20) {
        isColliderOnFloor = true;
    }

    if(camera.position.y >= 20) {
        isColliderOnFloor = false;
        camera.position.y -= rb;
    }
}

addEventListener("mousemove", function(e) {
    camera.rotation.y = -e.x / 150;
});

function collisionBox() {
    if(camera.position.z >= BlockGeometryMesh.position.z && camera.position.z <= BlockGeometryMesh.position.z + 20 && camera.position.x > BlockGeometryMesh.position.x - 20 && camera.position.x < BlockGeometryMesh.position.x + 20) {
        camera.position.z = BlockGeometryMesh.position.z;
        camera.position.x = BlockGeometryMesh.position.x;
        console.log("bubb");
    }
}

var obstacle1Geometry = new THREE.BoxGeometry(30, 30, 30);
var obstacle1GeometryTexture = new THREE.TextureLoader().load("alvo.png");
var obstacle1GeometryMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
obstacle1GeometryMaterial.map = obstacle1GeometryTexture;
var obstacle1GeometryMesh = new THREE.Mesh(obstacle1Geometry, obstacle1GeometryMaterial);

obstacle1GeometryMesh.position.y = 10;
obstacle1GeometryMesh.position.x = 0;
obstacle1GeometryMesh.position.z = -200;

scene.add(obstacle1GeometryMesh);

function INSTANTIATEBULLETS() {
    addEventListener("mousedown",function(e) {
        var bulletGeometry = new THREE.BoxGeometry(5, 2, 2);
        var bulletMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        var bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
        bulletMesh.position.x = camera.position.x;
        bulletMesh.position.y = 15;
        bulletMesh.position.z = camera.position.z;
        bulletMesh.rotation.y = 90 + camera.rotation.y - 0.45;
        

        setInterval(() => {
            bulletMesh.translateX(2);

            if(bulletMesh.position.z <= obstacle1GeometryMesh.position.z + 20 
               && bulletMesh.position.z >= obstacle1GeometryMesh.position.z - 20
               && bulletMesh.position.x >= obstacle1GeometryMesh.position.x - 20 
               && bulletMesh.position.x <= obstacle1GeometryMesh.position.x + 20) {
                scene.remove(bulletMesh);
                obstacle1GeometryMesh.position.x = -450 + Math.random() * 1000;

                pts ++;
            }
        }, 1);

        setTimeout(() => {
            scene.remove(bulletMesh);
        }, 2000);
    
        scene.add(bulletMesh);
    });
}

INSTANTIATEBULLETS();