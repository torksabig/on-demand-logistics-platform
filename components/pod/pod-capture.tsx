'use client'

import { useRef, useState } from 'react'
import { Camera, Check, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PodCapture({
  onCapture,
}: {
  onCapture: (recipientName: string, photoDataUrl?: string) => void
}) {
  const [recipientName, setRecipientName] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display text-base font-semibold">Proof of delivery</h3>

      <div className="space-y-1.5">
        <label htmlFor="recipient" className="text-sm font-medium">
          Recipient name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="recipient"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Who received the package?"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-8 text-sm text-muted-foreground hover:border-brand hover:text-foreground"
        >
          <Camera className="size-6" />
          {photoPreview ? 'Change photo' : 'Capture delivery photo'}
        </button>
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Proof of delivery"
            className="mt-3 max-h-40 rounded-lg border border-border object-cover"
          />
        )}
      </div>

      <Button
        size="lg"
        className="h-10 w-full bg-success text-success-foreground hover:bg-success/90"
        disabled={!recipientName.trim()}
        onClick={() => onCapture(recipientName.trim(), photoPreview ?? undefined)}
      >
        <Check className="size-4" />
        Confirm delivery
      </Button>
    </div>
  )
}
