"use client";
import { useEffect, useRef, useState } from "react";

/** Nút tròn nổi + khung chat thu gọn/mở rộng, tự linkify URL trong tin nhắn */
export default function ChatBox() {
  // --- hiển thị ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Mở chat theo trạng thái đã lưu (nếu cần)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("vietsneaker_chat_open") : null;
    if (saved === "true") setIsOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vietsneaker_chat_open", String(isOpen));
    }
  }, [isOpen]);

  // Auto scroll khi có tin nhắn
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Esc để đóng
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---- helper: biến text thành JSX có <a> và giữ xuống dòng ----
  const renderWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // bắt mọi http/https đến trước khoảng trắng
    const lines = text.split(/\r?\n/);

    return lines.map((line, li) => {
      const parts = line.split(urlRegex);
      return (
        <div key={`ln-${li}`}>
          {parts.map((p, i) =>
            p.startsWith("http://") || p.startsWith("https://") ? (
              <a
                key={`ln-${li}-p-${i}`}
                href={p}
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-500 break-all"
              >
                {p}
              </a>
            ) : (
              <span key={`ln-${li}-p-${i}`}>{p}</span>
            )
          )}
        </div>
      );
    });
  };

  // ---- gửi tin nhắn ----
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // nếu bạn dùng cookie
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const reply = await res.text();

      const botMsg = { sender: "ai" as const, text: reply || "Mình chưa có câu trả lời phù hợp." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // Nút nổi (launcher)
  const Launcher = () => (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Mở trò chuyện"
      className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center z-50 transition-all"
    >
      {/* Biểu tượng chat (SVG) */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM6 9h8v2H6V9Zm0-4h12v2H6V5Z"/>
      </svg>
      {/* chấm xanh thông báo (tuỳ chọn): ẩn khi đã mở */}
      {!isOpen && messages.length > 0 && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
      )}
    </button>
  );

  return (
    <>
      {!isOpen && <Launcher />}

      {/* Panel chat */}
      <div
        className={`fixed bottom-5 right-5 z-50 w-80 max-w-[90vw] transition-all duration-200 ${
          isOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-semibold text-blue-600">💬 Trợ lý VietSneaker</h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng trò chuyện"
              className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500"
              title="Đóng (Esc)"
            >
              {/* icon X */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.3 5.71 12 12.01l6.3 6.29-1.41 1.41-6.3-6.29-6.29 6.29-1.41-1.41 6.29-6.29-6.29-6.3L4.3 4.3l6.29 6.3 6.3-6.29 1.41 1.41Z"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="h-72 overflow-y-auto px-3 py-2">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 mb-2">Xin chào! Bạn cần giúp gì hôm nay?</p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-1 text-sm leading-relaxed ${
                  m.sender === "user" ? "text-right text-blue-700" : "text-left text-gray-800"
                }`}
              >
                {renderWithLinks(m.text)}
              </div>
            ))}

            {loading && <p className="text-gray-400 text-sm">Đang phản hồi...</p>}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-2 border-t bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 flex-1 rounded-l-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className={`px-4 rounded-r-lg text-white text-sm ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
