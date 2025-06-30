// components/BoltBadge.tsx
import React from "react";

const BoltBadge = () => (
  <>
    <style jsx>{`
      .bolt-badge {
        transition: all 0.3s ease;
      }
      @keyframes badgeIntro {
        0% {
          transform: rotateY(-90deg);
          opacity: 0;
        }
        100% {
          transform: rotateY(0deg);
          opacity: 1;
        }
      }
      .bolt-badge-intro {
        animation: badgeIntro 0.8s ease-out 1s both;
      }
      .bolt-badge-intro.animated {
        animation: none;
      }
      @keyframes badgeHover {
        0% {
          transform: scale(1) rotate(0deg);
        }
        50% {
          transform: scale(1.1) rotate(22deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      .bolt-badge:hover {
        animation: badgeHover 0.6s ease-in-out;
      }
    `}</style>

    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://bolt.new/?rid=os72mi"
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-all duration-300 hover:shadow-2xl"
      >
        <img
          src="https://storage.bolt.army/logotext_poweredby_360w.png"
          alt="Powered by Bolt.new badge"
          className="h-8 md:h-10 w-auto shadow-lg opacity-90 hover:opacity-100 bolt-badge bolt-badge-intro"
          onAnimationEnd={(e) => e.currentTarget.classList.add("animated")}
        />
      </a>
    </div>
  </>
);

export default BoltBadge;
