/**
 * Callouts are positioned in FRAME space (percentages of the film), so they
 * stay locked to the part they name however the frame is cropped.
 *
 * Scheduling rule: never two at once. Each window closes at least six steps
 * before the next opens, so annotations arrive one at a time and can be read.
 */
export interface Callout {
  id: string;
  label: string;
  x: number;
  y: number;
  frames: [number, number];
  dir: 'up' | 'down' | 'left' | 'right';
  lead?: number;
  entry: string;
  note: string;
  /**
   * Small screens crop hard: at 375px wide, cover-fit leaves only frame-x
   * 37-63% visible, so any anchor outside that band takes its whole button off
   * screen with it. Narrow viewports get their own anchor inside the visible
   * band, pointing only up or down.
   */
  mobile?: { x: number; y: number; dir: 'up' | 'down' };
}

export const CALLOUTS: Callout[] = [
  {
    id: 'track', label: 'Wide track', x: 36, y: 68, frames: [24, 120], dir: 'down', lead: 40,
    entry: 'sharknose',
    note: 'Track width, the distance between the wheels on an axle, sets the stance before any styling does. The M cars are widened over the standard 3 Series at both ends, and the wheel arches are reshaped to cover it.',
    mobile: { x: 50, y: 72, dir: 'down' },
  },
  {
    id: 'drl', label: 'Adaptive LED', x: 33, y: 55, frames: [142, 172], dir: 'left', lead: 78,
    entry: 'drl',
    note: 'Two light elements per side, descended from the four round headlights of the 1968 saloons. It is the oldest surviving BMW cue on this car.',
    mobile: { x: 46, y: 50, dir: 'up' },
  },
  {
    id: 'grille', label: 'Kidney grille', x: 50, y: 68, frames: [178, 204], dir: 'down', lead: 42,
    entry: 'grille',
    note: 'Full-height vertical kidneys, sized around cooling demand for the engine and the brakes. The most argued-over design decision BMW has made this decade.',
    mobile: { x: 50, y: 70, dir: 'down' },
  },
  {
    id: 'hood', label: 'Bonnet raised', x: 50, y: 30, frames: [216, 258], dir: 'up', lead: 40,
    entry: 'engine',
    note: 'The bonnet lifts clear on twin struts, opening the whole engine bay to the camera. Aluminium, to keep weight off the front axle.',
    mobile: { x: 50, y: 32, dir: 'up' },
  },
  {
    id: 'doors', label: 'Four doors', x: 24, y: 52, frames: [264, 296], dir: 'left', lead: 52,
    entry: 'm3m4',
    note: 'Two handles per side and a fixed B-pillar. This is the saloon. The coupé version of the same car is badged M4.',
    mobile: { x: 44, y: 58, dir: 'down' },
  },
  {
    id: 'steering', label: 'M Sport wheel', x: 30, y: 47, frames: [340, 388], dir: 'left', lead: 82,
    entry: 'mdivision',
    note: 'Thick rim, red centre marker at twelve o’clock, and the two red M buttons that store your own drivetrain and chassis settings.',
    mobile: { x: 47, y: 50, dir: 'down' },
  },
  {
    id: 'console', label: 'Centre console', x: 52, y: 74, frames: [396, 452], dir: 'down', lead: 56,
    entry: 'drive',
    note: 'Eight-speed M Steptronic with a stubby selector. The base M3 was still offered with a six-speed manual, increasingly rare in this class.',
    mobile: { x: 52, y: 72, dir: 'down' },
  },
  {
    id: 'profile', label: 'Long bonnet, short deck', x: 50, y: 80, frames: [502, 548], dir: 'down', lead: 36,
    entry: 'kink',
    note: 'The classic rear-drive proportion: front axle pushed forward, cabin set back, short rear deck. It is a packaging consequence of a longitudinal straight six, not a style choice.',
    mobile: { x: 50, y: 78, dir: 'down' },
  },
  {
    id: 'wheel', label: 'Forged wheel', x: 44, y: 46, frames: [562, 590], dir: 'right', lead: 96,
    entry: 'wheels',
    note: 'Double-spoke forged design. Forging aligns the grain of the alloy, so the wheel can be lighter than a cast one at the same strength. Weight saved here is unsprung, and unsprung weight is what the suspension feels most.',
    mobile: { x: 48, y: 46, dir: 'up' },
  },
  {
    id: 'brakes', label: 'M Compound brakes', x: 52, y: 38, frames: [596, 606], dir: 'left', lead: 96,
    entry: 'wheels',
    note: 'A drilled disc sits behind the spokes, gripped by a fixed caliper. Carbon-ceramics are the option, and wear gold calipers instead.',
    mobile: { x: 52, y: 40, dir: 'up' },
  },
];

/** Section copy. Terse, the detail lives on the parts. */
export interface Caption { frames: [number, number]; kicker: string; line: string }

export const CAPTIONS: Caption[] = [
  { frames: [0, 136],   kicker: 'Presence', line: 'Wide track, low nose, twin kidney grille.' },
  { frames: [136, 208], kicker: 'Front',    line: 'Adaptive LED headlights, air curtains, flat splitter.' },
  { frames: [208, 315], kicker: 'Access',   line: 'Bonnet and front doors open on the same axis.' },
  { frames: [315, 459], kicker: 'Cabin',    line: 'Driver-canted cockpit. M Sport wheel, shell seats.' },
  { frames: [459, 560], kicker: 'Profile',  line: 'Four doors, long bonnet, short deck. This is the saloon.' },
  { frames: [560, 612], kicker: 'Wheels',   line: 'Forged double-spoke wheels over perforated discs.' },
  { frames: [612, 705], kicker: 'M3',       line: 'Sixth generation. Chassis code G80.' },
];

export const captionAt = (frame: number): Caption =>
  CAPTIONS.find((c) => frame >= c.frames[0] && frame < c.frames[1]) ?? CAPTIONS[CAPTIONS.length - 1];
