# AI Design Team, BMW M3 Motion Study

This directory is the operating specification for the team that maintains and
improves the experience in this repository. It is not documentation of the
website; it is instruction for how the website is to be worked on.

## What the product is

A single-page, scroll-controlled motion piece built around a ten-second studio
film of a BMW M3 (G80). The film is decomposed into 705 stills and scrubbed by
scroll position on a canvas. Annotations are anchored in frame space and explain
the car; a reference panel carries longer sourced writing.

**The film is the product.** Chrome, type and interface exist to serve it.

## Operating order

    PRESERVE → DIAGNOSE → REFINE → POLISH

Never rebuild what already works. The current direction, monochrome sampled
from the footage, one neutral grotesk, hairline annotation, no decoration, is
settled. Work inside it.

## The loop

    Creative Director → Visual Designer → Motion Director → UX Designer
      → Art Director → Frontend Engineer → Performance Engineer
      → Accessibility Engineer → QA Engineer → Final Judge

The Final Judge scores and names remaining problems. Only the highest-impact
problems are fixed on the next pass. Repeat.

## Files

| File | Purpose |
|---|---|
| `DESIGN_PRINCIPLES.md` | What this product believes. Settle arguments here. |
| `AGENT_WORKFLOW.md` | How a pass runs, and what each agent hands to the next. |
| `DESIGN_SYSTEM.md` | Tokens, scale, spacing, the actual values in use. |
| `TYPOGRAPHY_RULES.md` | Readability first. Hard limits. |
| `MOTION_RULES.md` | Timing, easing, the run/hold contract. |
| `UX_RULES.md` | Orientation, control, comprehension. |
| `PERFORMANCE_RULES.md` | The frame budget and what may spend it. |
| `REVIEW_RULES.md` | Scoring, severity, and what "finished" means. |
| `agents/` | Per-role inspection instructions for THIS site. |
| `reports/` | Findings. Dated, never overwritten silently. |
