import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import projectData from "../../avatar-studio-project.json";

export default function AvatarCanvas({
  avatarId = null,
  isFullScreen = true,
  className = "",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;

    // Retrieve active avatar from JSON
    const activeId = avatarId || projectData?.library?.activeAvatarId;
    const avatar =
      projectData?.library?.avatars?.find((a) => a.id === activeId) ||
      projectData?.library?.avatars?.[0] ||
      {};

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      initialWidth / initialHeight,
      0.1,
      2000
    );

    const updateCameraDistance = (w, h) => {
      const isMobile = w < 768;
      if (isFullScreen) {
        camera.position.set(0, 0, isMobile ? 620 : 540);
      } else {
        // Zoom in to make the blob bigger when embedded in a layout
        camera.position.set(0, 0, isMobile ? 520 : 380);
      }
    };

    updateCameraDistance(initialWidth, initialHeight);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Lighting for clean contrast on white background
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(250, 350, 450);
    scene.add(mainLight);

    const softFillLight = new THREE.DirectionalLight(0xe2e8f0, 2.2);
    softFillLight.position.set(-250, 150, 250);
    scene.add(softFillLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 4.8);
    cyanRimLight.position.set(-300, 200, -250);
    scene.add(cyanRimLight);

    const blueBackLight = new THREE.DirectionalLight(0x3b82f6, 3.6);
    blueBackLight.position.set(200, -200, -300);
    scene.add(blueBackLight);

    // Head / Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const headGroup = new THREE.Group();
    rootGroup.add(headGroup);

    // Create Primary Body Mesh with high tessellation (128x128)
    const bodyDef = avatar.body?.primary || {
      type: "sphere",
      width: 240,
      height: 240,
      depth: 240,
      roundness: 1,
    };

    // The entire website is now on a dark Starfield background, so always use a bright avatar
    const bodyColor = "#ffffff";
    const eyeColor = "#0a0f1d";

    let bodyGeometry;
    const bw = bodyDef.width || 240;
    const bh = bodyDef.height || 240;
    const bd = bodyDef.depth || 240;

    if (bodyDef.type === "sphere") {
      bodyGeometry = new THREE.SphereGeometry(bw / 2, 128, 128);
    } else if (bodyDef.type === "cube") {
      bodyGeometry = new THREE.BoxGeometry(bw, bh, bd);
    } else if (bodyDef.type === "capsule") {
      const radius = bw / 2;
      const length = Math.max(0.1, bh - bw);
      bodyGeometry = new THREE.CapsuleGeometry(radius, length, 64, 64);
    } else if (bodyDef.type === "cone") {
      bodyGeometry = new THREE.ConeGeometry(bw / 2, bh, 64);
    } else {
      bodyGeometry = new THREE.SphereGeometry(bw / 2, 128, 128);
    }

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(bodyColor),
      roughness: 0.12,
      metalness: 0.6,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });

    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    headGroup.add(bodyMesh);

    // Secondary Nodes (ears, horns, accessories)
    const nodes = avatar.body?.nodes || [];
    nodes.forEach((node) => {
      const s = node.surface || {};
      const nw = s.width || 40;
      const nh = s.height || 40;
      const nd = s.depth || 40;
      let nodeGeo;

      if (s.type === "sphere") {
        nodeGeo = new THREE.SphereGeometry(nw / 2, 64, 64);
      } else if (s.type === "cylinder") {
        nodeGeo = new THREE.CylinderGeometry(nw / 2, nw / 2, nh, 48);
      } else if (s.type === "cube") {
        nodeGeo = new THREE.BoxGeometry(nw, nh, nd);
      } else {
        nodeGeo = new THREE.SphereGeometry(nw / 2, 64, 64);
      }

      const nodeMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(bodyColor),
        roughness: 0.15,
        metalness: 0.5,
        clearcoat: 0.6,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      if (node.position) {
        nodeMesh.position.set(
          node.position[0] || 0,
          -(node.position[1] || 0),
          node.position[2] || 0
        );
      }
      if (node.rotation) {
        nodeMesh.rotation.set(
          ((node.rotation[0] || 0) * Math.PI) / 180,
          ((node.rotation[1] || 0) * Math.PI) / 180,
          ((node.rotation[2] || 0) * Math.PI) / 180
        );
      }
      headGroup.add(nodeMesh);
    });

    // Eyes setup
    const eyesDef = avatar.eyes || {
      widthLeft: 20,
      widthRight: 20,
      heightLeft: 50,
      heightRight: 50,
      spacing: 35,
      positionXLeft: 0,
      positionXRight: 0,
      positionYLeft: -7,
      positionYRight: -7,
    };

    const eyeSpacing = eyesDef.spacing || 35;
    const zOffset = bd / 2 + 1.2;

    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(eyeColor),
    });

    const createEyeMesh = (w, h) => {
      const radius = w / 2;
      const length = Math.max(0.1, h - w);
      const geo = new THREE.CapsuleGeometry(radius, length, 32, 32);
      return new THREE.Mesh(geo, eyeMaterial);
    };

    const eyeLeft = createEyeMesh(
      eyesDef.widthLeft || 20,
      eyesDef.heightLeft || 50
    );
    const eyeRight = createEyeMesh(
      eyesDef.widthRight || 20,
      eyesDef.heightRight || 50
    );

    const baseLeftX = -(eyeSpacing / 2) + (eyesDef.positionXLeft || 0);
    const baseLeftY = -(eyesDef.positionYLeft || 0);
    const baseRightX = eyeSpacing / 2 + (eyesDef.positionXRight || 0);
    const baseRightY = -(eyesDef.positionYRight || 0);

    eyeLeft.position.set(baseLeftX, baseLeftY, zOffset);
    eyeRight.position.set(baseRightX, baseRightY, zOffset);

    headGroup.add(eyeLeft);
    headGroup.add(eyeRight);

    // Mouse Tracking state with smoothed physics velocity
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0, z: 0 };

    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      targetMouse.x = nx;
      targetMouse.y = ny;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // Autonomous Blinking System
    let isBlinking = false;
    let blinkProgress = 0;
    let blinkTimeout = null;

    const scheduleNextBlink = () => {
      const delay = 1800 + Math.random() * 2400;
      blinkTimeout = setTimeout(() => {
        isBlinking = true;
        blinkProgress = 0;
      }, delay);
    };

    scheduleNextBlink();

    // ── GPU Warm-up ─────────────────────────────────────────────────────────
    // Step 1: Force-compile all shaders synchronously (Three.js r152+).
    // This prevents the 1-frame shader-compile stall on the very first render.
    renderer.compile(scene, camera);

    // Step 2: Hide the canvas while we burn warm-up frames so the user never
    // sees the spike. The canvas fades in once the pipeline is stable.
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 0.35s ease";

    // Step 3: Pre-render several frames synchronously to prime the GPU pipeline.
    for (let i = 0; i < 6; i++) {
      renderer.render(scene, camera);
    }

    // Step 4: Start the clock NOW — after warmup — so the first live delta
    // is always tiny (~1 ms). Any time accumulated during warmup is discarded.
    const clock = new THREE.Clock(true); // autoStart = true
    let animationFrameId;
    let warmupFrames = 0;
    const WARMUP_FRAMES = 8; // burn a few RAF frames too (async compile tail)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      warmupFrames++;
      if (warmupFrames <= WARMUP_FRAMES) {
        // Render silently — don't apply physics yet so there's no position pop
        renderer.render(scene, camera);
        if (warmupFrames === WARMUP_FRAMES) {
          // Fade canvas in once the pipeline is stable
          renderer.domElement.style.opacity = "1";
          // Reset clock so elapsed time starts from 0 at the first live frame
          clock.start();
        }
        return;
      }

      // getDelta() called exactly once per frame from here on
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.033); // hard cap at 33 ms (30 fps floor)
      const time = clock.elapsedTime;

      // Exponential smoothing for fluid 120fps/60fps tracking
      const lerpSpeed = 1.0 - Math.exp(-8.0 * delta);
      mouse.x += (targetMouse.x - mouse.x) * lerpSpeed;
      mouse.y += (targetMouse.y - mouse.y) * lerpSpeed;

      // 3D Head rotation tracking cursor with inertia
      const targetRotY = mouse.x * 0.72;
      const targetRotX = -mouse.y * 0.55;
      const targetRotZ = mouse.x * -0.09;

      currentRot.y += (targetRotY - currentRot.y) * lerpSpeed;
      currentRot.x += (targetRotX - currentRot.x) * lerpSpeed;
      currentRot.z += (targetRotZ - currentRot.z) * lerpSpeed;

      headGroup.rotation.y = currentRot.y;
      headGroup.rotation.x = currentRot.x;
      headGroup.rotation.z = currentRot.z;

      // Eye pupil tracking
      const eyeShiftX = mouse.x * 10;
      const eyeShiftY = mouse.y * 10;

      eyeLeft.position.x = baseLeftX + eyeShiftX;
      eyeLeft.position.y = baseLeftY + eyeShiftY;
      eyeRight.position.x = baseRightX + eyeShiftX;
      eyeRight.position.y = baseRightY + eyeShiftY;

      // Organic hovering bob
      const bobbing = Math.sin(time * 2.2) * 8;
      headGroup.position.y = bobbing;

      // Smooth Blinking animation
      if (isBlinking) {
        blinkProgress += delta * 12;
        if (blinkProgress < Math.PI) {
          const rawCos = Math.cos(blinkProgress);
          const smoothBlink = Math.max(0.04, Math.abs(rawCos));
          eyeLeft.scale.y = smoothBlink;
          eyeRight.scale.y = smoothBlink;
        } else {
          eyeLeft.scale.y = 1;
          eyeRight.scale.y = 1;
          isBlinking = false;
          scheduleNextBlink();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      updateCameraDistance(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (blinkTimeout) clearTimeout(blinkTimeout);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      eyeMaterial.dispose();
    };
  }, [avatarId]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full flex items-center justify-center pointer-events-none ${className}`}
    />
  );
}
