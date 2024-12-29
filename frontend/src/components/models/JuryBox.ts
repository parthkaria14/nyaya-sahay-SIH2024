import * as THREE from 'three';

export function createJuryBox() {
  const group = new THREE.Group();

  // Main jury box structure
  const boxGeometry = new THREE.BoxGeometry(4, 3, 2);
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    metalness: 0.2,
    roughness: 0.8,
  });
  
  // Base structure
  const base = new THREE.Mesh(boxGeometry, woodMaterial);
  base.position.y = 0.5;
  group.add(base);

  // Jury seats (two rows)
  const seatGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.6);
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    metalness: 0.1,
    roughness: 0.9,
  });

  // Create two rows of seats
  for (let row = 0; row < 2; row++) {
    for (let seat = 0; seat < 6; seat++) {
      const seatMesh = new THREE.Mesh(seatGeometry, seatMaterial);
      seatMesh.position.set(
        -1.5 + seat * 0.85,
        1 + row * 0.8,
        -0.5 + row * 0.7
      );
      group.add(seatMesh);
    }
  }

  // Decorative railing
  const railingGeometry = new THREE.CylinderGeometry(0.03, 0.03, 4.2, 8);
  const railingMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    metalness: 0.4,
    roughness: 0.6,
  });

  const topRailing = new THREE.Mesh(railingGeometry, railingMaterial);
  topRailing.rotation.z = Math.PI / 2;
  topRailing.position.set(0, 2.5, 1);
  group.add(topRailing);

  return group;
}