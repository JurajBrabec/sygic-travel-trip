<script>
  import TripDays from './TripDays.svelte';
  import Day from './Day.svelte';
  import {
    error,
    loading,
    user,
    trips,
    trip,
    selectTrip,
    day,
  } from '../stores';
</script>

<div>
  {#if $loading}
    <div class="loading" />
  {/if}
  {#if $error}
    <div class="error">{$error.message}</div>
  {/if}
  {#if $user}
    <div class="user no-print">
      <img src={$user.photo.url} alt="User" /><span>
        {$user.email}
      </span>
      <button on:click={() => user.set(null)}
        ><i class="bx bx-log-out" title="Log out" /></button
      >
    </div>
    {#if $trip}
      <TripDays />
      {#if $day}
        <Day />
      {/if}
    {:else}
      <div class="trips">
        {#each $trips as trip (trip.id)}
          <div
            class="trip"
            style={trip.style}
            on:click={() => selectTrip(trip.id)}
          >
            <div class="title">{trip.name}</div>
            <div class="description">{trip.description}</div>
            <div class="url">
              <a href={trip.url} target="_blank">*</a>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <slot />
  {/if}
</div>

<style>
  .error {
    border: 1px solid;
    margin: 10px 0px;
    padding: 15px 10px 15px 50px;
    background-repeat: no-repeat;
    background-position: 10px center;
    color: #d8000c;
    background-color: #ffbaba;
    background-image: url('https://i.imgur.com/GnyDvKN.png');
  }
  .loading {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    opacity: 0.7;
    background-color: #fff;
    z-index: 99;

    border: 16px solid #acabab;
    border-top: 16px solid #db8534;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin: -65px -65px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .user {
    display: flex;
    align-items: center;
    justify-content: right;
    height: 52px;
  }
  .user img {
    width: 32px;
    height: 32px;
  }
  .user span {
    padding: 10px;
  }
  .trips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    width: 100%;
  }
  .trip {
    flex: 0 1 200px;
    height: 145px;
    background-color: silver;
    background-size: cover;
    border-radius: 10px;
    border: 1px solid silver;
    box-shadow: 3px 3px 8px 0px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }
  .trip:hover {
    transform: scale(1.04);
  }
  .trip,
  .url a {
    color: #fff;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.7);
    text-decoration: none;
  }

  .title {
    position: absolute;
    bottom: 25px;
    left: 5px;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .description {
    position: absolute;
    bottom: 5px;
    left: 5px;
    font-size: 0.7rem;
  }

  .url {
    position: absolute;
    top: 0px;
    right: 5px;
    font-size: 2rem;
  }
</style>
