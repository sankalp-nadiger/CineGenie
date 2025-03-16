"use client"
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeCharacterProps {
  state: string;
}

const ThreeCharacter: React.FC<ThreeCharacterProps> = ({ state }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const animationsRef = useRef<{[key: string]: THREE.AnimationAction}>({});
  
  // Add refs for individual body parts
  const rightArmRef = useRef<THREE.Mesh | null>(null);
  const leftArmRef = useRef<THREE.Mesh | null>(null);
  const headRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a simple robot character
    const createRobot = () => {
      const robot = new THREE.Group();
      
      // Materials
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2194ce,
        specular: 0x111111,
        shininess: 100
      });
      
      const jointMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xdddddd,
        specular: 0x111111,
        shininess: 100
      });
      
      const eyeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        specular: 0x111111,
        shininess: 100
      });
      
      const pupilMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        specular: 0x111111,
        shininess: 100
      });

      // Body
      const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.name = 'body';
      robot.add(body);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const head = new THREE.Mesh(headGeometry, bodyMaterial);
      head.position.y = 1.25;
      head.name = 'head';
      headRef.current = head;
      robot.add(head);

      // Eyes
      const eyeGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.18, 1.35, 0.4);
      leftEye.name = 'leftEye';
      
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.18, 1.35, 0.4);
      rightEye.name = 'rightEye';
      
      robot.add(leftEye);
      robot.add(rightEye);

      // Pupils
      const pupilGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      
      const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      leftPupil.position.set(-0.18, 1.35, 0.5);
      leftPupil.name = 'leftPupil';
      
      const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      rightPupil.position.set(0.18, 1.35, 0.5);
      rightPupil.name = 'rightPupil';
      
      robot.add(leftPupil);
      robot.add(rightPupil);

      // Arms
      const armGeometry = new THREE.BoxGeometry(0.25, 1, 0.25);
      
      const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
      leftArm.position.set(-0.625, 0, 0);
      leftArm.name = 'leftArm';
      leftArmRef.current = leftArm;
      
      const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
      rightArm.position.set(0.625, 0, 0);
      rightArm.name = 'rightArm';
      rightArmRef.current = rightArm;
      
      robot.add(leftArm);
      robot.add(rightArm);

      // Legs
      const legGeometry = new THREE.BoxGeometry(0.25, 1, 0.25);
      
      const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      leftLeg.position.set(-0.25, -1.25, 0);
      leftLeg.name = 'leftLeg';
      
      const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      rightLeg.position.set(0.25, -1.25, 0);
      rightLeg.name = 'rightLeg';
      
      robot.add(leftLeg);
      robot.add(rightLeg);

      // Joints
      const jointGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      
      const leftShoulder = new THREE.Mesh(jointGeometry, jointMaterial);
      leftShoulder.position.set(-0.625, 0.5, 0);
      leftShoulder.name = 'leftShoulder';
      
      const rightShoulder = new THREE.Mesh(jointGeometry, jointMaterial);
      rightShoulder.position.set(0.625, 0.5, 0);
      rightShoulder.name = 'rightShoulder';
      
      const leftHip = new THREE.Mesh(jointGeometry, jointMaterial);
      leftHip.position.set(-0.25, -0.75, 0);
      leftHip.name = 'leftHip';
      
      const rightHip = new THREE.Mesh(jointGeometry, jointMaterial);
      rightHip.position.set(0.25, -0.75, 0);
      rightHip.name = 'rightHip';
      
      robot.add(leftShoulder);
      robot.add(rightShoulder);
      robot.add(leftHip);
      robot.add(rightHip);

      // Position the robot
      robot.position.y = 0;
      robot.scale.set(0.8, 0.8, 0.8);
      
      // Add as a reference to animate
      characterRef.current = robot;
      
      return robot;
    };

    // Create the robot and add it to the scene
    const robot = createRobot();
    scene.add(robot);

    // Set up animation mixer
    const mixer = new THREE.AnimationMixer(robot);
    mixerRef.current = mixer;

    // Create animations
    const setupAnimations = () => {
      // Basic idle animation
      const idleKF = new THREE.KeyframeTrack(
        '.position[y]',
        [0, 1, 2],
        [0, 0.05, 0]
      );
      
      const idleClip = new THREE.AnimationClip('idle', 2, [idleKF]);
      animationsRef.current.idle = mixer.clipAction(idleClip);
      animationsRef.current.idle.setLoop(THREE.LoopRepeat, Infinity);
      
      // Waving animation - using named object instead of index
      if (rightArmRef.current) {
        const wavingClip = new THREE.AnimationClip('waving', 2, [
          new THREE.NumberKeyframeTrack(
            'rightArm.rotation[z]',
            [0, 0.5, 1, 1.5, 2],
            [0, Math.PI/4, 0, Math.PI/4, 0]
          )
        ]);
        animationsRef.current.waving = mixer.clipAction(wavingClip);
        animationsRef.current.waving.setLoop(THREE.LoopRepeat, 2);
      }
      
      // Thinking animation
      if (headRef.current) {
        const thinkingClip = new THREE.AnimationClip('thinking', 2, [
          new THREE.NumberKeyframeTrack(
            'head.rotation[x]',
            [0, 1, 2],
            [0, Math.PI/8, 0]
          )
        ]);
        animationsRef.current.thinking = mixer.clipAction(thinkingClip);
        animationsRef.current.thinking.setLoop(THREE.LoopRepeat, 2);
      }
      
      // Celebrating animation
      const celebratingTracks = [
        new THREE.NumberKeyframeTrack(
          '.position[y]',
          [0, 0.5, 1],
          [0, 0.5, 0]
        )
      ];
      
      if (rightArmRef.current && leftArmRef.current) {
        celebratingTracks.push(
          new THREE.NumberKeyframeTrack(
            'rightArm.rotation[z]',
            [0, 0.5, 1],
            [0, -Math.PI/2, 0]
          ),
          new THREE.NumberKeyframeTrack(
            'leftArm.rotation[z]',
            [0, 0.5, 1],
            [0, Math.PI/2, 0]
          )
        );
      }
      
      const celebratingClip = new THREE.AnimationClip('celebrating', 1, celebratingTracks);
      animationsRef.current.celebrating = mixer.clipAction(celebratingClip);
      animationsRef.current.celebrating.setLoop(THREE.LoopRepeat, 3);
      
      // Pointing animation
      if (rightArmRef.current) {
        const pointingClip = new THREE.AnimationClip('pointing', 2, [
          new THREE.NumberKeyframeTrack(
            'rightArm.rotation[x]',
            [0, 0.5, 1, 1.5, 2],
            [0, Math.PI/4, Math.PI/4, Math.PI/4, 0]
          )
        ]);
        animationsRef.current.pointing = mixer.clipAction(pointingClip);
        animationsRef.current.pointing.setLoop(THREE.LoopRepeat, 1);
      }
      
      // Surprised animation
      if (headRef.current) {
        const surprisedClip = new THREE.AnimationClip('surprised', 1, [
          new THREE.VectorKeyframeTrack(
            'head.scale',
            [0, 0.5, 1],
            [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
          )
        ]);
        animationsRef.current.surprised = mixer.clipAction(surprisedClip);
        animationsRef.current.surprised.setLoop(THREE.LoopOnce, 1);
      }
      
      // Processing animation
      const processingClip = new THREE.AnimationClip('processing', 2, [
        new THREE.NumberKeyframeTrack(
          '.rotation[y]',
          [0, 2],
          [0, Math.PI * 2]
        )
      ]);
      animationsRef.current.processing = mixer.clipAction(processingClip);
      animationsRef.current.processing.setLoop(THREE.LoopRepeat, 2);
      
      // Shielding animation - New animation
      if (rightArmRef.current) {
        const shieldingClip = new THREE.AnimationClip('shielding', 2, [
          new THREE.NumberKeyframeTrack(
            'rightArm.rotation[y]',
            [0, 1, 2],
            [0, Math.PI/2, 0]
          )
        ]);
        animationsRef.current.shielding = mixer.clipAction(shieldingClip);
        animationsRef.current.shielding.setLoop(THREE.LoopOnce, 1);
      }
      
      // Waiting animation - New animation
      const waitingClip = new THREE.AnimationClip('waiting', 4, [
        new THREE.NumberKeyframeTrack(
          '.position[y]',
          [0, 1, 2, 3, 4],
          [0, -0.05, 0, -0.05, 0]
        )
      ]);
      animationsRef.current.waiting = mixer.clipAction(waitingClip);
      animationsRef.current.waiting.setLoop(THREE.LoopRepeat, Infinity);
      
      // Typing animation - New animation
      if (leftArmRef.current && rightArmRef.current) {
        const typingClip = new THREE.AnimationClip('typing', 1, [
          new THREE.NumberKeyframeTrack(
            'leftArm.rotation[x]',
            [0, 0.25, 0.5, 0.75, 1],
            [0, -Math.PI/8, 0, -Math.PI/8, 0]
          ),
          new THREE.NumberKeyframeTrack(
            'rightArm.rotation[x]',
            [0, 0.25, 0.5, 0.75, 1],
            [-Math.PI/8, 0, -Math.PI/8, 0, -Math.PI/8]
          )
        ]);
        animationsRef.current.typing = mixer.clipAction(typingClip);
        animationsRef.current.typing.setLoop(THREE.LoopRepeat, Infinity);
      }
      
      // Start with idle animation
      animationsRef.current.idle.play();
    };

    setupAnimations();

    // Animation loop
    const animate = () => {
      const delta = clockRef.current.getDelta();
      
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      if (characterRef.current) {
        characterRef.current.rotation.y += 0.005;
      }
      
      rendererRef.current?.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    setLoaded(true);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  // Update character animation state
  useEffect(() => {
    if (!loaded || !mixerRef.current || !animationsRef.current) return;
    
    // Stop all animations
    Object.values(animationsRef.current).forEach(action => {
      action.stop();
    });
    
    // Start the requested animation
    if (animationsRef.current[state]) {
      animationsRef.current[state].reset().play();
    } else {
      // Default to idle if the state doesn't exist
      animationsRef.current.idle.reset().play();
    }
  }, [state, loaded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeCharacter;