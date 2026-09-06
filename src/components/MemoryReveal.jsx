import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import InteractionGate from './InteractionGate';

const MemoryReveal = ({ config, onComplete }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  
  const memories = config?.memories || [];

  // Preload images
  useEffect(() => {
    if (memories.length === 0) {
      onComplete(); // Skip if no memories
      return;
    }

    let loaded = 0;
    let errors = 0;

    memories.forEach(mem => {
      const img = new Image();
      img.src = mem.image;
      img.onload = () => {
        loaded++;
        if (loaded + errors === memories.length) setImagesLoaded(loaded);
      };
      img.onerror = () => {
        errors++;
        if (loaded + errors === memories.length) setImagesLoaded(loaded);
      };
    });
  }, [memories, onComplete]);

  useEffect(() => {
    if (memories.length === 0 || imagesLoaded === 0) {
      if (imagesLoaded === 0 && memories.length > 0) {
        // Only trigger completion if all errored out after attempting to load
        const timer = setTimeout(onComplete, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Title & Subtitle
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        0.5
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        1.5
      );

      // Staggered cards
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const randomRot = (Math.random() - 0.5) * 10;
        
        tl.fromTo(card,
          { opacity: 0, scale: 0.8, rotation: randomRot - 10, y: 50 },
          { opacity: 1, scale: 1, rotation: randomRot, y: 0, duration: 1, ease: 'back.out(1.2)' },
          2.5 + (i * 0.8)
        );
      });

      tl.call(() => setAnimDone(true));

    }, containerRef);

    return () => ctx.revert();
  }, [imagesLoaded, memories.length, onComplete]);

  const handleInteract = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      onComplete
    });
  };

  if (memories.length === 0) return null;

  return (
    <InteractionGate active={animDone} sceneKey="MEMORY_REVEAL" buttonText="[ XEM ĐIỀU BẤT NGỜ CUỐI CÙNG ]" onInteract={handleInteract}>
      <div ref={containerRef} style={styles.wrapper}>
        <div style={styles.header}>
          <div ref={titleRef} style={styles.title}>ĐÂY ĐÂY ĐÂY RỒIIIII...</div>
          <div ref={subtitleRef} style={styles.subtitle}>Mấy tấm ni mà không đem đi triển lãm hơi phí 😂</div>
        </div>

        <div style={styles.cardsContainer}>
          {memories.map((mem, i) => (
            <div 
              key={i} 
            ref={el => cardsRef.current[i] = el}
            style={{
              ...styles.card,
              zIndex: i + 1,
              marginLeft: i > 0 ? '-30px' : '0' // overlap slightly
            }}
          >
            <div style={styles.imageWrapper}>
              <img 
                src={mem.image} 
                alt="Memory" 
                style={styles.image} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#2a2a2a';
                }}
              />
            </div>
            {mem.caption && <div style={styles.caption}>{mem.caption}</div>}
          </div>
          ))}
        </div>
      </div>
    </InteractionGate>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(7, 8, 12, 0.8)', // Slight dimming
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    zIndex: 10,
  },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
    color: '#F6C85F',
    letterSpacing: '3px',
    marginBottom: '1rem',
    opacity: 0,
  },
  subtitle: {
    fontFamily: '"Inter", sans-serif',
    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
    opacity: 0,
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '20px',
    maxWidth: '900px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '12px 12px 24px 12px',
    borderRadius: '4px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    opacity: 0,
    width: 'clamp(150px, 30vw, 250px)',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1 / 1',
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  caption: {
    fontFamily: '"Inter", sans-serif',
    color: '#333',
    fontSize: '0.85rem',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 500,
  }
};

export default MemoryReveal;
