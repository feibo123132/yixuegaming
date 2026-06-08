# First Batch Visual Assets

Style direction: clinical night-shift strategy style. Semi-realistic emergency medicine scenes, tactical medical HUDs, restrained danger colors, and collectible but readable strategy cards.

Generated with the built-in image generation tool, using gpt-image-2 style prompts through the available image generation surface.

## Assets

- `battle-screen-background-ui-safe.png`
  - Primary battle background. Best for the final combat UI because it already leaves panel zones for queue, orders, and hand cards.
- `battle-screen-background-clean.png`
  - Cleaner battle background variant. Best if the UI team wants to design all panels from scratch.
- `battle-hud-full-concept.png`
  - Full combat HUD concept. Use as a UX composition reference rather than a final background.
- `card-style-sheet-8-core-cards.png`
  - Core card art direction sheet for ECG, troponin, aspirin, nitroglycerin, PCI, STEMI, coronary occlusion, and biomarker timing.
- `stemi-patient-three-states.png`
  - STEMI patient state sheet: initial, worsening, stabilized. Good for character direction; may need a more stylized redraw later.
- `vital-signs-hud-dashboard.png`
  - Dedicated vital-signs and disease-progression HUD concept.
- `ecg-report-template.png`
  - ECG result/report visual template. Use frontend text overlays for exact medical labels.
- `case-debrief-report-ui.png`
  - Post-battle case review and learning recap UI concept.
- `exam-hospital-map-hub.png`
  - Out-of-combat exam hospital growth map concept.
- `chapter-cover-night-shift.png`
  - Chapter cover / start screen key visual with empty title space.

## Production Notes

- Do not rely on generated small text. Use generated images as backgrounds or illustration layers, then overlay real UI text in the frontend.
- The card sheet is a style reference. Final cards should be rebuilt as separate card frames with deterministic UI text and icons.
- The patient sheet is realistic and emotionally grounded. If the game later moves more stylized, redraw the same three states with stronger silhouette and fewer photo-real details.
- The combat background with UI-safe zones is the strongest candidate for the first playable vertical slice.
