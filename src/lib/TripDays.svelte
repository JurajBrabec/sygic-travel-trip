<script>
  import { trip, selectTrip, selectDay } from '../stores.js';
  let selected = 0;
  const select = (index) => {
    selected = index;
    selectDay(index);
  };
  const label = (date, index) => {
    const current = new Date(date);
    current.setUTCDate(current.getUTCDate() + index);
    return current.toLocaleDateString();
  };
</script>

<div class="no-print">
  <div class="trip" style={$trip.style}>
    <div>
      <div class="title">
        {$trip.name}
        <button on:click={() => selectTrip()}
          ><i class="bx bx-arrow-back" title="Back" /></button
        >
        <button on:click={() => window.print()}>
          <i class="bx bx-printer" title="Print" />
        </button>
      </div>
      <div class="description">{$trip.description}</div>
    </div>
    <div class="days">
      {#each $trip.days as day, index (index)}
        <button
          disabled={index === selected}
          title={`Day #${index + 1}`}
          on:click={() => select(index)}
          ><i class="bx bx-calendar-star" />
          {label($trip.starts_on, index)}</button
        >
      {/each}
    </div>
  </div>
</div>

<style>
  .trip {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: silver;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 10px;
    border: 1px solid silver;
    box-shadow: 3px 3px 8px 0px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    margin: 0 auto;
    color: #fff;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.7);
  }
  .title {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .description {
    margin-bottom: 16px;
  }
  button {
    padding: 5px 10px;
    margin: 5px;
  }
</style>
