
import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
class App extends Component {
  componentDidMount() {
    // === THREE.JS CODE START ===
    // *** scene and camera ***
    // Create a three.js scene
    var Colors = {
      red:0xf25346,
      white:0xd8d0d1,
      brown:0x59332e,
      pink:0xF5986E,
      brownDark:0x23190f,
      blue:0x68c3c0,
    };
    
    var scene = new THREE.Scene();

    // Add a camera so that we can see our 3D objects.
    // By moving our camera's z positioning, we can increase or decrease zoom.
    var width = window.innerWidth;
    var height = window.innerHeight;

    console.log(width / 2);
    var camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -1000,
      1000
    )

    camera.position.z = 2;
    scene.add(camera);

    // *** renderer ***
    // A canvas renderer will generate the image, drawing our models on the screen.
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    // Configure renderer clear color
    renderer.setClearColor("#fff", 0);

    renderer.setSize(window.innerWidth, window.innerHeight);

    // This places the CanvasRenderer onto the body element in our HTML.
    document.body.appendChild(renderer.domElement);

    // Light
    var ambientLight = new THREE.AmbientLight(0xBC0F31);
    scene.add(ambientLight);

    var lights = [];

    lights[0] = new THREE.PointLight(0xDC2653, 0.5, 0);
    lights[0].position.set(200, "00", 0);

    lights[1] = new THREE.PointLight(0x708777, 0.5, 0);
    lights[1].position.set(0, 200, 0);

    lights[2] = new THREE.PointLight(0xF5BD50, 0.5, 0);
    lights[2].position.set(0, 100, 100);

    lights[3] = new THREE.AmbientLight(0x000000, 0.6);

    lights.forEach(function(light){
      scene.add(light);
    })

    /*
    Geometry
    */
    function createTorus(r, tubeD, radialSegs, tubularSegs, arc, color, rotationX){
      var geometry = new THREE.TorusGeometry(r, tubeD, radialSegs, tubularSegs, arc);
      var material = new THREE.MeshLambertMaterial({ color: color || "#ff7171" });
      var torus = new THREE.Mesh(geometry, material);
      torus.rotation.x = rotationX;

      return torus;
    }

    function createLine(){
      var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
      });

      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3( 0, 10, 0 ),
        new THREE.Vector3( 0, -10, 0 )
      );

      var line = new THREE.Line( geometry, material );

      return line;
    }

    /*
    r
    color
    x
    y
    */
    function createSphere(params){
      var geometry = new THREE.SphereGeometry( width / (params.r || 40), 50, 50 );
      var material = new THREE.MeshPhongMaterial({
        color: params.color || Colors.blue,
        transparent: true,
        opacity: 0.8
      });
      var sphere = new THREE.Mesh( geometry, material );

      sphere.position.x = params.x || 0;
      sphere.position.y = params.y || 0;

      return sphere;
    }

    /* create stuff */
    const baseRadius = (width > height ? (height - 40 / 2) : (width - 40 / 2));

    function createValence(ringNumber, electronCount){
      var radius = 50 + (baseRadius / 20) * ringNumber;
    
      var ring = createTorus(
        radius,
        baseRadius / 600,
        20,
        100,
        Math.PI * 2,
        '#333333',
        0
      );
    
      var electrons = [];
    
      var angleIncrement = (Math.PI * 2) / electronCount;
      var angle = 0;
    
      for (var i = 0; i < electronCount; i++) {
        // Solve for x and y.
        var posX = radius * Math.cos(angle);
        var posY = radius * Math.sin(angle);
    
        angle += angleIncrement;
    
        var electron = createSphere({ r: 120, x: posX, y: posY, color: Colors.white });
        electrons.push(electron);
      }
    
      var group = new THREE.Group();
    
      group.add(ring);
    
      electrons.forEach(function(electron){
        group.add(electron);
      });
    
      return group;
    }

    var nucleus = createSphere({ color: Colors.white });
    scene.add(nucleus);

    var shellCounts = [2, 6, 10, 14, 18];

    var valenceCount = 6;

    var valences = [];

    for (var i = 1; i <= valenceCount; i++) {
      var shellCountIndex = (i - 1) % shellCounts.length;
      var v = createValence(i, shellCounts[shellCountIndex]);
      console.log(shellCounts[shellCountIndex]);
    
      valences.push(v);
    
      scene.add(v);
    }

    /*
    Render
    */
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // *** animation ***
    // Animate motion using a clock timer.
    var clock = new THREE.Clock();

    // This function will handle animation of our atom
    var render = function(){
      requestAnimationFrame(render);
    
      var baseRotation = 0.01;
    
      valences.forEach(function(v, i){
        v.rotation.y += baseRotation - (i * 0.001);
        v.rotation.x += baseRotation - (i * 0.001);
        v.rotation.z += baseRotation - (i * 0.001);
      })
      //
      //
      // v1.rotation.y += 0.002;
      // v1.rotation.x += 0.02;
      // v1.rotation.z += 0.02;
      // v2.rotation.y += 0.001;
      // v2.rotation.x += 0.01;
      // v2.rotation.z += 0.01;
      // v3.rotation.y -= 0.0005;
      // // v3.rotation.x += 0.005;
      // v3.rotation.z += 0.0075;
      nucleus.rotation.x += 0.01;
      nucleus.rotation.y += 0.01;
    
      renderer.render(scene, camera);
    };

    function onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    render();

    // Run the animation.
    // animate();
    // === THREE.JS EXAMPLE CODE END ===
  }
  render() {
    return (
      <div />
    )
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);