'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const canvas = document.getElementById('mandelbrot');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const coordReal = document.getElementById('coordReal');
    const coordImag = document.getElementById('coordImag');
    const coordZoom = document.getElementById('coordZoom');
    const iterationsInput = document.getElementById('iterations');
    const iterDisplay = document.getElementById('iterDisplay');
    const paletteOptions = Array.from(document.querySelectorAll('.palette-option'));
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if (
      !canvas ||
      !loadingOverlay ||
      !coordReal ||
      !coordImag ||
      !coordZoom ||
      !iterationsInput ||
      !iterDisplay ||
      !resetBtn ||
      !downloadBtn
    ) {
      return undefined;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      return undefined;
    }

    let centerX = -0.5;
    let centerY = 0;
    let zoom = 1;
    let maxIter = 150;
    let currentScheme = 'classical';
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartCenterX = 0;
    let dragStartCenterY = 0;
    let hasMoved = false;

    const colorSchemes = {
      monochrome: (n, total) => {
        if (n === total) return [0, 0, 0];
        const t = Math.sqrt(n / total);
        const val = Math.floor(t * 255);
        return [val, val, val];
      },
      classical: (n, total) => {
        if (n === total) return [0, 3, 10];
        const t = n / total;
        const smoothed = Math.sqrt(t);
        return [
          Math.floor(8 * (1 - smoothed) * smoothed * smoothed * smoothed * 255),
          Math.floor(12 * (1 - smoothed) * (1 - smoothed) * smoothed * smoothed * 255),
          Math.floor(6.5 * (1 - smoothed) * (1 - smoothed) * (1 - smoothed) * smoothed * 255)
        ];
      },
      ember: (n, total) => {
        if (n === total) return [0, 0, 0];
        const t = n / total;
        const smoothed = Math.pow(t, 0.7);
        return [
          Math.floor(255 * Math.min(1, smoothed * 1.5)),
          Math.floor(180 * Math.max(0, Math.min(1, (smoothed - 0.3) * 2))),
          Math.floor(100 * Math.max(0, (smoothed - 0.7) * 3))
        ];
      },
      azure: (n, total) => {
        if (n === total) return [0, 8, 15];
        const t = n / total;
        const smoothed = Math.pow(t, 0.8);
        return [
          Math.floor(20 + smoothed * smoothed * 160),
          Math.floor(80 + smoothed * 120),
          Math.floor(150 + smoothed * 105)
        ];
      },
      amethyst: (n, total) => {
        if (n === total) return [10, 0, 15];
        const t = n / total;
        const smoothed = Math.pow(t, 0.75);
        return [
          Math.floor(80 + smoothed * 175),
          Math.floor(20 + smoothed * smoothed * 150),
          Math.floor(120 + Math.sin(smoothed * Math.PI) * 135)
        ];
      },
      sage: (n, total) => {
        if (n === total) return [5, 10, 5];
        const t = n / total;
        const smoothed = Math.pow(t, 0.85);
        return [
          Math.floor(20 + smoothed * smoothed * 100),
          Math.floor(40 + smoothed * 180),
          Math.floor(30 + smoothed * smoothed * 120)
        ];
      }
    };

    const updateDisplay = () => {
      coordReal.textContent = centerX.toFixed(10);
      coordImag.textContent = centerY.toFixed(10);
      coordZoom.textContent = `${zoom.toFixed(1)}×`;
    };

    const mandelbrot = (cx, cy, total) => {
      let x = 0;
      let y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < total) {
        const xtemp = x * x - y * y + cx;
        y = 2 * x * y + cy;
        x = xtemp;
        iteration++;
      }

      if (iteration < total) {
        const logZn = Math.log(x * x + y * y) / 2;
        const nu = Math.log(logZn / Math.log(2)) / Math.log(2);
        iteration = iteration + 1 - nu;
      }

      return iteration;
    };

    const render = async () => {
      canvas.classList.add('rendering');
      loadingOverlay.classList.add('active');

      await new Promise((resolve) => setTimeout(resolve, 50));

      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const scale = 3 / zoom;

      for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
          const x0 = centerX + ((px - width / 2) * scale) / width;
          const y0 = centerY + ((py - height / 2) * scale) / height;

          const n = mandelbrot(x0, y0, maxIter);
          const [r, g, b] = colorSchemes[currentScheme](n, maxIter);

          const index = (py * width + px) * 4;
          imageData.data[index] = r;
          imageData.data[index + 1] = g;
          imageData.data[index + 2] = b;
          imageData.data[index + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.classList.remove('rendering');
      loadingOverlay.classList.remove('active');
      updateDisplay();
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      hasMoved = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartCenterX = centerX;
      dragStartCenterY = centerY;
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }

      const scale = 3 / zoom;
      centerX = dragStartCenterX - (dx / rect.width) * scale;
      centerY = dragStartCenterY - (dy / rect.height) * scale;
      updateDisplay();
    };

    const handleMouseUp = async (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();

      if (!hasMoved) {
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const scale = 3 / zoom;
        centerX += (x - 0.5) * scale;
        centerY += (y - 0.5) * scale;
        zoom *= 2.5;
        await render();
      } else {
        await render();
      }

      isDragging = false;
      hasMoved = false;
      canvas.style.cursor = 'crosshair';
    };

    const handleMouseLeave = () => {
      if (isDragging && hasMoved) {
        render();
      }
      isDragging = false;
      hasMoved = false;
      canvas.style.cursor = 'crosshair';
    };

    const handleIterationsInput = (e) => {
      maxIter = parseInt(e.target.value, 10);
      iterDisplay.textContent = maxIter;
    };

    const handleIterationsChange = () => {
      render();
    };

    const handlePaletteClick = (event) => {
      paletteOptions.forEach((option) => option.classList.remove('active'));
      const target = event.currentTarget;
      if (target instanceof HTMLElement) {
        target.classList.add('active');
        currentScheme = target.dataset.scheme || 'classical';
        render();
      }
    };

    const handleReset = () => {
      centerX = -0.5;
      centerY = 0;
      zoom = 1;
      maxIter = 150;
      iterationsInput.value = '150';
      iterDisplay.textContent = '150';
      render();
    };

    const handleDownload = () => {
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `mandelbrot-${timestamp}-${zoom.toFixed(0)}x.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    iterationsInput.addEventListener('input', handleIterationsInput);
    iterationsInput.addEventListener('change', handleIterationsChange);
    paletteOptions.forEach((option) => option.addEventListener('click', handlePaletteClick));
    resetBtn.addEventListener('click', handleReset);
    downloadBtn.addEventListener('click', handleDownload);

    render();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      iterationsInput.removeEventListener('input', handleIterationsInput);
      iterationsInput.removeEventListener('change', handleIterationsChange);
      paletteOptions.forEach((option) => option.removeEventListener('click', handlePaletteClick));
      resetBtn.removeEventListener('click', handleReset);
      downloadBtn.removeEventListener('click', handleDownload);
    };
  }, []);

  return (
    <>
      <div className="app-container">
        <div className="canvas-section">
          <div className="top-bar">
            <div className="title-section">
              <h1 className="main-title">The Mandelbrot Set</h1>
              <p className="subtitle">A meditation on infinite complexity</p>
            </div>
          </div>

          <div className="canvas-wrapper">
            <canvas id="mandelbrot" width="1000" height="1000" />
          </div>

          <div className="bottom-bar">
            <div className="coordinates-display">
              <div className="coord-item">
                <span className="coord-label">Real</span>
                <span className="coord-value" id="coordReal">
                  −0.5000000000
                </span>
              </div>
              <div className="coord-item">
                <span className="coord-label">Imaginary</span>
                <span className="coord-value" id="coordImag">
                  0.0000000000
                </span>
              </div>
              <div className="coord-item">
                <span className="coord-label">Magnification</span>
                <span className="coord-value" id="coordZoom">
                  1.0×
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="section">
            <h2 className="section-title">Refinement</h2>

            <div className="control-item">
              <div className="control-label">
                <span className="control-name">Iteration Depth</span>
                <span className="control-value" id="iterDisplay">
                  150
                </span>
              </div>
              <input
                type="range"
                id="iterations"
                min="50"
                max="1000"
                defaultValue="150"
                step="25"
              />
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Palette</h2>

            <div className="palette-grid">
              <div className="palette-option palette-monochrome" data-scheme="monochrome">
                <div className="palette-label">Monochrome</div>
              </div>
              <div className="palette-option palette-classical active" data-scheme="classical">
                <div className="palette-label">Classical</div>
              </div>
              <div className="palette-option palette-ember" data-scheme="ember">
                <div className="palette-label">Ember</div>
              </div>
              <div className="palette-option palette-azure" data-scheme="azure">
                <div className="palette-label">Azure</div>
              </div>
              <div className="palette-option palette-amethyst" data-scheme="amethyst">
                <div className="palette-label">Amethyst</div>
              </div>
              <div className="palette-option palette-sage" data-scheme="sage">
                <div className="palette-label">Sage</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Actions</h2>
            <div className="button-group">
              <button id="resetBtn" type="button">
                Return to Origin
              </button>
              <button id="downloadBtn" type="button">
                Preserve as Image
              </button>
            </div>
          </div>

          <div className="instructions">
            <p>
              <em>Click</em> to magnify and center
            </p>
            <p>
              <em>Drag</em> to navigate the plane
            </p>
            <p>
              <em>Patience</em> rewards deeper exploration
            </p>
          </div>
        </div>
      </div>

      <div className="loading-overlay" id="loadingOverlay">
        <div className="loading-content">
          <div className="spinner-elegant" />
          <div className="loading-text">Calculating...</div>
        </div>
      </div>
    </>
  );
}
