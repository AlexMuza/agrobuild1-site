import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET_PX = 80;
const MAX_ATTEMPTS = 30;

function getHashTargetId(hash: string) {
  if (!hash) return "";
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = getHashTargetId(location.hash);
    if (!id) return;

    let cancelled = false;
    let attempts = 0;

    const tryScroll = () => {
      if (cancelled) return;
      attempts += 1;

      const el = document.getElementById(id);
      if (!el) {
        if (attempts < MAX_ATTEMPTS) requestAnimationFrame(tryScroll);
        return;
      }

      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    tryScroll();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.hash]);

  return null;
}

