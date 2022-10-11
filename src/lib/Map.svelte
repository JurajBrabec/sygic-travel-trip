<script>
  import map from '../googleMaps.js';
  import { onMount, createEventDispatcher } from 'svelte';

  export let origin = {};
  export let destination = {};
  export let travelMode = map.TravelModes[0];

  let container;
  const dispatch = createEventDispatcher();

  onMount(() => {
    map.create(container);
  });
</script>

<article class="no-print">
  <div class="navbar">
    <select bind:value={travelMode}>
      {#each map.TravelModes as value}
        <option {value}>{value.toLowerCase()}</option>
      {/each}
    </select>
    from
    <input type="text" value={origin.title || ''} />
    to
    <input type="text" value={destination.title || ''} />
    <button
      disabled={!origin.position || !destination.position}
      on:click={() =>
        dispatch(
          'route',
          map.route({
            origin: origin.position,
            destination: destination.position,
            travelMode,
          })
        )}>Route</button
    >
    <button
      disabled={!origin.position && !destination.position}
      on:click={() => {
        origin = {};
        destination = {};
        map.clearRoute();
      }}>Clear</button
    >
  </div>
  <div class="map" bind:this={container} />
</article>

<style>
  article {
    padding: 15px 5px;
    min-width: 40%;
    aspect-ratio: 1/1;
    height: 65vh;
  }
  input {
    width: 100%;
  }
  button:disabled {
    color: black;
  }
  .navbar {
    font-size: small;
    padding: 10px;
    color: white;
    background-color: black;
    display: flex;
    gap: 5px;
    justify-content: space-between;
    align-items: center;
  }
  .map {
    border: 1px solid black;
    height: 100%;
  }
</style>
