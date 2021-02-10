import React, { useRef, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  usePreview,
  useSetPreviewUri,
  useIsPreviewUri,
} from "./context/preview";

const Player = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  background: none;
  padding: 1rem;
`;

const Info = styled.div`
  flex-grow: 1;
  margin: 0 1rem;
  display: grid;
  grid-template-areas: "progressBar";
`;

const ProgressBar = styled.div`
  border-radius: 1rem;
  height: 1rem;
  width: 0;
  background-color: blue;
  grid-area: progressBar;
`;

const Backtrack = styled(ProgressBar)`
  width: 100%;
  background-color: lightgray;
`;

export const Preview = ({ uri }) => {
  const setPreviewUri = useSetPreviewUri();
  const isPreviewUri = useIsPreviewUri(uri);
  return (
    <Button onClick={() => setPreviewUri(isPreviewUri ? null : uri)}>
      <i className={`fas fa-${isPreviewUri ? "stop" : "play"}-circle`} />
    </Button>
  );
};

export default () => {
  const [{ uri, isPlaying, currentTime, duration }, setPreview] = usePreview();

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && uri) {
      ref.current.play();
      return () => {
        ref.current.pause();
      };
    }
  }, [uri]);

  const icon = useMemo(() => (uri && isPlaying ? "pause" : "play"), [
    uri,
    isPlaying,
  ]);

  return (
    <Player>
      <Button
        onClick={() => {
          if (isPlaying) {
            ref.current.pause();
          } else {
            ref.current.play();
          }
        }}
      >
        <i className={`far fa-${icon}-circle`} />
      </Button>
      <Info>
        <Backtrack />
        <ProgressBar style={{ width: `${(currentTime / duration) * 100}%` }} />
      </Info>
      <audio
        autoPlay
        ref={ref}
        src={uri}
        onPlay={() => setPreview((p) => ({ ...p, isPlaying: true }))}
        onPause={() => setPreview((p) => ({ ...p, isPlaying: false }))}
        onTimeUpdate={(e) => {
          const {
            //@ts-ignore
            target: { currentTime, duration },
          } = e;
          setPreview((p) => ({
            ...p,
            currentTime,
            duration,
          }));
        }}
        onEnded={() => {
          setPreview({
            uri: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
          });
        }}
      ></audio>
    </Player>
  );
};
