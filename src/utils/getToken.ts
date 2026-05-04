export const getCodeFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("c");
  if (code) {
    window.history.replaceState({}, "", window.location.pathname);
  }
  return code;
};