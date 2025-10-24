'use client'

import { useState, useRef } from "react";
import { Smile, Paperclip, Mic, Send, Phone } from "lucide-react";

const mockMessages = [
  { from: "me", text: "Hi, I'm interested in your apartment! 😊", time: "09:00" },
  { from: "owner", text: "Hello! Thanks for reaching out. How can I help you?", time: "09:01" },
];

export default function ChatBox({ apartmentId }: { apartmentId: string }) {
  const [messages, setMessages] = useState<any[]>(mockMessages);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiList = ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","🥱","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","☹️","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","🥵","🥶","😳","🤪","😵","😡","😠","🤬","😷","🤒","🤕","🤢","🤮","🥴","😇","🥳"];

  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setMessages([
        ...messages,
        {
          from: "me",
          file: { name: file.name, url },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }

  function handleEmoji(emoji: string) {
    setInput(input + emoji);
    setShowEmojis(false);
  }

  async function handleVoiceNote() {
    if (recording) {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setRecording(false);
      return;
    }
    if (!navigator.mediaDevices) {
      alert("Voice recording not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.ondataavailable = (e: any) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setMessages((prev) => [...prev, { from: "me", audio: url, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
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
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-2xl px-4 py-2 max-w-xs ${msg.from === "me" ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border"}`}>
              {msg.audio ? (
                <audio controls src={msg.audio} className="w-full mt-1" />
              ) : msg.file ? (
                <div>
                  <span className="block text-sm mb-1">📎 Uploaded file:</span>
                  <a href={msg.file.url} download={msg.file.name} className="underline text-indigo-200 hover:text-indigo-100 break-all" target="_blank" rel="noopener noreferrer">{msg.file.name}</a>
                </div>
              ) : (
                msg.text
              )}
              <span className="block text-xs text-right mt-1 opacity-60">{msg.time}</span>
            </div>
          </div>
        ))}
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
