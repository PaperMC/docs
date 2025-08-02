<script lang="ts" module>

  let offsetX: number = $state(0.0);
  let color = $derived(`rgb(${noteColorRGB(offsetX).map(c => c * 100 + "%").join(', ')})`);

  /**
   * Calculates RGB color based on the offsetX value, just like the Minecraft client.
   * @param offsetX Offset for X coordinate.
   * @return RGB color floats (in range from 0.0 to 1.0).
   */
  function noteColorRGB(offsetX: number): [number, number, number] {
    return [
      Math.max(0.0, Math.sin(offsetX * 6.2831855) * 0.65 + 0.35),
      Math.max(0.0, Math.sin((offsetX + 0.33333334) * 6.2831855) * 0.65 + 0.35),
      Math.max(0.0, Math.sin((offsetX + 0.6666667) * 6.2831855) * 0.65 + 0.35)
    ];
  }

</script>

<div>

  <div style="width:100px; height:100px; background-color: {color};"></div>
  <p><span>{offsetX}</span></p>
  <input type="range" min={-1.0} max={1.0} step={0.01} bind:value={offsetX} />

</div>
