import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import AuthSection from "@/components/AuthSection";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import ChatbotScript from "@/components/ChatbotScript";
import { motion } from "framer-motion";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsLoaded(true);

    // Intersection Observer for animations
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animation-trigger").forEach((el) => {
      el.classList.remove("fade-in");
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Initialize Three.js scene
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add a sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: theme === "dark" ? "teal" : "orange",
      roughness: 0.5,
      metalness: 0.5,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.01; // Auto-rotate the sphere
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      className={`min-h-screen overflow-hidden relative ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 to-gray-950"
          : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      {/* 3D Animation Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      ></canvas>

      {/* Animated gradient overlay */}
      <div
        className={`fixed inset-0 z-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-900/90"
            : "bg-gradient-to-br from-white/90 via-white/70 to-white/90"
        }`}
      ></div>

      {/* Main content */}
      <div
        className={`relative z-10 transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <AuthSection />
        <Footer />
      </div>

      {/* Add Chatbot */}
      <ChatbotScript />
    </div>
  );
};

export default Index;
