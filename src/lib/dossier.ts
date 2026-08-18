/**
 * Reference content. Everything here is sourced, no invented figures.
 * Entry ids match callout ids so a hotspot can open the matching entry.
 */

export interface Entry {
  id: string;
  group: 'Model' | 'Marque' | 'Design' | 'Mechanism' | 'M';
  title: string;
  body: string;
}

export const ENTRIES: Entry[] = [
  {
    id: 'model',
    group: 'Model',
    title: 'BMW M3, G80',
    body:
      'Sixth-generation M3, internal code G80, built from 2021. Four doors, five seats, rear-wheel drive as standard with all-wheel drive offered. The tell against its M4 sibling is simply the body: the M3 is the saloon, the M4 the two-door coupé. Everything ahead of the A-pillar is shared between them.',
  },
  {
    id: 'figures',
    group: 'Model',
    title: 'The numbers',
    body:
      '510 PS (503 hp) at 6,250 rpm and 650 Nm from 2,750 rpm. 0–100 km/h in 3.9 seconds, top speed limited to 250 km/h. 4,794 mm long on a 2,857 mm wheelbase, 1,903 mm wide, and around 1,800 kg at the kerb. It is a heavy car that hides it.',
  },
  {
    id: 'm3m4',
    group: 'Model',
    title: 'How to tell an M3 from an M4',
    body:
      'Count the door handles. Two per side and a fixed B-pillar means M3 saloon; one per side and frameless glass means M4 coupé. The front ends are near-identical, which is why the grille argument lands on both of them equally.',
  },
  {
    id: 'marque',
    group: 'Marque',
    title: 'Bayerische Motoren Werke',
    body:
      'The company traces to Rapp Motorenwerke, an aircraft engine maker founded in Munich in 1913. It was renamed Bayerische Motoren Werke in 1917, and the first roundel kept the circular structure of the older Rapp badge.',
  },
  {
    id: 'roundel',
    group: 'Marque',
    title: 'The roundel is not a propeller',
    body:
      'The blue and white quarters are the colours of Bavaria, shown in inverted order because trademark law of the period forbade using state symbols in commercial insignia. The spinning-propeller reading came from a 1929 advertisement and stuck, but it was marketing, not origin.',
  },
  {
    id: 'grille',
    group: 'Design',
    title: 'Kidney grille',
    body:
      'The twin-kidney grille has fronted BMWs since the 1930s and is tailored per model rather than standardised. On the M3 it is vertical and full-height, sized around cooling demand for the engine and brakes, and the most argued-over element of this generation.',
  },
  {
    id: 'kink',
    group: 'Design',
    title: 'Hofmeister kink',
    body:
      'The forward-leaning bend where the rearmost side window meets the C-pillar. Named after Wilhelm Hofmeister, who as head of bodywork put it on series production cars in the early 1960s. It signals rear-wheel drive by visually pushing the cabin rearward.',
  },
  {
    id: 'sharknose',
    group: 'Design',
    title: 'Shark nose',
    body:
      'The nose slopes forward and down, so the car reads as leaning into the road even at rest. It dates to the 1970s and remains one of the few BMW cues legible in silhouette alone.',
  },
  {
    id: 'drl',
    group: 'Design',
    title: 'Four-eye front',
    body:
      'The two paired light elements per side descend from the four round headlights of the 1968 saloons. In the film they are the first thing to resolve out of the dark, before any body panel does.',
  },
  {
    id: 'engine',
    group: 'Mechanism',
    title: 'S58, the 3.0 litre inline six',
    body:
      'Twin-turbocharged, double overhead camshaft, closed-deck block, 2,993 cc. In this state of tune it makes 510 PS (503 hp) at 6,250 rpm and 650 Nm from 2,750 rpm. The straight six is a BMW signature for the same reason it is awkward to package: it is inherently balanced, and long.',
  },
  {
    id: 'drive',
    group: 'Mechanism',
    title: 'Transmission and drive',
    body:
      'Eight-speed M Steptronic automatic here; the base M3 kept a six-speed manual. M xDrive all-wheel drive is optional and retains a pure rear-drive mode. The division treats that as a feature, not a legacy.',
  },
  {
    id: 'numbers',
    group: 'Mechanism',
    title: 'Blue calipers, forged wheels',
    body:
      'The blue-painted calipers in the film are M Compound brakes, the standard fitment; carbon-ceramics are the option and wear gold. Wheels are staggered, narrower at the front and wider at the rear, which is why the car looks planted from behind and pointed from the front.',
  },
  {
    id: 'wheels',
    group: 'Mechanism',
    title: 'Wheels, brakes, and unsprung mass',
    body:
      'The wheels are staggered: the rear is larger and wider than the front, which is what lets a rear-driven car put its torque down while keeping the steering light. Forged construction saves unsprung mass: weight that the suspension has to control rather than merely carry, and therefore the most valuable weight on the car to remove.',
  },
  {
    id: 'mdivision',
    group: 'M',
    title: 'M GmbH, founded 1972',
    body:
      'Founded as BMW Motorsport GmbH to consolidate the racing programme under one identity; renamed BMW M GmbH in 1993. The M4 is a road car built by what began as a race department.',
  },
  {
    id: 'mcolours',
    group: 'M',
    title: 'Blue, violet, red',
    body:
      "Designed in 1972. BMW M's own account: blue for the marque, red for motorsport, violet for the union of the two. Historians note the red most likely anticipated Texaco sponsorship, a deal that collapsed at the end of 1972, after the colours were drawn.",
  },
];

export const GROUPS = ['Model', 'Marque', 'Design', 'Mechanism', 'M'] as const;

export interface Spec { k: string; v: string }

/** The measured car, for the specification block. */
export const SPECS: Spec[] = [
  { k: 'Generation', v: 'G80 · sixth' },
  { k: 'Body',       v: 'Four-door saloon' },
  { k: 'Engine',     v: 'S58 · 2,993 cc · twin-turbo straight six' },
  { k: 'Output',     v: '510 PS / 503 hp @ 6,250 rpm' },
  { k: 'Torque',     v: '650 Nm @ 2,750 rpm' },
  { k: 'Gearbox',    v: 'Eight-speed M Steptronic' },
  { k: 'Drive',      v: 'Rear-wheel · M xDrive optional' },
  { k: '0–100 km/h', v: '3.9 s' },
  { k: 'Top speed',  v: '250 km/h, limited' },
  { k: 'Length',     v: '4,794 mm' },
  { k: 'Wheelbase',  v: '2,857 mm' },
  { k: 'Width',      v: '1,903 mm' },
];

export const SOURCES = [
  { label: 'BMW.com: the Hofmeister kink', url: 'https://www.bmw.com/en/freude/the-bmw-hofmeister-kink.html/index' },
  { label: 'BMW M: history of the M logo', url: 'https://www.bmw-m.com/en/topics/magazine-article-pool/die-geschichte-des-bmw-m-logos.html' },
  { label: 'The Drive: what the roundel means', url: 'https://www.thedrive.com/news/29376/this-is-what-the-bmw-logo-really-means-and-no-its-not-an-airplane-propeller' },
];
