"use client"
"use client"
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import Link from "next/link";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f14);// Dark brown background
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x5c9cd6, 2);
    directionalLight.position.set(-5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Ground setup
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a2431, // Darker blue-brown
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Left cliff
    const createCliff = (x: number, z: number, rotY: number) => {
      const cliffGeometry = new THREE.BoxGeometry(8, 12, 4);
      const cliffMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a3340, // Dark blue-brown
        roughness: 0.9,
      });
     
      const cliff = new THREE.Mesh(cliffGeometry, cliffMaterial);
      cliff.position.set(x, 2, z);
      cliff.rotation.y = rotY;
      cliff.castShadow = true;
      cliff.receiveShadow = true;
      
      // Add some randomness to the cliff
      const positionAttribute = cliff.geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        if (vertex.y > 0) {
          vertex.x += (Math.random() - 0.5) * 0.2;
          vertex.y += (Math.random() - 0.5) * 0.3;
          vertex.z += (Math.random() - 0.5) * 0.2;
          positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
      }
      
      cliff.geometry.computeVertexNormals();
      scene.add(cliff);
    };
    
    // Create cliffs on sides
    createCliff(-8, 0, Math.PI / 8);
    createCliff(8, 0, -Math.PI / 8);
    
    // Add floating rocks
    const createFloatingRock = (x: number, y: number, z: number, scale: number) => {
      const rockGeometry = new THREE.DodecahedronGeometry(scale, 0);
      const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x5c3c1f,
        roughness: 0.8,
      });
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(x, y, z);
      rock.castShadow = true;
      
      // Randomize the shape
      const positionAttribute = rock.geometry.getAttribute('position');
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        vertex.x += (Math.random() - 0.5) * 0.2;
        vertex.y += (Math.random() - 0.5) * 0.2;
        vertex.z += (Math.random() - 0.5) * 0.2;
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      rock.geometry.computeVertexNormals();
      scene.add(rock);
      
      // Add animation data
      return {
        mesh: rock,
        originalY: y,
        floatSpeed: Math.random() * 0.001 + 0.001,
        rotationSpeed: Math.random() * 0.005 + 0.002,
        floatAmplitude: Math.random() * 0.5 + 0.2,
      };
    };
    
    const floatingRocks = [
      createFloatingRock(0, 5, -2, 0.6),
      createFloatingRock(3, 4, -1, 0.4),
      createFloatingRock(-2, 6, -3, 0.5),
      createFloatingRock(1, 3, 2, 0.3),
    ];
    
    // Create character
    const characterGroup = new THREE.Group();
    
    // Character body
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    characterGroup.add(body);
    
    // Character head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.95;
    head.castShadow = true;
    characterGroup.add(head);
    
    // Character limbs
    const createLimb = (x: number, y: number, z: number, width: number, height: number, depth: number) => {
      const limbGeometry = new THREE.BoxGeometry(width, height, depth);
      const limbMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const limb = new THREE.Mesh(limbGeometry, limbMaterial);
      limb.position.set(x, y, z);
      limb.castShadow = true;
      return limb;
    };
    
    // Arms
    const rightArm = createLimb(0.35, 0.4, 0, 0.2, 0.6, 0.2);
    const leftArm = createLimb(-0.35, 0.4, 0, 0.2, 0.6, 0.2);
    characterGroup.add(rightArm, leftArm);
    
    // Legs
    const rightLeg = createLimb(0.2, -0.1, 0, 0.2, 0.6, 0.2);
    const leftLeg = createLimb(-0.2, -0.1, 0, 0.2, 0.6, 0.2);
    characterGroup.add(rightLeg, leftLeg);
    
    characterGroup.position.y = 0.3;
    scene.add(characterGroup);
    
    // Character Animation State
    let animationState = 'idle';
    let animationTime = 0;
    const animationDuration = 2;
    const animationTimer = Math.random() * 10;
    
    // Animation functions
    const animations = {
      idle: (time: number) => {
        characterGroup.position.y = 0.3 + Math.sin(time * 2) * 0.03;
      },
      jump: (time: number, progress: number) => {
        const jumpHeight = Math.sin(Math.PI * progress) * 1.2;
        characterGroup.position.y = 0.3 + jumpHeight;
        
        // Arms up during jump
        rightArm.rotation.x = -Math.PI / 4 * Math.sin(Math.PI * progress);
        leftArm.rotation.x = -Math.PI / 4 * Math.sin(Math.PI * progress);
      },
      dance: (time: number, progress: number) => {
        characterGroup.rotation.y = Math.sin(time * 8) * 0.5;
        rightArm.rotation.z = Math.sin(time * 8) * 0.5;
        leftArm.rotation.z = -Math.sin(time * 8) * 0.5;
        characterGroup.position.y = 0.3 + Math.abs(Math.sin(time * 8) * 0.1);
      },
      wave: (time: number, progress: number) => {
        rightArm.rotation.z = Math.sin(time * 6) * 0.7 + 0.5;
        rightArm.rotation.x = -0.3;
      }
    };
    
    // Animation loop
    const animate = (time: number) => {
      const t = time * 0.001; // Convert to seconds
      
      // Animate floating rocks
      floatingRocks.forEach(rock => {
        rock.mesh.position.y = rock.originalY + Math.sin(t * rock.floatSpeed * 1000) * rock.floatAmplitude;
        rock.mesh.rotation.x += rock.rotationSpeed;
        rock.mesh.rotation.y += rock.rotationSpeed * 0.7;
      });
      
      // Reset limb rotations for fresh animations
      if (animationState !== 'wave') {
        rightArm.rotation.z = 0;
        rightArm.rotation.x = 0;
      }
      
      if (animationState !== 'dance') {
        leftArm.rotation.z = 0;
        characterGroup.rotation.y = 0;
      }
      
      // Handle character animations
      switch(animationState) {
        case 'idle':
          animations.idle(t);
          
          // Randomly change animation
          if (t > animationTimer && t % 8 < 0.02) {
            const animations = ['jump', 'dance', 'wave'];
            animationState = animations[Math.floor(Math.random() * animations.length)];
            animationTime = t;
          }
          break;
          
        case 'jump':
          const jumpProgress = Math.min((t - animationTime) / animationDuration, 1);
          animations.jump(t, jumpProgress);
          
          if (jumpProgress >= 1) {
            animationState = 'idle';
          }
          break;
          
        case 'dance':
          const danceProgress = Math.min((t - animationTime) / (animationDuration * 2), 1);
          animations.dance(t, danceProgress);
          
          if (danceProgress >= 1) {
            animationState = 'idle';
          }
          break;
          
        case 'wave':
          const waveProgress = Math.min((t - animationTime) / (animationDuration * 1.5), 1);
          animations.wave(t, waveProgress);
          
          if (waveProgress >= 1) {
            animationState = 'idle';
          }
          break;
      }
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
    
    requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);
  
  return (
    <>
      <Head>
        <title>CineGenie | Your Movie Tracker & Chat Community</title>
        <meta name="description" content="Track movies, chat with film lovers, and discover your next favorite film with CineGenie." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Outfit:wght@300;400;600&family=Cinzel&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="scene-container" ref={mountRef}>
        <div className={`content-container ${loaded ? 'visible' : ''}`}>
          <div className="camera-icons">
            <div className="camera left-camera">
              <div className="camera-body"></div>
              <div className="camera-lens"></div>
              <div className="camera-handle"></div>
              <div className="camera-viewfinder"></div>
              <div className="film-reels">
                <div className="film-reel"></div>
                <div className="film-reel"></div>
              </div>
            </div>
            
            <div className="central-content">
              <h1 className="title">CineGenie</h1>
              <p className="subtitle">Your magical companion for films & discussions</p>
              <Link href="/Auth">
                <button className="auth-button">Enter the Realm</button>
              </Link>
            </div>
            
            <div className="camera right-camera">
              <div className="camera-body"></div>
              <div className="camera-lens"></div>
              <div className="camera-handle"></div>
              <div className="camera-viewfinder"></div>
              <div className="film-reels">
                <div className="film-reel"></div>
                <div className="film-reel"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scene-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        .content-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          width: 90%;
          max-width: 1200px
}

.content-container.visible {
  opacity: 1;
}

.title {
  font-family: 'Audiowide', cursive;
  font-size: 5rem;
  color: #f9f3e5;
  margin: 0;
  text-shadow: 0 0 10px rgba(92, 198, 255, 0.7), 
               0 0 20px rgba(92, 198, 255, 0.5),
               0 0 30px rgba(92, 198, 255, 0.3);
  letter-spacing: 2px;
}

.subtitle {
  font-family: 'Outfit', sans-serif;
  font-weight: 300;
  font-size: 1.5rem;
  color: #f0f0f0;
  margin: 1rem 0 2rem;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}

.auth-button {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #3a8bd8 0%, #215d9d 100%);
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(33, 93, 157, 0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.auth-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(33, 93, 157, 0.6);
}

.auth-button:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .auth-button {
    font-size: 1rem;
    padding: 0.7rem 2rem;
  }
}
      `}</style>
    </>
  );
};