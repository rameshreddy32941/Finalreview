import { Info } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <div className="mt-8 flex gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 text-xs leading-5 text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Health information notice:</span>{' '}
        HumanSenses provides educational information and screening tools. It does not provide a medical diagnosis or replace a qualified healthcare professional. For sudden, severe, or worsening symptoms, seek professional medical care promptly.
      </p>
    </div>
  );
}
