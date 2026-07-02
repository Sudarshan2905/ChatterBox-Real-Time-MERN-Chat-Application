export default function UserCard({ user, active, onClick }) {
  const initial = user.username?.charAt(0)?.toUpperCase() || "?";

  return (
    <button className={`user-card ${active ? "user-card-active" : ""}`} onClick={onClick}>
      <div className="avatar">
        {initial}
        {user.isOnline && <span className="online-dot" />}
      </div>
      <div className="user-card-info">
        <span className="user-card-name">{user.username}</span>
        <span className="user-card-sub">{user.city} · {user.mobile}</span>
      </div>
    </button>
  );
}
