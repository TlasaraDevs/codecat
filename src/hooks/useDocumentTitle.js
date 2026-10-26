import { useEffect } from "react";
import { SITE_NAME } from "@/config";

const DEFAULT_TITLE = document.title;

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
};
