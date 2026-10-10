'use client';

import { useCallback, useEffect, useRef } from 'react';
import './ScrollExpand.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const ScrollExpand = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 46,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.4,
  smoothing = 0.08,
  overlayScrim = 0.7,
  useWindowScroll = false,
  enabled = true,
  zoomOutOnExit = false,
  expandEnd = 0.28,
  collapseStart = 0.72,
  navbarOffset = 88,
  children,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
    zoomOutOnExit,
    expandEnd,
    collapseStart,
    navbarOffset
  };

  const applyProgress = useCallback((p) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    if (!c.zoomOutOnExit) {
      // Standard one-way expansion
      const e = smoothstep(0, 1, p);
      const w = c.startWidth + (100 - c.startWidth) * e;
      const h = c.startHeight + (100 - c.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = c.startRadius + (c.endRadius - c.startRadius) * e;

      frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
      media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

      if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

      if (titleRef.current) {
        const out = smoothstep(0.3, 0.85, p);
        titleRef.current.style.opacity = `${1 - out}`;
        titleRef.current.style.transform = `translate3d(0, ${-24 * out}px, 0) scale(${1 + 0.05 * out})`;
      }

      if (hintRef.current) {
        const gone = smoothstep(0, 0.2, p);
        hintRef.current.style.opacity = `${1 - gone}`;
        hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
      }

      if (overlayRef.current) {
        const inn = smoothstep(0.6, 1, p);
        overlayRef.current.style.opacity = `${inn}`;
        overlayRef.current.style.transform = `translate3d(0, ${16 * (1 - inn)}px, 0)`;
        overlayRef.current.style.pointerEvents = inn > 0.6 ? 'auto' : 'none';
      }
      return;
    }

    // Zoom In AND Zoom Out per event
    const expEnd = c.expandEnd || 0.28;
    const colStart = c.collapseStart || 0.72;

    let e = 0; // 0 = resting card, 1 = full expanded
    let currentZoom = c.mediaZoom;
    let scrimOpacity = 0;
    let overlayOpacity = 0;
    let overlayY = 16;
    let titleOpacity = 0;
    let titleY = 0;
    let titleScale = 1;
    let hintOpacity = 0;

    if (p <= expEnd) {
      // Phase 1: Zoom In & Expand (0.0 -> expEnd)
      const tIn = smoothstep(0, expEnd, p);
      e = tIn;
      currentZoom = c.mediaZoom + (1 - c.mediaZoom) * tIn;
      scrimOpacity = c.overlayScrim * tIn;

      const tOut = smoothstep(0.04, expEnd * 0.75, p);
      titleOpacity = 1 - tOut;
      titleY = -24 * tOut;
      titleScale = 1 + 0.05 * tOut;

      const hOut = smoothstep(0, expEnd * 0.35, p);
      hintOpacity = 1 - hOut;

      const oIn = smoothstep(expEnd * 0.55, expEnd, p);
      overlayOpacity = oIn;
      overlayY = 16 * (1 - oIn);
    } else if (p <= colStart) {
      // Phase 2: Hold Full Screen (expEnd -> colStart)
      e = 1;
      currentZoom = 1;
      scrimOpacity = c.overlayScrim;
      titleOpacity = 0;
      hintOpacity = 0;
      overlayOpacity = 1;
      overlayY = 0;
    } else {
      // Phase 3: Zoom Out & Contract (colStart -> 1.0)
      const tOut = smoothstep(colStart, 1.0, p);
      e = 1 - tOut;
      currentZoom = 1 + (c.mediaZoom - 1) * tOut;
      scrimOpacity = c.overlayScrim * (1 - tOut);

      const oOut = smoothstep(colStart, colStart + (1 - colStart) * 0.45, p);
      overlayOpacity = 1 - oOut;
      overlayY = -16 * oOut;

      titleOpacity = 0;
      hintOpacity = 0;
    }

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;

    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;
    media.style.transform = `scale(${currentZoom})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${scrimOpacity}`;

    if (titleRef.current) {
      titleRef.current.style.opacity = `${titleOpacity}`;
      titleRef.current.style.transform = `translate3d(0, ${titleY}px, 0) scale(${titleScale})`;
    }

    if (hintRef.current) {
      hintRef.current.style.opacity = `${hintOpacity}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * (1 - hintOpacity)}px, 0)`;
    }

    if (overlayRef.current) {
      overlayRef.current.style.opacity = `${overlayOpacity}`;
      overlayRef.current.style.transform = `translate3d(0, ${overlayY}px, 0)`;
      overlayRef.current.style.pointerEvents = overlayOpacity > 0.5 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      const navOffset = c.useWindowScroll ? c.navbarOffset || 88 : 0;
      stageH = c.useWindowScroll
        ? window.innerHeight - navOffset
        : root.clientHeight;

      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      if (c.useWindowScroll) {
        stage.style.top = `${navOffset}px`;
      }

      const totalScrollFactor = 1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance);
      track.style.height = `${stageH * totalScrollFactor}px`;

      const w = root.clientWidth || window.innerWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.055, 22, 64)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;

      if (c.useWindowScroll) {
        const navOffset = c.navbarOffset || 88;
        const rect = track.getBoundingClientRect();
        const totalTravel = track.offsetHeight - stageH;
        if (totalTravel <= 0) return 0;

        // Scrolled distance while track top is pinned at navOffset
        const scrolled = navOffset - rect.top;
        return clamp(scrolled / totalTravel, 0, 1);
      }

      const span = stageH * Math.max(0.01, c.scrollDistance);
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
    );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
