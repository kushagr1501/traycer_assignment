
import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function FloatingCrystal() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.15;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.8, 0]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    roughness={0}
                    metalness={1}
                    transmission={0.2}
                    thickness={2}
                    envMapIntensity={2}
                    clearcoat={1}
                />
            </mesh>

        </Float>
    );
}

export function LandingPage({ onEnter }: { onEnter: () => void }) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(titleRef.current,
            { y: 100, opacity: 0, skewY: 7 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.5, delay: 0.5 }
        )
            .fromTo(subRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 0.7, duration: 1 },
                "-=1"
            )
            .fromTo(buttonRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8 },
                "-=0.5"
            );

    }, []);

    const handleEnter = () => {
        onEnter();
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center">


            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <Environment preset="dawn" />
                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#818cf8" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#c084fc" />

                    <FloatingCrystal />
                </Canvas>
            </div>

            <div className="z-10 text-center px-6 relative">
                <div className="overflow-hidden mb-6">
                    <h1 ref={titleRef} className="text-7xl md:text-9xl font-bold tracking-tighter text-white mix-blend-difference">
                        TRAYCER
                    </h1>
                </div>

                <p ref={subRef} className="text-lg md:text-xl text-gray-400 font-mono tracking-[0.2em] uppercase mb-12">
                    The Planning Layer for Autonomous Agents
                </p>

                <button
                    ref={buttonRef}
                    onClick={handleEnter}
                    className="group relative px-8 py-4 bg-transparent border border-white/20 rounded-none overflow-hidden hover:border-white/50 transition-colors cursor-pointer"
                >
                    <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10 font-mono text-sm tracking-widest text-white group-hover:text-black transition-colors duration-300">
                        ENTER_SYSTEM
                    </span>
                </button>
            </div>

        </div>
    );
}
