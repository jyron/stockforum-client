import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdSenseLoader = () => {
  const location = useLocation();

  useEffect(() => {
    // List of paths where we don't want ads - specific to this website
    const noAdPaths = [
      "/login",
      "/register",
      "/profile",
      "/admin/articles",
      "/new-conversation",
    ];

    // Check if current path should have ads
    const shouldLoadAds = !noAdPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    if (shouldLoadAds) {
      // Only load the script if it hasn't been loaded yet
      if (!document.querySelector('script[src*="googlesyndication"]')) {
        const script = document.createElement("script");
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7512220650451666`;
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }
  }, [location.pathname]);

  return null;
};

export default AdSenseLoader;
