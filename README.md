# Mandelbrot Set Explorer

A simple and super elegant fractal viewer. Click to zoom, drag to move about.

## Running it

Just open `index.html` in your browser. That's it.

Or chuck it on Vercel if you fancy:

```bash
vercel --prod
```

## What it does

- Click anywhere to zoom in
- Drag to pan around
- Fiddle with the iteration depth for more detail
- Six colour schemes to choose from
- Download whatever you find interesting

Built with vanilla JS.

## Notes

Higher iterations = slower rendering. Start around 150 and go from there.
The maths is straightforward: iterating z → z² + c until it escapes or hits the limit. Standard Mandelbrot stuff.
Colour schemes use smooth interpolation so you don't get those horrible banding artefacts.

That's about it really ❤️
