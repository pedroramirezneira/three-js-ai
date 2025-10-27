import * as THREE from "three";

export const prefabs = [
  {
    name: "árbol",
    create: () => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1),
        new THREE.MeshStandardMaterial({ color: "#8B4513" })
      );
      trunk.position.y = 0.5;
      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: "#228B22" })
      );
      leaves.position.y = 1.5;
      group.add(trunk, leaves);
      return group;
    },
  },
  {
    name: "roca",
    create: () => {
      const mesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.5),
        new THREE.MeshStandardMaterial({ color: "#808080" })
      );
      mesh.position.y = 0.25;
      return mesh;
    },
  },
  {
    name: "arbusto",
    create: () => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshStandardMaterial({ color: "#2E8B57" })
      );
      mesh.position.y = 0.25;
      return mesh;
    },
  },
  {
    name: "cactus",
    create: () => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1),
        new THREE.MeshStandardMaterial({ color: "#228B22" })
      );
      body.position.y = 0.5;
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.4),
        new THREE.MeshStandardMaterial({ color: "#228B22" })
      );
      arm.position.set(0.15, 0.8, 0);
      arm.rotation.z = Math.PI / 2;
      group.add(body, arm);
      return group;
    },
  },
  {
    name: "caja",
    create: () => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: "#FFA500" })
      );
      mesh.position.y = 0.5;
      return mesh;
    },
  },
  {
    name: "barril",
    create: () => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.8),
        new THREE.MeshStandardMaterial({ color: "#A0522D" })
      );
      mesh.position.y = 0.4;
      return mesh;
    },
  },
  {
    name: "farol",
    create: () => {
      const group = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.5),
        new THREE.MeshStandardMaterial({ color: "#333" })
      );
      base.position.y = 0.25;
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.15),
        new THREE.MeshStandardMaterial({
          color: "#FFFF00",
          emissive: "#FFFF00",
        })
      );
      light.position.y = 0.55;
      group.add(base, light);
      return group;
    },
  },
  {
    name: "piedra plana",
    create: () => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.2, 0.8),
        new THREE.MeshStandardMaterial({ color: "#696969" })
      );
      mesh.position.y = 0.1;
      return mesh;
    },
  },
  {
    name: "señal",
    create: () => {
      const group = new THREE.Group();
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1),
        new THREE.MeshStandardMaterial({ color: "#333" })
      );
      post.position.y = 0.5;
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.25, 0.05),
        new THREE.MeshStandardMaterial({ color: "#FF0000" })
      );
      sign.position.y = 1;
      group.add(post, sign);
      return group;
    },
  },
  {
    name: "cochecito",
    create: () => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.25, 1),
        new THREE.MeshStandardMaterial({ color: "#0000FF" })
      );
      body.position.y = 0.125;
      group.add(body);
      return group;
    },
  },
];
