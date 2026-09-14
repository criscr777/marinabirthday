import React from "react";

const videos = [
  {
    title: "a little memory",
    src: "/videos/IMG_4020.MOV",
  },
  {
    title: "another memory",
    src: "/videos/video2.mp4",
  },
];

export default function VideoSection() {
  return (
    <section className="video-section" aria-label="Vídeos">
      <div className="video-section__intro">
        <span>OUR MEMORIES</span>
        <h2>some moments worth keeping</h2>
      </div>

      <div className="video-section__grid">
        {videos.map((video) => (
          <article className="video-card" key={video.src}>
            <div className="video-card__label">{video.title}</div>
            <video
              className="video-card__player"
              controls
              playsInline
              preload="metadata"
            >
              <source src={video.src} />
              Seu navegador não consegue reproduzir este vídeo.
            </video>
          </article>
        ))}
      </div>
    </section>
  );
}
