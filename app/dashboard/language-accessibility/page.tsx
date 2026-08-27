'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe2, Volume2, TextCursorInput, RefreshCcw, Eye, ZoomIn, Contrast } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'te', label: 'Telugu' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'kn', label: 'Kannada' },
  { value: 'ml', label: 'Malayalam' },
];

export default function LanguageAccessibilityPage() {
  const [language, setLanguage] = useState('en');
  const [voiceInput, setVoiceInput] = useState(true);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedLanguage = window.localStorage.getItem('human-senses-language');
    const storedLargeText = window.localStorage.getItem('human-senses-large-text');
    const storedHighContrast = window.localStorage.getItem('human-senses-high-contrast');
    const storedVoiceInput = window.localStorage.getItem('human-senses-voice-input');
    const storedVoiceOutput = window.localStorage.getItem('human-senses-voice-output');

    if (storedLanguage) setLanguage(storedLanguage);
    if (storedLargeText) setLargeText(storedLargeText === 'true');
    if (storedHighContrast) setHighContrast(storedHighContrast === 'true');
    if (storedVoiceInput) setVoiceInput(storedVoiceInput === 'true');
    if (storedVoiceOutput) setVoiceOutput(storedVoiceOutput === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '1.125rem' : '1rem';
  }, [largeText]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const saveSettings = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('human-senses-language', language);
    window.localStorage.setItem('human-senses-large-text', String(largeText));
    window.localStorage.setItem('human-senses-high-contrast', String(highContrast));
    window.localStorage.setItem('human-senses-voice-input', String(voiceInput));
    window.localStorage.setItem('human-senses-voice-output', String(voiceOutput));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`space-y-6 ${highContrast ? 'bg-black text-white' : ''}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Language & Accessibility</h1>
          <p className="mt-1 text-muted-foreground">
            Switch language, enable voice input/output, and make the interface easier to read.
          </p>
        </div>
        <Link href="/dashboard/ai-assistant" className="text-sm text-primary hover:underline">
          Use voice navigation in the AI Health Assistant
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Language Selection</p>
              <p className="text-xs text-muted-foreground">Choose a preferred language for the interface.</p>
            </div>
          </div>
          <label className="space-y-2 text-sm text-muted-foreground">
            Select language
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-xl border border-border/50 bg-background px-3 py-3 text-sm outline-none transition focus:border-primary"
            >
              {languages.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 text-sm text-muted-foreground">
            Selected language will be used for voice interaction and text guidance where available.
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Voice Support</p>
              <p className="text-xs text-muted-foreground">Enable voice input and voice output for better accessibility.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background px-4 py-4">
              <input type="checkbox" checked={voiceInput} onChange={() => setVoiceInput(!voiceInput)} />
              <span>Enable voice input</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background px-4 py-4">
              <input type="checkbox" checked={voiceOutput} onChange={() => setVoiceOutput(!voiceOutput)} />
              <span>Enable voice output</span>
            </label>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <ZoomIn className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Readable Interface</p>
              <p className="text-xs text-muted-foreground">Make the app easier to read and navigate.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background px-4 py-4">
              <input type="checkbox" checked={largeText} onChange={() => setLargeText(!largeText)} />
              <span>Larger text mode</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background px-4 py-4">
              <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
              <span>High contrast mode</span>
            </label>
          </div>
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <TextCursorInput className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Simple Experience</p>
              <p className="text-xs text-muted-foreground">Use larger controls and easy labels for clearer navigation.</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>• Switch languages for better understanding.</li>
            <li>• Hear content read aloud when supported.</li>
            <li>• Larger text and high contrast help users with vision challenges.</li>
            <li>• This page is designed to make the platform more accessible.</li>
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={saveSettings}>Save accessibility settings</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Apply changes
        </Button>
        {saved && <span className="text-sm text-emerald-600">Settings saved.</span>}
      </div>
    </div>
  );
}
