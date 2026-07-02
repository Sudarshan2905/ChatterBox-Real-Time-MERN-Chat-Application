import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  return (
    <header className="navbar">
      <div className="navbar-brand">💬 ChatterBox</div>
      <div className="navbar-right">
        <span className={`status-pill ${connected ? "status-online" : "status-offline"}`}>
          {connected ? "Connected" : "Offline"}
        </span>
        {user && (
          <>
            <span className="navbar-user">{user.username}</span>
            <button className="btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
