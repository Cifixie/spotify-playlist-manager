import useSWR from "swr";

const fetcher = (input, init) => fetch(input, init).then((res) => res.json());
const apiUri = "http://localhost:3000/api";

export default () => {
  return useSWR(apiUri + "/analized", fetcher);
};
