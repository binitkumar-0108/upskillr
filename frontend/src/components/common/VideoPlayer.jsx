export default function VideoPlayer({ youtubeId, title }) {
  if (!youtubeId) {
    return (
      <div className="youtube-container flex items-center justify-center">
        <p className="text-sm text-ink-muted absolute">No video available</p>
      </div>
    );
  }
  return (
    <div className="youtube-container">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title || 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
