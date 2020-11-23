import React, { useState } from "react";
import useApi from "./hook/useApi";
import prettyMs from "pretty-ms";
import get from "lodash/get";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import Player, { Preview } from "./Player";
import PreviewProvider from "./context/preview";

const features = {
  acousticness: { min: 0, max: 1, step: 0.001 },
  danceability: { min: 0, max: 1, step: 0.001 },
  energy: { min: 0, max: 1, step: 0.001 },
  instrumentalness: { min: 0, max: 1, step: 0.001 },
  liveness: { min: 0, max: 1, step: 0.001 },
  loudness: { min: -60, max: 0, step: 0.001 },
  speechiness: { min: 0, max: 1, step: 0.001 },
  valence: { min: 0, max: 1, step: 0.001 },
  tempo: { min: 0, max: 200, step: 0.001 },
  key: { min: 0, max: 11, step: 1 },
  mode: { min: -1, max: 1, step: 1 },
};

const tableKeys = [
  "Preview",
  "Added At",
  "Name",
  "Artists",
  "Duration",
  "Key",
  "Mode",
  "Acousticness",
  "Danceability",
  "Energy",
  "Instrumentalness",
  "Liveness",
  "Loudness",
  "Speechiness",
  "Valence",
  "Tempo",
];

const tableProperties = {
  preview: (uri) => <Preview uri={uri} />,
  added_at: (date) => {
    const addedAt = parseISO(date);
    return <time dateTime={date}>{format(addedAt, "HH:mm, dd.MM.yyyy")}</time>;
  },
  name: null,
  artists: (artists) => {
    return (
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <span>{artist.name}</span>
            <ul>
              {artist.genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  },
  "features.duration_ms": (ms) => {
    return <span>{prettyMs(ms)}</span>;
  },
  "features.key": null,
  "features.mode": null,
  "features.acousticness": null,
  "features.danceability": null,
  "features.energy": null,
  "features.instrumentalness": null,
  "features.liveness": null,
  "features.loudness": null,
  "features.speechiness": null,
  "features.valence": null,
  "features.tempo": null,
};

export default () => {
  const { data, error } = useApi();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <h1>Filters</h1>
      <span>Coming soon!</span>
      <h1>Tracks</h1>
      <PreviewProvider>
        <table>
          <thead>
            <tr>
              {tableKeys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((datum) => {
              return (
                <tr key={datum.id}>
                  {Object.entries(tableProperties).map(([key, fn]) => {
                    const value = get(datum, key);
                    const hasFn = typeof fn === "function";
                    return <td key={key}>{hasFn ? fn(value) : value}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={20}>
                <Player />
              </td>
            </tr>
          </tfoot>
        </table>
      </PreviewProvider>
    </div>
  );
};
