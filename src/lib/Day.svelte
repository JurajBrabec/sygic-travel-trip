<script>
  import Map from './Map.svelte';
  import { day } from '../stores.js';
  import map from '../googleMaps.js';
  import { Modes, Names } from '../helpers';

  let origin = {};
  let destination = {};
  let travelMode;

  const handleClick = (item) => {
    map.setCenter(item.location, 15);
  };

  const markerClick = (title, position) => {
    if (!origin.position || destination.position) {
      origin = { title, position };
      destination = {};
    } else {
      destination = { title, position };
    }
  };

  const createMarkers = (day) => {
    map.clearMarkers();
    day
      .filter(({ location }) => location)
      .forEach(({ name, location }, index) => {
        map.addMarker({
          position: location,
          label: `${index + 1}`,
          title: name,
          onClick: () => markerClick(name, location),
        });
      });
    map.showMarkers();
  };

  const handleRoute = async (event) => {
    const { routes } = await event.detail;
    console.log(routes.length, routes[0].legs.length, routes[0].legs[0]);
  };

  $: createMarkers($day);
</script>

<section>
  <article>
    <table>
      <thead>
        <tr>
          {#each Array.from(Names.keys()) as name}
            <td class={name}>{Names.get(name)}</td>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each $day as i, index (index)}
          {#if i.transport}
            <tr class="transport {i.mode}">
              <td class:mode={i.mode}>
                <i class={Modes.get(i.mode)} title={i.mode} />
              </td>
              <td class="duration">{i.duration}</td>
              <td class="distance">{i.distance}</td>
              <td class="start">{i.tStart}</td>
              <td class="marker" />
              <td class="note">
                <span class="name">{i.tName}</span>
                <div>{i.tNote}</div>
              </td><td class="stay" />
              <td class="end">{i.tEnd}</td>
            </tr>
          {/if}
          <tr
            class:important={i.important}
            class:long={i.long}
            class:lunch={i.lunch}
            class="place {i.mode} {i.marker}"
            on:click={() => handleClick(i)}
          >
            {#if i.transport}
              <td colspan="3" />
            {:else}
              <td class={i.mode}>
                <i class={Modes.get(i.mode)} title={i.mode} />
              </td>
              <td class="duration">{i.duration}</td>
              <td class="distance">{i.distance}</td>
            {/if}
            <td class="start">
              {index > 0 ? i.start : ''}
            </td>
            <td class="marker">
              {#if i.marker_url}
                <img src={i.marker_url} alt={i.marker} />
              {:else}
                ?
              {/if}
            </td>
            <td class="note">
              <span class="name">{i.name}</span>
              <span class="address">{i.address}</span>
              <div>{i.note}</div>
            </td>
            <td class="stay">{i.stay}</td>
            <td class="end">
              {i.start != i.end || index === 0 ? i.end : ''}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </article>
  <Map bind:origin bind:destination bind:travelMode on:route={handleRoute} />
</section>

<style>
  section {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }

  article {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 15px 5px;
    margin: 0 auto;
    width: 100%;
  }

  table {
    border-collapse: collapse;
    box-shadow: 0 0 15px
      hsla(var(--rowH), var(--rowS), var(--rowLF), var(--mainA));
    margin-bottom: 60px;
    width: 100%;
  }
  td {
    padding: 4px 5px;
  }
  tr {
    height: 36px;
    text-align: left;
  }
  thead tr {
    background-color: hsl(var(--mainH), var(--mainS), var(--mainLB));
    color: hsl(var(--mainH), var(--mainS), var(--mainLF));
  }
  tbody tr {
    background-color: hsl(var(--rowH), var(--rowS), var(--rowLB));
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--rowH), var(--rowS), var(--rowLF), var(--mainA));
    color: hsl(var(--rowH), var(--rowS), var(--rowLF));
  }

  tr.transport {
    --H: 0;
    --S: 0%;
    --LB: 95%;
    --LF: 0%;
    --A: 0.3;
    --BW: 5px;
    --BS: solid;
    background-color: hsl(var(--H), var(--S), var(--LB));
    border-left: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-right: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    color: hsl(var(--H), var(--S), var(--LF));
    font-weight: bold;
  }
  tr.plane {
    --H: 9;
    --S: 66%;
    --LB: 95%;
    --LF: 33%;
    --A: 0.5;
    --BW: 5px;
    --BS: dotted;
    background-color: hsl(var(--H), var(--S), var(--LB));
    border-left: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-right: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    color: hsl(var(--H), var(--S), var(--LF));
    font-weight: bold;
  }
  tr.important {
    --H: 222;
    --S: 35%;
    --LB: 93%;
    --LF: 33%;
    --A: 0.4;
    --BW: 3px;
    --BS: dotted;
    background-color: hsl(var(--H), var(--S), var(--LB));
    border-left: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-right: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    color: hsl(var(--H), var(--S), var(--LF));
  }
  tr.long {
    --H: 222;
    --S: 35%;
    --LB: 93%;
    --LF: 33%;
    --A: 0.5;
    --BW: 5px;
    --BS: dotted;
    background-color: hsl(var(--H), var(--S), var(--LB));
    border-left: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-right: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    color: hsl(var(--H), var(--S), var(--LF));
    font-weight: bold;
  }
  tr.lunch {
    --H: 54;
    --S: 39%;
    --LB: 93%;
    --LF: 31%;
    --A: 0.5;
    --BW: 3px;
    --BS: dotted;
    background-color: hsl(var(--H), var(--S), var(--LB));
    border-left: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-right: var(--BW) var(--BS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--H), var(--S), var(--LF), var(--A));
    color: hsl(var(--H), var(--S), var(--LF));
    font-weight: bold;
  }

  tbody tr:first-of-type,
  tr.sleeping-hotel {
    background-color: hsla(
      var(--mainH),
      var(--mainS),
      var(--mainLB),
      var(--mainA)
    );
    border-bottom: var(--rowBW) var(--rowBS)
      hsla(var(--mainH), var(--mainS), var(--mainLB), var(--mainA));
    color: hsl(var(--mainH), var(--mainS), var(--mainLB));
  }
  tbody tr:last-of-type {
    background-color: hsla(
      var(--mainH),
      var(--mainS),
      var(--mainLB),
      var(--mainA)
    );
    border-bottom: 3px var(--rowBS)
      hsla(var(--mainH), var(--mainS), var(--mainLB), var(--mainA));
    color: hsl(var(--mainH), var(--mainS), var(--mainLB));
  }

  .marker img {
    background-color: hsl(var(--rowH), var(--rowS), var(--rowLF));
    border: var(--rowBW) var(--rowBS)
      hsla(var(--rowH), var(--rowS), var(--rowLB), var(--mainA));
    border-radius: 50%;
    filter: invert();
    height: 24px;
    width: 24px;
  }

  .distance {
    text-align: right;
  }

  .start,
  .duration,
  .stay,
  .end {
    text-align: center;
  }

  .start,
  .end {
    font-size: 0.8rem;
  }

  .distance,
  .duration,
  .stay {
    font-size: 0.6rem;
  }

  .name,
  .note,
  .url {
    text-align: left;
  }

  .name {
    width: auto;
    font-size: 0.9rem;
    font-weight: bold;
    padding-right: 8px;
  }

  .mode,
  .marker {
    text-align: center;
    width: 32px;
  }
  .mode {
    font-size: 1.2rem;
  }

  .note,
  .address {
    font-weight: normal;
    font-size: 0.6rem;
  }

  .note {
    font-style: italic;
  }
  tr.place:hover {
    transform: translateX(-2px) translateY(-2px);
    box-shadow: 2px 2px 5px silver;
    transition: 0.2s ease-in-out;
  }
</style>
