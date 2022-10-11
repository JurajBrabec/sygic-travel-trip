<script>
  import UserTrips from './lib/UserTrips.svelte';
  import { onMount } from 'svelte';
  import { loading, login, readHAR } from './stores.js';
  import map from './googleMaps.js';
  import { createReader } from './helpers';
  import demo from './data/demo.json';

  export let ready;

  $: if (ready) map.create();

  onMount(() => {
    //    readHAR(JSON.stringify(demo));
  });

  let username = import.meta.env.VITE_SYGICTRAVEL_USERNAME;
  let password = import.meta.env.VITE_SYGICTRAVEL_PASSWORD;
  let files;
  const reader = createReader(readHAR);
</script>

<svelte:head>
  <script
    defer
    async
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDi-MfdDP9jVM8Wh-z01RX6rRb95dKoMbU&callback=initMap">
  </script>
</svelte:head>

<div class="main">
  <UserTrips>
    <div>
      <input bind:value={username} type="text" placeholder="User name" />
      <input bind:value={password} type="password" />
      <button disabled={$loading} on:click={() => login({ username, password })}
        ><i class="bx bx-log-in" title="Log in" /> Log in</button
      >
    </div>
    <div>
      {#if files && files[0]}
        <button disabled={$loading} on:click={() => reader.readAsText(files[0])}
          ><i class="bx bx-file" title="Open" /> Open
        </button>
        <button on:click={() => (files = [])}
          ><i class="bx bx-file-blank" title="Clear" /> Clear</button
        ><br />{files[0].name}
      {:else}
        <label for="file">Select HAR file</label>
        <input id="file" type="file" accept=".har" bind:files />
      {/if}
    </div>
  </UserTrips>
</div>

<style>
  .main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
