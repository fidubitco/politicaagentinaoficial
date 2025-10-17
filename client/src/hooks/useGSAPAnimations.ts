import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPAnimations() {
  useEffect(() => {
    const timeline = gsap.timeline({ delay: 0.1 });
    const triggers: ScrollTrigger[] = [];

    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      // Hero fade-in with scale
      if (document.querySelector('.hero-section')) {
        timeline.from('.hero-section', {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power3.out',
        }, 0);
      }

      // Hero content stagger
      if (document.querySelector('.hero-badge')) {
        timeline.from('.hero-badge', {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.3);
      }

      if (document.querySelector('.hero-title')) {
        timeline.from('.hero-title', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
        }, 0.5);
      }

      if (document.querySelector('.hero-summary')) {
        timeline.from('.hero-summary', {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.7);
      }

      if (document.querySelector('.hero-meta')) {
        timeline.from('.hero-meta', {
          opacity: 0,
          y: 15,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.9);
      }

      // Ticker animation entrance
      if (document.querySelector('.ticker-container')) {
        gsap.from('.ticker-container', {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });

      // Section headers parallax effect
      const sectionHeaders = gsap.utils.toArray<HTMLElement>('.section-header');
      if (sectionHeaders.length > 0) {
        sectionHeaders.forEach((header) => {
          const trigger = ScrollTrigger.create({
            trigger: header,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
            animation: gsap.from(header, {
              y: 50,
              opacity: 0.5,
            }),
          });
          triggers.push(trigger);
        });
      }

      // Article cards stagger on scroll
      const articleCards = gsap.utils.toArray<HTMLElement>('.article-card');
      if (articleCards.length > 0) {
        articleCards.forEach((card, i) => {
          const trigger = ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            animation: gsap.from(card, {
              opacity: 0,
              y: 40,
              duration: 0.6,
              delay: i * 0.1,
              ease: 'power2.out',
            }),
          });
          triggers.push(trigger);
        });
      }

      // Sidebar widgets fade-in with slide
      const sidebarWidgets = gsap.utils.toArray<HTMLElement>('.sidebar-widget');
      if (sidebarWidgets.length > 0) {
        sidebarWidgets.forEach((widget, i) => {
          gsap.from(widget, {
            scrollTrigger: {
              trigger: widget,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            x: 30,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power2.out',
          });
        });
      }

      // Trending section reveal
      if (document.querySelector('.trending-section')) {
        gsap.from('.trending-section', {
          scrollTrigger: {
            trigger: '.trending-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // Latest articles grid stagger
      const latestCards = gsap.utils.toArray<HTMLElement>('.latest-article-card');
      if (latestCards.length > 0) {
        latestCards.forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'back.out(1.2)',
          });
        });
      }

      // Insights panel slide-up
      if (document.querySelector('.insights-panel')) {
        gsap.from('.insights-panel', {
          scrollTrigger: {
            trigger: '.insights-panel',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    return () => {
      timeline.kill();
      triggers.forEach((trigger) => trigger.kill());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

export function useCardHoverAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        y: -4,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);
}
