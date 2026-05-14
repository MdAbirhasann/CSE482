import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    connection.on('item:created', (item) => {
      setNotifications((prev) => [
        { id: crypto.randomUUID(), type: 'New Item', text: `${item.itemType.toUpperCase()}: ${item.title}`, createdAt: new Date() },
        ...prev
      ].slice(0, 8));
    });

    connection.on('claim:received', (payload) => {
      setNotifications((prev) => [
        { id: crypto.randomUUID(), type: 'Claim Request', text: `${payload.claimant.name} contacted you about ${payload.title}`, createdAt: new Date() },
        ...prev
      ].slice(0, 8));
    });

    setSocket(connection);

    return () => connection.disconnect();
  }, [token]);

  const clearNotifications = () => setNotifications([]);

  const value = useMemo(() => ({ socket, notifications, clearNotifications }), [socket, notifications]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
