# Agent Workflow

## Rules of a pass

1. **Inspect before proposing.** The repository answers most questions. Read
   the source, run the build, measure in the browser. Never guess.
2. **One problem, one change.** No unrelated edits inside a fix.
3. **Every change is verified** before the next begins, build passes, the
   behaviour is observed, no regression in neighbouring sections.
4. **Severity governs order.** A broken first-load beats a border radius.

## Hand-offs

| Agent | Receives | Produces |
|---|---|---|
| Creative Director | current build | direction verdict, what must not change |
| Visual Designer | direction verdict | type/spacing/contrast defects |
| Motion Director | timeline source | timing, easing, hold defects |
| UX Designer | build + motion notes | orientation and comprehension defects |
| Art Director | frame set + annotations | composition and anchoring defects |
| Frontend Engineer | all defects | technical cause per defect |
| Performance Engineer | causes | measured cost, budget verdict |
| Accessibility Engineer | build | AA/keyboard/reduced-motion defects |
| QA Engineer | implemented changes | regressions across viewports |
| Final Judge | everything | scores, ranked remaining problems |

## Verification commands

    npm run build          # must pass; TS is part of the build
    npx tsc --noEmit -p tsconfig.app.json
    npm run dev            # port 5180

In-browser, a dev-only handle drives the timeline without scrolling:

    window.__timeline(0.42)   // jump to 42% of the film

Measure scrub cost by sweeping it in a loop and dividing by the sample count.
The budget is 8.3 ms per update at 120 Hz; current measured cost is ~1.7 ms.

## Reports

Reports live in `reports/`, are dated, and state findings as:

    Problem / Why it happens / Severity / Recommended solution /
    Expected visual impact / Expected technical impact
