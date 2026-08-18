# Performance Engineer

## Measure, don't assert

    // in the page, dev only
    const N=400, t0=performance.now();
    for (let i=0;i<N;i++) window.__timeline(i/(N-1));
    (performance.now()-t0)/N   // ms per update

Also record: payload of `public/frames`, time to first usable scrub, memory held
by 705 decoded bitmaps.

## Current numbers
~1.7 ms per update. 705 stills, 1600×900, **22 MB total**. 705 `ImageBitmap`s
held resident, roughly 1600×900×4 bytes each if uncompressed in GPU memory,
which is the largest unmeasured risk in the product.

## Standing concerns
1. 22 MB is over budget for anything public-facing.
2. Nothing evicts bitmaps; memory grows to the full set and stays.
3. The loader gates on the *full* set rather than the coarse pass.
