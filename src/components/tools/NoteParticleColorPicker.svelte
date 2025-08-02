<script lang="ts" module>
  let offsetX: number = $state(0.0);
  let color = $derived(
    `rgb(${noteColorRGB(offsetX)
      .map((c) => c * 100 + "%")
      .join(", ")})`
  );

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
  <div class="colorBox" style="background-color: {color};"></div>
  <p><span class="value">offsetX = {offsetX}</span></p>
  <input class="offset-slider" type="range" min={-1.0} max={1.0} step={0.01} bind:value={offsetX} />
</div>

<style>
  .picker {
    width: 30rem;
    padding: 1rem;
    text-align: center;
  }

  .colorBox {
    width: 100%;
    height: 5rem;
    border-radius: 1rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .offset-slider {
    width: 100%;
  }
</style>
