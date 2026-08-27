'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, Trash2, AlertCircle, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, ChatMessage, isSupabaseTableMissingError, getSupabaseSchemaMissingMessage } from '@/lib/supabase';
import { suggestedPrompts } from '@/lib/ai-responses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        const message = isSupabaseTableMissingError(error)
          ? getSupabaseSchemaMissingMessage(error)
          : 'Unable to load chat history.';
        setDbError(message);
        setMessages([{
          id: 'welcome',
          user_id: user.id,
          role: 'assistant',
          content: "Hello! I'm your AI Health Assistant. I can provide educational information about your five sense organs — eyes, ears, nose, tongue, and skin. Ask me about symptoms, prevention, nutrition, exercises, or when to see a doctor. How can I help you today?",
          created_at: new Date().toISOString(),
        }]);
        return;
      }

      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      } else {
        setMessages([{
          id: 'welcome',
          user_id: user.id,
          role: 'assistant',
          content: "Hello! I'm your AI Health Assistant. I can provide educational information about your five sense organs — eyes, ears, nose, tongue, and skin. Ask me about symptoms, prevention, nutrition, exercises, or when to see a doctor. How can I help you today?",
          created_at: new Date().toISOString(),
        }]);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || !user || loading) return;

    setFallbackNotice(null);
    setChatError(null);
    setInput('');
    setLoading(true);

    const userMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      user_id: user.id,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

const { error: chatInsertError } = await supabase.from('chat_history').insert({
        user_id: user.id,
        role: 'user',
        content: text,
      });
      if (chatInsertError) {
        console.warn('Chat history insert failed:', chatInsertError);
        if (isSupabaseTableMissingError(chatInsertError)) {
          setDbError(getSupabaseSchemaMissingMessage(chatInsertError));
        }
      }

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'AI service is unavailable. Please try again later.');
      }

      const result = await response.json();
      if (!result.assistant) {
        throw new Error(result?.error || 'AI service returned an invalid response.');
      }

      if (result.fallback) {
        setFallbackNotice(
          'OpenAI is currently unavailable or quota-limited, so local health guidance is being used instead.'
        );
      } else {
        setFallbackNotice(null);
      }

      const assistantMsg: ChatMessage = {
        id: 'temp-' + Date.now() + 1,
        user_id: user.id,
        role: 'assistant',
        content: result.assistant,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.assistant);
        utterance.lang = 'en-US';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
      const { error: assistantInsertError } = await supabase.from('chat_history').insert({
        user_id: user.id,
        role: 'assistant',
        content: result.assistant,
      });
      if (assistantInsertError) {
        console.warn('Assistant chat history insert failed:', assistantInsertError);
        if (isSupabaseTableMissingError(assistantInsertError)) {
          setDbError(getSupabaseSchemaMissingMessage(assistantInsertError));
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI service is unavailable. Please try again later.';
      setChatError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use text input.');
      return;
    }

    const SpeechRecognition = (window as Record<string, any>).SpeechRecognition || (window as Record<string, any>).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleClearHistory = async () => {
    if (!user) return;
    await supabase.from('chat_history').delete().eq('user_id', user.id);
    setMessages([{
      id: 'welcome',
      user_id: user.id,
      role: 'assistant',
      content: "Chat history cleared. How can I help you today?",
      created_at: new Date().toISOString(),
    }]);
  };

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Health Assistant</h1>
            <p className="text-xs text-muted-foreground">Educational guidance for your senses, with built-in voice input and audio response.</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearHistory} className="gap-1 text-muted-foreground">
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5 text-xs text-muted-foreground">
        <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
        This AI assistant provides health education only, not medical diagnoses. Always consult a healthcare professional.
      </div>

      {dbError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {dbError}
        </div>
      )}

      {/* Chat */}
      <Card className="glass flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'
              }`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-secondary px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {chatError && (
          <div className="border-t border-border/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {chatError}
          </div>
        )}

        {fallbackNotice && (
          <div className="border-t border-border/50 bg-primary/5 px-4 py-3 text-sm text-primary">
            {fallbackNotice}
          </div>
        )}

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="border-t border-border/50 p-3">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoiceInput}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                listening ? 'bg-destructive text-destructive-foreground animate-pulse-glow' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your senses..."
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={() => handleSend()} disabled={loading || !input.trim()} size="icon" className="h-10 w-10 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
