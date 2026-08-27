'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const scanProfiles = {
  eyes: {
    title: 'Eye Scan',
    condition: 'Possible redness or irritation',
    specialist: 'Ophthalmologist',
    advice: 'Avoid rubbing your eyes and use clean water to rinse. Seek care if pain or vision changes persist.',
    urgentNote: 'If you notice sudden vision changes, severe pain, or discharge, seek care immediately.',
  },
  ears: {
    title: 'Ear Scan',
    condition: 'Possible ear canal irritation or wax buildup',
    specialist: 'ENT specialist',
    advice: 'Avoid inserting objects into your ear. Keep ears dry and see a professional if you experience pain, hearing changes, or discharge.',
    urgentNote: 'If you have sudden hearing loss, severe pain, or fluid from the ear, seek prompt care.',
  },
  nose: {
    title: 'Nose Scan',
    condition: 'Possible nasal inflammation or sinus irritation',
    specialist: 'ENT specialist',
    advice: 'Keep nasal passages hydrated with saline rinses and avoid irritants. See a doctor if congestion or pressure persists.',
    urgentNote: 'If you have severe facial pain, persistent bleeding, or difficulty breathing, seek medical attention quickly.',
  },
  oral: {
    title: 'Oral/Tongue Scan',
    condition: 'Possible mouth irritation or tongue discoloration',
    specialist: 'Dentist or oral specialist',
    advice: 'Maintain good oral hygiene, stay hydrated, and see a dentist if sores or unusual patches persist.',
    urgentNote: 'If you notice persistent pain, bleeding, or unusual growths, seek dental care soon.',
  },
  skin: {
    title: 'Skin Scan',
    condition: 'Possible rash or irritation',
    specialist: 'Dermatologist',
    advice: 'Keep the area clean, avoid harsh products, and monitor for changes. See a dermatologist if a rash persists or a spot changes shape or color.',
    urgentNote: 'If a lesion changes rapidly, bleeds, or becomes painful, seek medical attention.',
  },
};

export default function CameraScanPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [scanResult, setScanResult] = useState<null | {
    confidence: number;
    condition: string;
    specialist: string;
    advice: string;
    urgent: boolean;
    urgentNote: string;
    title: string;
  }>(null);
  const [fileName, setFileName] = useState('');
  const [selectedOrgan, setSelectedOrgan] = useState<'eyes' | 'ears' | 'nose' | 'oral' | 'skin'>('eyes');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setScanResult(null);
    setImageUrl(URL.createObjectURL(file));
  };

  const runScan = () => {
    if (!imageUrl) return;
    const profile = scanProfiles[selectedOrgan];
    const confidence = Math.floor(72 + Math.random() * 18);
    const urgent = confidence >= 85;

    setScanResult({
      confidence,
      condition: profile.condition,
      specialist: profile.specialist,
      advice: profile.advice,
      urgent,
      urgentNote: profile.urgentNote,
      title: profile.title,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Camera Scan</h1>
          <p className="mt-1 text-muted-foreground">
            Capture or upload an image of a sense organ and get a quick AI-powered scan summary.
          </p>
        </div>
        <Link href="/dashboard/ai-assistant" className="text-sm text-primary hover:underline">
          Use the AI Health Assistant for voice-enabled access
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Camera Scan</p>
              <p className="text-xs text-muted-foreground">Choose an organ and upload an image for a specialized scan summary.</p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {([
              { id: 'eyes', label: 'Eyes' },
              { id: 'ears', label: 'Ears' },
              { id: 'nose', label: 'Nose' },
              { id: 'oral', label: 'Tongue/Oral' },
              { id: 'skin', label: 'Skin' },
            ] as const).map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOrgan(option.id)}
                className={`rounded-3xl border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedOrgan === option.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-1 mt-4">
            <label className="space-y-2 text-sm text-muted-foreground">
              Upload or capture an image
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-border/50 bg-background px-3 py-3 text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={runScan} disabled={!imageUrl}>
              Scan image
            </Button>
            <Button variant="outline" onClick={() => {
              setImageUrl('');
              setScanResult(null);
              setFileName('');
            }}>
              Clear
            </Button>
          </div>

          {fileName && <p className="mt-4 text-sm text-muted-foreground">Selected file: {fileName}</p>}
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{scanProfiles[selectedOrgan].title} Guidance</p>
              <p className="text-xs text-muted-foreground">Upload a photo for the selected organ to get a quick AI-powered scan summary.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-border/50 bg-background p-4 text-sm text-muted-foreground">
            {scanResult ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Condition</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{scanResult.condition}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Confidence</p>
                  <p className="mt-2 text-base font-semibold">{scanResult.confidence}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recommended specialist</p>
                  <p className="mt-2 text-base font-semibold">{scanResult.specialist}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">First aid advice</p>
                  <p className="mt-2 text-sm leading-6">{scanResult.advice}</p>
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm ${scanResult.urgent ? 'bg-destructive/10 text-destructive' : 'bg-emerald-50 text-emerald-700'}`}>
                  {scanResult.urgent
                    ? scanResult.urgentNote
                    : 'This result is a preliminary guide only. See a doctor if you feel unsure.'}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Camera className="h-6 w-6" />
                </div>
                <p>Upload an image and press Scan to view a suggested result.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {imageUrl && (
        <Card className="glass p-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="relative h-[420px] rounded-3xl overflow-hidden border border-border/50 bg-background">
            <img src={imageUrl} alt="Uploaded scan" className="h-full w-full object-cover" />
          </div>
        </Card>
      )}
    </div>
  );
}
