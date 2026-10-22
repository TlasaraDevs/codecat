import { useEffect, useState } from "react";

// Runs a content getter from lib/content.js and tracks its result.
//   const { data, loading, error } = useContent(getProjects);
//   const { data } = useContent(getPostBySlug, slug);
export const useContent = (getter, arg) => {
  const [state, setState] = useState({ data: undefined, loading: true, error: null });

  useEffect(() => {
    let active = true;
    getter(arg).then(
      (data) => active && setState({ data, loading: false, error: null }),
      (error) => active && setState({ data: undefined, loading: false, error })
    );
    return () => {
      active = false;
    };
  }, [getter, arg]);

  return state;
};
