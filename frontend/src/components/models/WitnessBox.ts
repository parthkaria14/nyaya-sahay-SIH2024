import * as THREE from 'three';

export function createWitnessBox() {
  const group = new THREE.Group();

  // Using primary-600 color for wood
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x76601e,  // Rich beige
    metalness: 0.2,
    roughness: 0.8,
  });

  // Main witness box base
  const baseGeometry = new THREE.BoxGeometry(2.5, 0.3, 2);
  const base = new THREE.Mesh(baseGeometry, woodMaterial);
  base.position.y = -1.5;
  group.add(base);

  // Platform
  const platformGeometry = new THREE.BoxGeometry(2.2, 0.2, 1.8);
  const platform = new THREE.Mesh(platformGeometry, woodMaterial);
  platform.position.y = -1.25;
  group.add(platform);

  // Back panel
  const backPanelGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.1);
  const backPanel = new THREE.Mesh(backPanelGeometry, woodMaterial);
  backPanel.position.set(0, 0, -0.95);
  group.add(backPanel);

  // Side panels
  [-1.2, 1.2].forEach(x => {
    const sidePanelGeometry = new THREE.BoxGeometry(0.1, 2.5, 2);
    const sidePanel = new THREE.Mesh(sidePanelGeometry, woodMaterial);
    sidePanel.position.set(x, 0, 0);
    group.add(sidePanel);
  });

  // Front panel with decorative elements
  const frontPanelGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.1);
  const frontPanel = new THREE.Mesh(frontPanelGeometry, woodMaterial);
  frontPanel.position.set(0, -0.65, 0.95);
  group.add(frontPanel);

  // Decorative trim - Using primary-700 color
  const trimGeometry = new THREE.BoxGeometry(2.6, 0.1, 2.1);
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d4b16,  // Darker beige
    metalness: 0.3,
    roughness: 0.7,
  });
  const trim = new THREE.Mesh(trimGeometry, trimMaterial);
  trim.position.y = 1.25;
  group.add(trim);

  // Chair
  const chairGroup = new THREE.Group();

  // Seat
  const seatGeometry = new THREE.BoxGeometry(1, 0.1, 1);
  const seat = new THREE.Mesh(seatGeometry, woodMaterial);
  seat.position.y = -1;
  chairGroup.add(seat);

  // Chair back
  const chairBackGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
  const chairBack = new THREE.Mesh(chairBackGeometry, woodMaterial);
  chairBack.position.set(0, -0.4, -0.45);
  chairGroup.add(chairBack);

  // Chair legs
  const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
  [-0.4, 0.4].forEach(x => {
    [-0.4, 0.4].forEach(z => {
      const leg = new THREE.Mesh(legGeometry, woodMaterial);
      leg.position.set(x, -1.25, z);
      chairGroup.add(leg);
    });
  });

  chairGroup.position.set(0, 0, 0);
  group.add(chairGroup);

  // Microphone - Using neutral-800 color
  const micStandMaterial = new THREE.MeshStandardMaterial({
    color: 0x292524,
    metalness: 0.8,
    roughness: 0.2,
  });
  
  const micStandGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
  const micStand = new THREE.Mesh(micStandGeometry, micStandMaterial);
  micStand.position.set(0.8, 0.5, 0.7);
  group.add(micStand);

  const micHeadGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const micHead = new THREE.Mesh(micHeadGeometry, micStandMaterial);
  micHead.position.set(0.8, 0.7, 0.7);
  group.add(micHead);

  return group;
}