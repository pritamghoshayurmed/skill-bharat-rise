import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Atom } from 'lucide-react';

interface Atom {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

interface Bond {
  from: number;
  to: number;
  type: 'single' | 'double' | 'triple';
}

interface Molecule {
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  description: string;
}

const MolecularViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const moleculeGroupRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();
  
  const [isRotating, setIsRotating] = useState(true);
  const [currentMolecule, setCurrentMolecule] = useState(0);

  // Sample molecules data
  const molecules: Molecule[] = [
    {
      name: "Water",
      formula: "H₂O",
      description: "The most essential molecule for life, consisting of two hydrogen atoms bonded to one oxygen atom.",
      atoms: [
        { element: "O", position: [0, 0, 0], color: "#ff0000", radius: 0.8 },
        { element: "H", position: [1.5, 1, 0], color: "#ffffff", radius: 0.4 },
        { element: "H", position: [-1.5, 1, 0], color: "#ffffff", radius: 0.4 }
      ],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' }
      ]
    },
    {
      name: "Methane",
      formula: "CH₄",
      description: "The simplest hydrocarbon, with one carbon atom bonded to four hydrogen atoms in a tetrahedral structure.",
      atoms: [
        { element: "C", position: [0, 0, 0], color: "#404040", radius: 0.7 },
        { element: "H", position: [1.2, 1.2, 1.2], color: "#ffffff", radius: 0.4 },
        { element: "H", position: [-1.2, -1.2, 1.2], color: "#ffffff", radius: 0.4 },
        { element: "H", position: [-1.2, 1.2, -1.2], color: "#ffffff", radius: 0.4 },
        { element: "H", position: [1.2, -1.2, -1.2], color: "#ffffff", radius: 0.4 }
      ],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 0, to: 2, type: 'single' },
        { from: 0, to: 3, type: 'single' },
        { from: 0, to: 4, type: 'single' }
      ]
    },
    {
      name: "Caffeine",
      formula: "C₈H₁₀N₄O₂",
      description: "A stimulant compound found in coffee, tea, and many other plants. It has a complex ring structure.",
      atoms: [
        { element: "C", position: [0, 0, 0], color: "#404040", radius: 0.7 },
        { element: "N", position: [2, 0, 0], color: "#0000ff", radius: 0.6 },
        { element: "C", position: [3, 1.5, 0], color: "#404040", radius: 0.7 },
        { element: "C", position: [1.5, 2.5, 0], color: "#404040", radius: 0.7 },
        { element: "N", position: [0, 2, 0], color: "#0000ff", radius: 0.6 },
        { element: "O", position: [4.5, 1.5, 0], color: "#ff0000", radius: 0.8 },
        { element: "O", position: [-1.5, 0, 0], color: "#ff0000", radius: 0.8 }
      ],
      bonds: [
        { from: 0, to: 1, type: 'single' },
        { from: 1, to: 2, type: 'single' },
        { from: 2, to: 3, type: 'double' },
        { from: 3, to: 4, type: 'single' },
        { from: 4, to: 0, type: 'single' },
        { from: 2, to: 5, type: 'double' },
        { from: 0, to: 6, type: 'double' }
      ]
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create molecule group
    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);
    moleculeGroupRef.current = moleculeGroup;

    // Load initial molecule
    loadMolecule(molecules[currentMolecule]);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (isRotating && moleculeGroupRef.current) {
        moleculeGroupRef.current.rotation.y += 0.01;
        moleculeGroupRef.current.rotation.x += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (moleculeGroupRef.current) {
      loadMolecule(molecules[currentMolecule]);
    }
  }, [currentMolecule]);

  const loadMolecule = (molecule: Molecule) => {
    if (!moleculeGroupRef.current) return;

    // Clear existing molecule
    while (moleculeGroupRef.current.children.length > 0) {
      moleculeGroupRef.current.remove(moleculeGroupRef.current.children[0]);
    }

    // Create atoms
    molecule.atoms.forEach((atom, index) => {
      const geometry = new THREE.SphereGeometry(atom.radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: atom.color,
        shininess: 100
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...atom.position);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.userData = { atomIndex: index, element: atom.element };
      
      moleculeGroupRef.current!.add(sphere);
    });

    // Create bonds
    molecule.bonds.forEach(bond => {
      const fromAtom = molecule.atoms[bond.from];
      const toAtom = molecule.atoms[bond.to];
      
      const from = new THREE.Vector3(...fromAtom.position);
      const to = new THREE.Vector3(...toAtom.position);
      const direction = to.clone().sub(from);
      const distance = direction.length();
      
      const geometry = new THREE.CylinderGeometry(0.1, 0.1, distance, 8);
      const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const cylinder = new THREE.Mesh(geometry, material);
      
      cylinder.position.copy(from.clone().add(to).multiplyScalar(0.5));
      cylinder.lookAt(to);
      cylinder.rotateX(Math.PI / 2);
      
      moleculeGroupRef.current!.add(cylinder);
    });
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const resetView = () => {
    if (moleculeGroupRef.current) {
      moleculeGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const nextMolecule = () => {
    setCurrentMolecule((prev) => (prev + 1) % molecules.length);
  };

  const currentMol = molecules[currentMolecule];

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Atom className="w-5 h-5" />
            3D Molecular Viewer
          </CardTitle>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Interactive
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Viewer */}
        <div 
          ref={mountRef} 
          className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-white/10"
        />
        
        {/* Molecule Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-lg">{currentMol.name}</h3>
            <Badge variant="outline" className="border-white/30 text-white">
              {currentMol.formula}
            </Badge>
          </div>
          <p className="text-white/70 text-sm">{currentMol.description}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={toggleRotation}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={resetView}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={nextMolecule}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            Next Molecule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MolecularViewer3D;
