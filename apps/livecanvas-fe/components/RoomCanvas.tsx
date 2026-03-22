"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "./util";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/signin");
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    ws.onerror = () => setError("Failed to connect. Please try again.");
    ws.onclose = () => setSocket(null);

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [token, roomId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4" style={{ background: "#1e1e2e" }}>
        <div className="text-[#f38ba8] text-sm">{error}</div>
        <button
          onClick={() => { setError(null); setSocket(null); }}
          className="px-4 py-2 rounded-lg bg-[#313244] text-[#cdd6f4] text-sm hover:bg-[#45475a] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!socket || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4" style={{ background: "#1e1e2e" }}>
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#313244]" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#89b4fa] animate-spin" />
        </div>
        <span className="text-sm text-[#6c7086]">Connecting to canvas...</span>
      </div>
    );
  }

  return <Canvas roomId={roomId} socket={socket} token={token} />;
}
