import React, {
  FC,
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { Preview } from "../Player";

interface Preview {
  uri: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

type UsePreview = [Preview, Dispatch<SetStateAction<Preview>>];
const preview = createContext<UsePreview | undefined>(undefined);

export const useSetPreviewUri = () => {
  const [, setPreview] = useContext(preview);
  return useCallback((uri) => setPreview((preview) => ({ ...preview, uri })), [
    setPreview,
  ]);
};

export const useIsPreviewUri = (original) => {
  const [{ uri }] = useContext(preview);
  return useMemo(() => original === uri, [original, uri]);
};

export const usePreview = () => useContext(preview);

const PreviewProvider: FC = ({ children }) => (
  <preview.Provider
    value={useState({
      uri: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    })}
  >
    {children}
  </preview.Provider>
);

export default PreviewProvider;
