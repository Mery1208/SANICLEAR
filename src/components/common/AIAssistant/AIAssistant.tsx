import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, User, Sparkles, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiResponse } from '../../../services/gemini';
import './AIAssistant.css';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: '### ¡Bienvenido a SANICLEARS! 🤖\n\nSoy **SaniclearBot**, tu asistente experto. He procesado toda la **documentación técnica del TFG** y estoy listo para ayudarte.\n\n¿En qué puedo asistirte hoy?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

   
    const history = messages
      .filter((msg, index) => index !== 0 || msg.role === 'user') 

      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

    const response = await getGeminiResponse(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="ai-assistant-container">
      <button 
        className="ai-bubble-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente de IA"
      >
        <img src="/bot-icon.png" alt="Bot" className="w-full h-full object-cover" />
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="bg-white/10 p-1.5 rounded-xl border border-white/20">
                <img src="/bot-icon.png" alt="Bot Icon" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm m-0 tracking-tight">SaniclearBot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="ai-status-dot"></span>
                  <span className="text-[10px] text-blue-200/70 uppercase tracking-widest font-bold">Base de Conocimiento Activa</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-300" />
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-bot'}`}
              >
                <div className="ai-message-content">
                  {msg.role === 'model' && (
                    <div className="bg-slate-100 p-1 rounded-lg mb-2 inline-block">
                      <img src="/bot-icon.png" alt="AI" className="w-5 h-5 object-contain" />
                    </div>
                  )}
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex justify-end mt-2">
                      <div className="bg-blue-400/20 p-1 rounded-md">
                        <User size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-message ai-message-bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-container">
            <input
              type="text"
              className="ai-chat-input"
              placeholder="Pregunta sobre la arquitectura, manuales..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <button 
              className="ai-send-button"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Datos Grounded en SANICLEARS_TFG_1.md</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
