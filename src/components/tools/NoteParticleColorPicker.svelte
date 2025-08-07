<script lang="ts">
  let offsetX: number = $state(0.0);
  let color = $derived(
    `rgb(${noteColorRGB(offsetX)
      .map((c) => c * 100 + "%")
      .join(", ")})`
  );
  let canvas: HTMLCanvasElement;
  let noteImg: HTMLImageElement;

  // Run only once
  $effect(() => {
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.imageSmoothingEnabled = false;
  });

  $effect(() => {
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context || !noteImg.complete) {
      return;
    }
    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(noteImg, 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "multiply";
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "destination-atop";
    context.drawImage(noteImg, 0, 0, canvas.width, canvas.height);
  });

  /**
   * Calculates RGB color based on the offsetX value, just like the Minecraft client.
   * @param offsetX Offset for X coordinate.
   * @return RGB color floats (in range from 0.0 to 1.0).
   */
  function noteColorRGB(offsetX: number): [number, number, number] {
    return [
      Math.max(0.0, Math.sin(offsetX * 6.2831855) * 0.65 + 0.35),
      Math.max(0.0, Math.sin((offsetX + 0.33333334) * 6.2831855) * 0.65 + 0.35),
      Math.max(0.0, Math.sin((offsetX + 0.6666667) * 6.2831855) * 0.65 + 0.35),
    ];
  }
</script>

<div class="picker">
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAQAAABuBnYAAAAALElEQVR42mOAgc3/J/0H0UgCGahCm4GcQGQBiCzRAp//A41EFsj4H/gfZiAAXXUYtS3tm1IAAAAASUVORK5CYII="
    alt="Note particle"
    class="note-image"
    bind:this={noteImg}
  />
  <canvas class="note-canvas" bind:this={canvas}></canvas>
  <p><span class="value">offsetX = {offsetX}</span></p>
  <input class="offset-slider" type="range" min={-1.0} max={1.0} step={0.01} bind:value={offsetX} />
</div>

<style>
  .picker {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30rem;
    max-width: 100%;
    padding: 1rem;
    text-align: center;
  }

  .note-image {
    image-rendering: pixelated;
    width: 1rem;
    height: auto;
    display: none;
  }

  .note-canvas {
    height: 5rem;
    width: 5rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .offset-slider {
    width: 100%;
  }
</style>
