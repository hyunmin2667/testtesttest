import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const Move2 = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });

    const camera = new THREE.PerspectiveCamera(60, 1);
    camera.position.set(0, 1, 5); 
    camera.lookAt(new THREE.Vector3(0, 1, 0)); 

    scene.background = new THREE.Color('white');
    const light = new THREE.DirectionalLight('0xffff00', 2);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('/images/scene.gltf', gltf => {
      console.log(gltf);
      const character = gltf.scene;
      // gltf.scene.scale.set(0.025, 0.025, 0.025);
      

      // gltf.scene.traverse(function (child) {
      //   if (child.isMesh) {
      //     // 각 모델에 대한 조작을 수행합니다.
      //     // 예: 모델의 위치를 조정하거나, 배열에 모델을 추가합니다.
      //     child.position.set(0, 0, 0); // 모델의 위치를 조정합니다.
      //     models.push(child); // 모델을 배열에 추가합니다.
      //   }
      // });

      scene.add(character);

      const animationClip = gltf.animations[0];
      const mixer = new THREE.AnimationMixer(character);
      const action = mixer.clipAction(animationClip);

      let rotationSpeed = 0.1;
      let isLeftKeyPressed = false;
      let isRightKeyPressed = false;
      let maxRotationAngle = Math.PI / 3.5; // 최대 회전 각도 

      const handleKeyDown = event => {
        if (event.key === 'ArrowLeft') {
          isLeftKeyPressed = true;
        } else if (event.key === 'ArrowRight') {
          isRightKeyPressed = true;
        }
      }

      const handleKeyUp = event => {
        if (event.key === 'ArrowLeft') {
          isLeftKeyPressed = false;
        } else if (event.key === 'ArrowRight') {
          isRightKeyPressed = false;
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      action.play();

      const animate = () => {
        requestAnimationFrame(animate);
        // mixer.update(0.02);
        renderer.render(scene, camera);
        if (isLeftKeyPressed) {
          if (character.rotation.y < maxRotationAngle) {
            character.rotation.y += rotationSpeed;
          }
        } else if (isRightKeyPressed) {
          if (character.rotation.y > -maxRotationAngle) {
            character.rotation.y -= rotationSpeed;
          }
        }
      }

      animate();

    });
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};


export default Move2;