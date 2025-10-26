"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store";
import { Smile, Paperclip, Mic, Send, Phone } from "lucide-react";

type Props = {
  apartmentId: string;
};

export default function ChatBox({ apartmentId }: Props) {
  const { user } = useAppSelector((s) => s.auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emojiList = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🥴", "😇", "🥳"];

  useEffect(() => {
    if (!apartmentId) return;

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchMessages() {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "/";
        const url = `${base.replace(/\/$/, "")}/messages/${apartmentId}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to fetch messages");
        if (mounted) setMessages(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (mounted) setError(err?.message ?? String(err));
      }
    }

    // Initial load
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));

    // Poll every 500ms
    intervalId = setInterval(fetchMessages, 500);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [apartmentId]);

  async function sendMessage() {
    if (!input.trim() || !user?.uuid) return;
    const newMsg = {
      apartmentId,
      sender: user.uuid,
      receiver: "owner",
      content: input,
    };
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "/";
      const url = `${base.replace(/\/$/, "")}/messages`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to send message");
      setMessages((prev) => [...prev, result]);
      setInput("");
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setMessages((prev) => [
        ...prev,
        {
          sender: user?.uuid,
          file: { name: file.name, url },
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }

  function handleEmoji(emoji: string) {
    setInput((v) => v + emoji);
    setShowEmojis(false);
  }

  async function handleVoiceNote() {
    if (recording) {
      mediaRecorder?.stop();
      setRecording(false);
      return;
    }
    if (!navigator.mediaDevices) {
      alert("Voice recording not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new (window as any).MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.ondataavailable = (e: any) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setMessages((prev) => [
          ...prev,
          { sender: user?.uuid, audio: url, timestamp: new Date().toISOString() },
        ]);
      };
      recorder.start();
      setRecording(true);
    } catch (err) {
      alert("Could not start recording.");
    }
  }

  function handleVoiceCall() {
    alert("Voice call feature (UI only)");
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-0 flex flex-col h-[70vh]">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="font-bold text-indigo-800 text-lg">Chat with Owner</div>
        <button onClick={handleVoiceCall} className="text-indigo-700 hover:text-indigo-900 cursor-pointer" title="Voice Call">
          <Phone size={22} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-indigo-50">
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet.</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === user?.uuid ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-xs relative ${msg.sender === user?.uuid ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border"}`}>
                <div className="absolute -top-6 left-0 text-xs text-gray-400 font-semibold">
                  {msg.sender === user?.uuid ? "You" : "Owner"}
                </div>
                {msg.content}
                {msg.file && (
                  <div className="mt-2">
                    <a href={msg.file.url} target="_blank" rel="noreferrer" className="underline">
                      {msg.file.name}
                    </a>
                  </div>
                )}
                {msg.audio && (
                  <audio src={msg.audio} controls className="mt-2 w-full" />
                )}
                <span className="block text-xs text-right mt-1 opacity-60">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t px-4 py-3 flex items-center gap-2 bg-white">
        <div className="relative">
          <button type="button" className="text-gray-500 hover:text-indigo-700 cursor-pointer" onClick={() => setShowEmojis((v) => !v)}> <Smile size={22} /> </button>
          {showEmojis && (
            <div className="absolute bottom-14 left-0 z-50 bg-white border rounded-xl shadow-lg p-4 grid grid-cols-12 gap-2 max-w-3xl max-h-80 overflow-y-auto">
              {emojiList.map((emoji, i) => (
                <button key={i} className="text-2xl hover:bg-indigo-100 rounded cursor-pointer" onClick={() => handleEmoji(emoji)}>{emoji}</button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="text-gray-500 hover:text-indigo-700 cursor-pointer" onClick={() => fileInputRef.current?.click()}> <Paperclip size={22} /> </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <button type="button" className={`text-gray-500 hover:text-indigo-700 cursor-pointer ${recording ? "animate-pulse" : ""}`} onClick={handleVoiceNote}>
          {recording ? <span className="mr-1">⏺️</span> : null}
          <Mic size={22} />
        </button>
        <input
          className="flex-1 rounded-full border px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button type="button" className="bg-indigo-700 text-white rounded-full p-2 hover:bg-indigo-800 transition cursor-pointer" onClick={sendMessage}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

