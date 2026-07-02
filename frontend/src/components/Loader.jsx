export default function Loader({ size = "md", fullscreen = false }) {
  const dim = { sm: 18, md: 32, lg: 48 }[size] || 32;

  const spinner = (
    <div className="loader" style={{ width: dim, height: dim }} role="status" aria-label="Loading" />
  );

  if (fullscreen) {
    return <div className="loader-fullscreen">{spinner}</div>;
  }

  return spinner;
}
