import * as THREE from 'three';

export function createLadyJustice() {
  const group = new THREE.Group();

  // Statue Base - Using neutral-400 color
  const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 0.5, 16);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xa8a29e,
    metalness: 0.6,
    roughness: 0.4,
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -1;
  group.add(base);

  // Dress/Robe - Using primary-200 color
  const robeGeometry = new THREE.CylinderGeometry(0.4, 0.8, 2.5, 16, 8);
  const robeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd3bd86,
    metalness: 0.2,
    roughness: 0.8,
  });
  const robe = new THREE.Mesh(robeGeometry, robeMaterial);
  robe.position.y = 0.25;
  group.add(robe);

  // Head - Using primary-100 color
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6d3b0,
    metalness: 0.1,
    roughness: 0.7,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.6;
  group.add(head);

  // Blindfold - Using neutral-100 color
  const blindfoldGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.3);
  const blindfoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f4,
    metalness: 0.1,
    roughness: 0.9,
  });
  const blindfold = new THREE.Mesh(blindfoldGeometry, blindfoldMaterial);
  blindfold.position.y = 1.65;
  blindfold.position.z = 0.1;
  group.add(blindfold);

  // Scales - Using success-500 color
  const scalesGroup = new THREE.Group();
  
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffDDB7,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Balance Beam
  const beamGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8);
  const beam = new THREE.Mesh(beamGeometry, metalMaterial);
  beam.rotation.z = Math.PI / 2;
  beam.position.y = 1;
  scalesGroup.add(beam);

  // Chains
  const chainMaterial = new THREE.MeshStandardMaterial({
    color: 0xffDDB7,
    metalness: 0.9,
    roughness: 0.1,
  });

  [-0.7, 0.7].forEach(x => {
    const chain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
      chainMaterial
    );
    chain.position.set(x, 0.8, 0);
    scalesGroup.add(chain);
  });

  // Scale Bowls
  const bowlGeometry = new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const bowlMaterial = new THREE.MeshStandardMaterial({
    color: 0xffDDB7,
    metalness: 0.7,
    roughness: 0.3,
    side: THREE.DoubleSide,
  });

  [-0.7, 0.7].forEach(x => {
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
    bowl.position.set(x, 0.6, 0);
    bowl.rotation.x = Math.PI;
    scalesGroup.add(bowl);
  });

  group.add(scalesGroup);

  // Sword - Using neutral-300 color for blade
  const swordGroup = new THREE.Group();
  
  const bladeGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.05);
  const bladeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd6d3d1,
    metalness: 0.9,
    roughness: 0.1,
  });
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.y = 0.5;
  swordGroup.add(blade);

  // Handle - Using primary-700 color
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d4b16,
    metalness: 0.3,
    roughness: 0.7,
  });
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.y = -0.2;
  swordGroup.add(handle);

  swordGroup.position.set(-0.6, 0.5, 0);
  swordGroup.rotation.z = -Math.PI / 6;
  group.add(swordGroup);

  return group;
}