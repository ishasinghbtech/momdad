// import React, { useState, useEffect, useRef } from "react";
import React from "react";
import { useState, useEffect, useRef } from "react";
// Heart shaped confetti particle using canvas approach
// We'll build a simple confetti animation with hearts using canvas, triggered on click.

// Sample images array (replace with actual URLs or imports)
const images = [
  '/src/assets/images/img1.jpg',
  '/src/assets/images/img2.jpeg'
];

// Date to countdown to
const targetDate = new Date("2025-06-15T23:22:00");

function pluralize(unit, count) {
  return count === 1 ? unit : unit + "s";
}

function Countdown({ target }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return null;
  }

  return (
    <div style={styles.countdownContainer} aria-label="Countdown timer">
      <h1 style={styles.celebrationText}>Counting down to Your Anniversary</h1>
      <div style={styles.timerGrid}>
        <div style={styles.timerCell}>
          <span style={styles.timeValue}>{timeLeft.days}</span>
          <span style={styles.timeLabel}>{pluralize("Day", timeLeft.days)}</span>
        </div>
        <div style={styles.timerCell}>
          <span style={styles.timeValue}>{timeLeft.hours}</span>
          <span style={styles.timeLabel}>{pluralize("Hour", timeLeft.hours)}</span>
        </div>
        <div style={styles.timerCell}>
          <span style={styles.timeValue}>{timeLeft.minutes}</span>
          <span style={styles.timeLabel}>{pluralize("Minute", timeLeft.minutes)}</span>
        </div>
        <div style={styles.timerCell}>
          <span style={styles.timeValue}>{timeLeft.seconds}</span>
          <span style={styles.timeLabel}>{pluralize("Second", timeLeft.seconds)}</span>
        </div>
      </div>
      <p style={styles.noteText}>The surprise unlocks when the countdown reaches zero!</p>
    </div>
  );
}

// Heart confetti particle class
class HeartParticle {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;

    this.size = Math.random() * 10 + 10;
    this.life = 100 + Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = Math.random() * -3 - 2;
    this.opacity = 1;
    this.angle = Math.random() * 2 * Math.PI;
    this.angularVelocity = (Math.random() - 0.5) * 0.2;
  }

  drawHeart(x, y, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(
      x, y,
      x - size / 2, y,
      x - size / 2, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x - size / 2, y + (size + topCurveHeight) / 2,
      x, y + (size + topCurveHeight) / 1.5,
      x, y + size
    );
    ctx.bezierCurveTo(
      x, y + (size + topCurveHeight) / 1.5,
      x + size / 2, y + (size + topCurveHeight) / 2,
      x + size / 2, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x + size / 2, y,
      x, y,
      x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= 0.015;
    this.vy += 0.05; // gravity
    this.angle += this.angularVelocity;
    this.life -= 1;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = `rgba(237,73,86, ${this.opacity})`; // Heart red color
    this.drawHeart(0, 0, this.size);
    ctx.restore();
  }
}

function ConfettiCanvas({ trigger }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", resize);

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.current.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.life <= 0 || p.opacity <= 0) {
          particles.current.splice(index, 1);
        }
      });
      animationFrameId.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    if (!trigger) return;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // Emit confetti from random positions near center
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      particles.current.push(new HeartParticle(x, y, canvasRef.current.getContext("2d")));
    }
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
      }}
      aria-hidden="true"
    />
  );
}

function Slideshow({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds per slide

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, images.length]);

  return (
    <div style={styles.slideshowContainer} aria-label="Parents anniversary photo slideshow">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Parents anniversary photo ${i + 1}`}
          style={{
            ...styles.slideImage,
            opacity: i === currentIndex ? 1 : 0,
            zIndex: i === currentIndex ? 2 : 1,
          }}
          loading="lazy"
        />
      ))}
      <div style={styles.slideshowFooter}>
        <p style={{ color: "#eee", margin: 0 }}>
          Photo {currentIndex + 1} of {images.length}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check countdown unlock status immediately, then every 1 second
    function checkUnlock() {
      const now = new Date();
      if (now >= targetDate) {
        setUnlocked(true);
      }
    }
    checkUnlock();
    const intervalId = setInterval(checkUnlock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (unlocked && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked, user interaction required to start sound
      });
    }
  }, [unlocked]);

  function handleUserInteraction() {
    // Trigger confetti on any user click/tap
    setConfettiTrigger((prev) => !prev);

    // Unmute audio on user interaction (if paused)
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
    }
  }

  return (
    <div
      style={styles.appContainer}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      role="main"
      tabIndex={-1}
    >
      {!unlocked ? (
        <Countdown target={targetDate} />
      ) : (
        <>
          <h1 style={styles.celebrationText}>Happy Anniversary!</h1>
          <Slideshow images={images} />
          <audio
            ref={audioRef}
            src="momdad/src/assets/audio/song.mp3"
            loop
            autoPlay
            muted
            preload="auto"
            aria-label="Background music for anniversary celebration"
          />
          <ConfettiCanvas trigger={confettiTrigger} />
        </>
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    background: "linear-gradient(135deg, #fce7f3 0%, #cbd5e1 100%)",
    minHeight: "100vh",
    color: "#6b21a8",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    overflowX: "hidden",
  },
  countdownContainer: {
    background: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    padding: "48px 32px",
    boxShadow: "0 8px 24px rgba(107, 33, 168, 0.2)",
    maxWidth: 440,
    textAlign: "center",
    userSelect: "none",
  },
  timerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginTop: 24,
  },
  timerCell: {
    background: "white",
    borderRadius: 16,
    padding: "12px 0",
    boxShadow: "0 4px 12px rgba(107, 33, 168, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  timeValue: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 1,
    color: "#7c3aed",
  },
  timeLabel: {
    fontSize: 14,
    color: "#a78bfa",
    fontWeight: "600",
    marginTop: 4,
  },
  celebrationText: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 24,
    textAlign: "center",
    color: "#7c3aed",
    textShadow: "0 2px 8px rgba(124, 58, 237, 0.4)",
  },
  noteText: {
    marginTop: 24,
    fontSize: 14,
    color: "#6b21a8",
    opacity: 0.7,
  },
  slideshowContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 800,
    height: 500,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 12px 48px rgba(107, 33, 168, 0.25)",
    marginTop: 24,
  },
  slideImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 24,
    top: 0,
    left: 0,
    transition: "opacity 1s ease-in-out",
  },
  slideshowFooter: {
    position: "absolute",
    bottom: 12,
    right: 20,
    background: "rgba(124, 58, 237, 0.7)",
    borderRadius: 16,
    padding: "6px 16px",
    fontSize: 14,
    userSelect: "none",
  },
};

