import { create } from 'zustand';
import './App.css';
import { Suspense, useEffect } from 'react';
import Lenis from 'lenis';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';

export const useStore = create((set) => ({
  lenisInstance: null,
  setLenisInstance: (lenisInstance) => set({ lenisInstance }),
  isLoaded: true,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  isEnterAnimation: false,
}));

function App() {
  const setLenisInstance = useStore((state) => state.setLenisInstance);
  const lenisInstance = useStore((state) => state.lenisInstance);
  const isLoaded = useStore((state) => state.isLoaded);
  const isEnterAnimation = useStore((state) => state.isEnterAnimation);

  useEffect(() => {
    const lenis = new Lenis();
    setLenisInstance(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      lenisInstance?.stop();
    } else {
      lenisInstance?.start();
    }
  }, [isLoaded, lenisInstance]);

  useEffect(() => {
    if (isEnterAnimation) {
      lenisInstance?.scrollTo('top', {
        immediate: true,
        force: true,
      });
    }
  }, [isEnterAnimation]);

  return (
    <>
      <div className="canvasWrapper fixed top-0 h-screen w-full">
        <Canvas dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
