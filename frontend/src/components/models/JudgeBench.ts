import * as THREE from 'three';

export function createJudgeBench() {
  const group = new THREE.Group();

  // Main bench structure
  const benchGeometry = new THREE.BoxGeometry(5, 2, 2);
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    metalness: 0.2,
    roughness: 0.8,
  });
  
  const bench = new THREE.Mesh(benchGeometry, woodMaterial);
  bench.position.y = 1;
  group.add(bench);

  // Decorative front panel
  const panelGeometry = new THREE.BoxGeometry(5, 1.8, 0.1);
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    metalness: 0.3,
    roughness: 0.7,
  });
  
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.set(0, 1, 0.95);
  group.add(panel);

  // Judge's chair
  const chairGeometry = new THREE.BoxGeometry(1.2, 2, 1);
  const chairMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c1810,
    metalness: 0.1,
    roughness: 0.9,
  });
  
  const chair = new THREE.Mesh(chairGeometry, chairMaterial);
  chair.position.set(0, 1.5, -0.5);
  group.add(chair);

  // Gavel stand
  const gavelStandGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.2, 8);
  const gavelStandMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    metalness: 0.4,
    roughness: 0.6,
  });
  
  const gavelStand = new THREE.Mesh(gavelStandGeometry, gavelStandMaterial);
  gavelStand.position.set(-1.5, 2.1, 0);
  group.add(gavelStand);

  return group;
}