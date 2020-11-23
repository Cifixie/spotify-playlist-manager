import React, {
  FC,
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";

const preview = createContext();

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
      timeRemaining: 0,
    })}
  >
    {children}
  </preview.Provider>
);

export default PreviewProvider;
