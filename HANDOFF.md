# Softdrive Website — Redesign Handoff

Working doc for the Dark-Chrome redesign (Emiliano + Claude). Pick up here in a new session.

## Wer / Was
- **Softdrive** = DJ/Producer-Duo aus Hamburg, Mitglieder **Oliver & Bennet**. Genre: Speed House · UK Garage · Hard House · Trance.
- Repo: `Softdrive1/softdrive-website` (privat). Emiliano ist Collaborator (`EmiGross`).
- Stack: **Next.js 16 · React 19 · Tailwind 4 · react-three-fiber (3D) · framer-motion**.
  ⚠️ `AGENTS.md`: Next 16 hat Breaking Changes → bei Code Docs in `node_modules/next/dist/docs/` lesen.

## Design-Richtung (festgelegt)
**Dark Chrome / Y2K** — near-black (`#08080b`), Flüssigmetall, glossy. Ersetzt die alte beige + Blackletter-Optik.
- **Fonts** (via `next/font` in `app/layout.tsx`): **Syne** = Display/Headlines (mit Chrome-Effekt), **Inter** = Body, **Space Grotesk** = Labels/Eyebrows.
- **Signature**: `.chrome-text` (Flüssig-Chrome-Bevel auf Headlines) + einmaliger Shimmer-Sweep beim Reinscrollen (`.chrome-sweep`).
- **Design-Tokens**: alle in `app/globals.css` unter `:root` (Farben, `--accent: #9ecbe8` icy-blue, Border, Text-Stufen).

## Komponenten-Map (`app/`)
- `page.tsx` — Reihenfolge: Navbar · Hero · HardDrive(3D) · Releases · Synth(3D) · Sets · PhotoMarquee · About · DemoDrop · Footer
- `SynthSection.tsx` / `SynthScene.tsx` — **neu**: spielbarer 3D-Synth („Chunky Synth" von MrEliptik, CC BY 4.0, auf Juno-Brauntöne umgefärbt), 12 klickbare Tasten mit Samples (`synthAudio.ts`). Immer gemountet (kein IntersectionObserver — siehe Kommentar in `SynthSection.tsx`). ⚠️ Modelllänge wird in Scene-LOCAL-Space gemessen (`inv(sceneWorld)·meshWorld`), NIE per `Box3.setFromObject`-Weltbox — die enthält nach Frame 1 die eigene Rotation+Scale und der Feedback-Loop erzeugte den „Stripes-Bug" (brauner Vollbreite-Balken statt Synth)
- `PhotoMarquee.tsx` — **neu**: zwei gegenläufige Endlos-Reihen analoger 35mm-Event-Fotos (`public/photos/`, aus `D:\Softdrive` auf 1200px verkleinert), CSS-Keyframes in `globals.css` (`.marquee-*`), Hover pausiert
- `Dither/Dither.tsx` — **neu**: React-Bits Dither-Wave als BG der 3D-Sektion, auf Single-Pass-Shader umgebaut (kein postprocessing-Paket). ⚠️ R3F v9 klont das `uniforms`-Prop → Uniforms NUR über `matRef.current.uniforms` mutieren, sonst friert der Effekt nach 1 Frame ein
- `components/SectionHeading.tsx` — **neu**: Chrome-Heading + Shimmer-on-view (in allen 4 Content-Sektionen genutzt; blaue Eyebrows auf Emilianos Wunsch entfernt)
- `Navbar.tsx` — Logo-Bild `public/logo-nav.png` (aus `Softdrive Druck 2.png` zugeschnitten/verkleinert, 36 KB) statt Text-Wordmark, Nav-Links, Social-Icons (react-icons SVG; RA = Text-Monogramm, kein PNG mehr), Mobile-Menu; Intro-Fade
- `HeroSection.tsx` — Video-BG (crossfade) + drehendes Chrome-Logo; transparentes Video wird **je Engine** gewählt (UA-Sniffing): Safari/iOS → HEVC-alpha `public/softdrive-logo.mp4`, Rest → VP9-alpha `public/softdrive-logo.webm` (jede Engine zeigt das andere Format als schwarzen Kasten). PNG (`/logo.png`) = Poster + `onError`-Fallback. Orchestrierte Intro
- `HardDriveScene.tsx` / `HardDriveSection.tsx` — R3F-Canvas, lädt `public/models/softdrive.glb` (eigenes 3D-Modell der beiden, Draco + WebP)
- `ReleasesSection.tsx` / `SetsSection.tsx` — Spotify/SoundCloud-Embeds in Dark-Glass-Cards, gerendert über `SpotifyPlayer.tsx` / `SoundCloudPlayer.tsx`
- `playerBus.ts` — **neu**: verhindert gleichzeitiges Abspielen. Registry aller Player; wer Play startet, pausiert die anderen. SoundCloud über die Widget-API (bindet an die normalen iframes), Spotify über die offizielle iFrame-API (`SpotifyPlayer` ersetzt das plain iframe durch einen Controller; bei blockiertem API-Script Fallback aufs plain iframe, dann ohne Koordination). ⚠️ Spotify claimt nur auf der paused→playing-Flanke — sonst pausieren veraltete „läuft noch"-Ticks den neuen Player wieder
- `AboutSection.tsx` — Bio (Oliver & Bennet). Stats-Reihe wurde entfernt.
- `DemoDropSection.tsx` — Demo-Formular (web3forms, access_key im Code), heller Chrome-Send-Button
- `Footer.tsx` — © + Mail + Credit „3D & visuals by Oliver & Bennet"

## Status
**15.07.2026 (2):** Player-Koordination: Spotify- und SoundCloud-Player spielen nicht mehr gleichzeitig (`playerBus.ts`, s. Komponenten-Map). E2E in Puppeteer verifiziert (SC→SC, SC→Spotify, Spotify→SC, keine Rück-Pausierung). tsc + eslint + build grün.

**15.07.2026:** Stripes-Bug der Synth-Sektion an der Wurzel gefixt (Scale-Feedback-Loop bei Re-Measure nach Resize, s. Komponenten-Map; lokal per Resize-Churn in Puppeteer verifiziert, Desktop + Mobile). Sichtbare „▶ Listen on SoundCloud"-Fallback-Links unter allen SoundCloud-Playern (Releases + Sets, `.sc-fallback` in `globals.css`) — Absicherung für To-Do 3. Lint-Fix in `HeroSection` (setState in Effect → in den rAF-Callback verschoben). tsc + eslint + `next build` grün.

**Fertig:** Font-Swap, Dark-Chrome-Theme site-weit, Icons gefixt, Footer-Credit, Cleanup (3 tote Komponenten + `ra.png` gelöscht, altes CSS-Theme raus), Chrome-Shimmer, Hero-Intro, Mobile-Padding-Bug gefixt (globaler Reset war unlayered → überschrieb Tailwind `px-6`; jetzt in `@layer base`). **3D-Modell getauscht:** eigene GLB der beiden (Quelle `D:\Softdrive\Softdrive 3d Model.glb`, 73 MB) via `gltf-transform optimize` auf 1,5 MB komprimiert (Simplify auf ~385k Tris, Draco, 2K-WebP-Textur) → `public/models/softdrive.glb`; alte `harddrive.glb` gelöscht. Licht/Kamera unverändert gelassen — Emiliano hat live gesichtet: „sieht sehr clean aus". tsc + eslint grün. **Noch NICHT committet/gepusht** (auf Emilianos Freigabe warten — fremdes Repo).

## Offene To-Dos
1. **Artist-Scans im About** (Plan B): Emiliano liefert Extra-Ordner mit den richtigen Artist-Pics (Reihenfolge über Dateinamen) → verkleinern, als schief gedrehte Scans mit Parallax um den Bio-Text. Das Neon-Duo-Portrait (`public/photos/duo-blur.jpg`) ist schon vorbereitet und noch nirgends eingebaut.
2. **SoundCloud-Player** sind weiß (kein Dark-Mode) → später Custom Dark-Player. Bewusst zurückgestellt.
3. **SoundCloud-Embeds erscheinen nicht bei allen Besuchern** (offen, 13.07.2026): Bei Bennet (iPhone Safari) werden die SoundCloud-`iframe`s als leere Zeilen dargestellt, das Spotify-Embed daneben lädt normal; bei seinem Freund (ebenfalls iPhone Safari) erscheinen sie. Kein CSP/Header, iframes serverseitig nicht blockiert, ausgeliefertes HTML identisch → clientseitig. Verdacht Content-/DNS-Blocker, ABER Bennet sieht SoundCloud-Player auf anderen Websites → Ursache noch unklar. Zu prüfen: Device-Cache (alte Version ohne Embeds), track-spezifische Embed-Restriktion, Safari-Tracking-Settings, WLAN-DNS. Absicherung ist drin (15.07.2026): sichtbarer „▶ Listen on SoundCloud"-Fallback-Link unter jedem Player, damit Besucher mit Blocker den Track trotzdem erreichen. Grundursache weiter offen — auf Bennets iPhone gegentesten.
4. Emiliano gibt Bauchgefühl-Feedback nach Live-Sichtung (Desktop + Handy), dann committen + pushen.

## Dev / Preview
- `npm run dev` → http://localhost:3000
- Screenshots: headless Chrome + `puppeteer-core` **im Session-Scratchpad** installiert, NICHT in die `package.json` (die bleibt unangetastet).
