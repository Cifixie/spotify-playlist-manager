import React, { useMemo } from "react";
import useSWR from "swr";
import { Controller, useForm } from "react-hook-form";
import sift from "sift";

const fetcher = (input, init) => fetch(input, init).then((res) => res.json());
const apiUri = "http://localhost:3000/api";

const snuf = {
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

const defaultValues = {
  offset: 0,
  acousticness: { $gte: 0, $lte: 1, active: false },
  danceability: { $gte: 0, $lte: 1, active: false },
  energy: { $gte: 0, $lte: 1, active: false },
  instrumentalness: { $gte: 0, $lte: 1, active: false },
  liveness: { $gte: 0, $lte: 1, active: false },
  loudness: { $gte: -60, $lte: 0, active: false },
  speechiness: { $gte: 0, $lte: 1, active: false },
  valence: { $gte: 0, $lte: 1, active: false },
  tempo: { $gte: 0, $lte: 200, active: false },
  key: { $gte: 0, $lte: 11, active: false },
  mode: { $gte: -1, $lte: 1, active: false },
};

export default () => {
  const { data, error } = useSWR(apiUri + "/analized", fetcher);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues,
  });

  const values = getValues();
  const filter = useMemo(() => {
    const filtering = Object.entries(values).reduce((acc, [key, v]) => {
      if (typeof v === "object") {
        const { active, ...filters } = v;
        if (active) {
          acc[key] = Object.fromEntries(
            Object.entries(filters).map(([key, v]: [string, string]) => [
              key,
              parseFloat(v),
            ])
          );
        }
      }
      return acc;
    }, {});
    console.log(filtering);
    return sift(filtering);
  }, [values]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const keys = Object.keys(data[0]);
  const offset = watch("offset");

  const onSetFilter = (key, value) => {
    setValue(`${key}.$gte`, value - value * offset * (value < 0 ? -1 : 1));
    setValue(`${key}.$lte`, value + value * offset * (value < 0 ? -1 : 1));
    setValue(`${key}.active`, true);
  };
  return (
    <div>
      <div>
        <h1>
          Filters
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </h1>
        <label>
          <span>offset:</span>
          <input
            type="range"
            name="offset"
            step="0.01"
            min="0"
            max="1"
            ref={register}
          />
          <span>{`${Math.round(offset * 100)} %`}</span>
        </label>
        <div className="togglable">
          <button>Show</button>
          <form onSubmit={handleSubmit(() => console.log("SUBMITTED"))}>
            {Object.entries(snuf).map(([property, properties]) => {
              return (
                <fieldset key={property}>
                  <legend>{property}</legend>

                  <input
                    type="checkbox"
                    name={`${property}.active`}
                    ref={register}
                  />
                  <label>
                    <input
                      name={`${property}.$gte`}
                      type="range"
                      ref={register}
                      {...properties}
                    />
                    <span>{watch(`${property}.$gte`)}</span>
                  </label>
                  <label>
                    <input
                      name={`${property}.$lte`}
                      type="range"
                      ref={register}
                      {...properties}
                    />
                    <span>{watch(`${property}.$lte`)}</span>
                  </label>
                </fieldset>
              );
            })}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <h1>Tracks</h1>
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.filter(filter).map((datum) => (
            <tr key={datum.id}>
              {Object.entries(datum).map(([key, value]) => (
                <td key={key} onClick={() => onSetFilter(key, value)}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
