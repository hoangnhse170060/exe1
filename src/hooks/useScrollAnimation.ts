import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const animateElements = document.querySelectorAll('.scroll-animate');

      animateElements.forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      const parallaxElements = document.querySelectorAll('.parallax-text');

      parallaxElements.forEach((element) => {
        gsap.to(element, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      const fadeElements = document.querySelectorAll('.fade-scroll');

      fadeElements.forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );
      });

      const revealElements = document.querySelectorAll('.text-reveal');

      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: '100%',
            opacity: 0,
          },
          {
            y: '0%',
            opacity: 1,
            duration: 1.5,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
};

export const useTextReveal = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref]);
};

export const useParallaxText = (ref: React.RefObject<HTMLElement>, distance: number = 100) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.to(element, {
        y: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, distance]);
};
