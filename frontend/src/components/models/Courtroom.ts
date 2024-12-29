import * as THREE from 'three';

export function createCourtroom(isDarkMode = false) {
  const courtroom = new THREE.Group();

  // Helper function to convert CSS variables to a THREE color
  const getColor = (cssVar: string) => {
    const rgb = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim()
      .split(' ')
      .map((v) => parseFloat(v) / 255);
    return new THREE.Color(rgb[0], rgb[1], rgb[2]);
  };

  // Define colors dynamically based on light/dark mode
  const floorColor = getColor(isDarkMode ? '--neutral-800' : '--primary-300');
  const wallColor = getColor(isDarkMode ? '--neutral-700' : '--primary-200');
  const woodColor = getColor(isDarkMode ? '--primary-700' : '--primary-400');
  const lampColor = getColor(isDarkMode ? '--success-600' : '--success-500');

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(40, 40);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: floorColor });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  courtroom.add(floor);

  // Walls
  const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(40, 15, 1), wallMaterial);
  backWall.position.set(0, 7.5, -20);
  courtroom.add(backWall);

  const sideWall1 = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 40), wallMaterial);
  sideWall1.position.set(-20, 7.5, 0);
  courtroom.add(sideWall1);

  const sideWall2 = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 40), wallMaterial);
  sideWall2.position.set(20, 7.5, 0);
  courtroom.add(sideWall2);

  // Judge's Bench
  const benchGeometry = new THREE.BoxGeometry(10, 3, 3);
  const benchMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
  const judgeBench = new THREE.Mesh(benchGeometry, benchMaterial);
  judgeBench.position.set(0, 1.5, -18);
  judgeBench.castShadow = true;
  courtroom.add(judgeBench);

  // Judge Figure
  const judgeGeometry = new THREE.SphereGeometry(1, 32, 32);
  const judgeMaterial = new THREE.MeshStandardMaterial({ color: getColor('--neutral-900') });
  const judge = new THREE.Mesh(judgeGeometry, judgeMaterial);
  judge.position.set(0, 4.5, -18);
  judge.castShadow = true;
  courtroom.add(judge);

  // Witness Stand
  const witnessStandGeometry = new THREE.BoxGeometry(4, 2, 3);
  const witnessStandMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
  const witnessStand = new THREE.Mesh(witnessStandGeometry, witnessStandMaterial);
  witnessStand.position.set(-10, 1, -12);
  witnessStand.castShadow = true;
  courtroom.add(witnessStand);

  // Jury Box
  const juryBoxGeometry = new THREE.BoxGeometry(8, 2, 5);
  const juryBoxMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
  const juryBox = new THREE.Mesh(juryBoxGeometry, juryBoxMaterial);
  juryBox.position.set(10, 1, -12);
  juryBox.castShadow = true;
  courtroom.add(juryBox);

  // Audience Area
  const audienceBenchGeometry = new THREE.BoxGeometry(10, 1, 3);
  const audienceBenchMaterial = new THREE.MeshStandardMaterial({ color: woodColor });
  for (let i = 0; i < 3; i++) {
    const audienceBench = new THREE.Mesh(audienceBenchGeometry, audienceBenchMaterial);
    audienceBench.position.set(0, 0.5, -6 + i * 4);
    audienceBench.castShadow = true;
    courtroom.add(audienceBench);
  }

  // Add decorations (e.g., lamps, textures)
  const lamp = new THREE.PointLight(lampColor, 0.5, 50);
  lamp.position.set(0, 10, -10);
  courtroom.add(lamp);

  return courtroom;
}
