export function PoweredBy() {
  return (
    <div className="powered-by">
      <span>Powered by</span>
      <img
        src={`${import.meta.env.BASE_URL}SILUETA NEGRA.png`}
        alt="Logo"
        className="powered-by-logo"
      />
    </div>
  )
}
