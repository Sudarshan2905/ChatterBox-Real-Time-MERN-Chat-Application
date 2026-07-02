import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import Loader from "./Loader";
import useDebounce from "../hooks/useDebounce";
import { getUsersApi, searchUsersApi } from "../services/userService";
import { useSocket } from "../context/SocketContext";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useToast } from "../context/ToastContext";

export default function Sidebar({ activeUserId, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const { onlineUsers } = useSocket();
  const { showToast } = useToast();

  const applyOnlineStatus = (list) =>
    list.map((u) => ({ ...u, isOnline: onlineUsers.includes(u._id) }));

  useEffect(() => {
    let active = true;
    setLoading(true);

    const fetchUsers = debouncedQuery.trim()
      ? searchUsersApi(debouncedQuery.trim())
      : getUsersApi();

    fetchUsers
      .then(({ data }) => {
        if (active) setUsers(data.data.users);
      })
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search by username or mobile"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-list">
        {loading ? (
          <Loader fullscreen />
        ) : users.length === 0 ? (
          <p className="chat-empty-sub" style={{ padding: 16 }}>
            No users found.
          </p>
        ) : (
          applyOnlineStatus(users).map((u) => (
            <UserCard
              key={u._id}
              user={u}
              active={u._id === activeUserId}
              onClick={() => onSelectUser(u)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
