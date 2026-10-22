import { useEffect } from "react";

const DEFAULT_TITLE = document.title;

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · codecat` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
};
