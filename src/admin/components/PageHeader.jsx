export default function PageHeader({ titulo, subtitulo, children }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 no-print">
      <div>
        <h2 className="h3 fw-bold mb-0">{titulo}</h2>
        {subtitulo && <p className="text-muted mb-0">{subtitulo}</p>}
      </div>
      <div className="d-flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
