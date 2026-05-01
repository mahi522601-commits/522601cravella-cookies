import { useEffect } from "react";
import {
  getSiteSettings,
  listenToSiteSettings,
  saveSiteSettings,
} from "@/services/firestore";
import { useUiStore } from "@/store/uiStore";

export const useSiteSettings = () => {
  const siteSettings = useUiStore((state) => state.siteSettings);
  const setSiteSettings = useUiStore((state) => state.setSiteSettings);

  useEffect(() => {
    let mounted = true;

    getSiteSettings()
      .then((response) => {
        if (mounted) {
          setSiteSettings(response);
        }
      })
      .catch(() => undefined);

    const unsubscribe = listenToSiteSettings((response) => {
      if (mounted) {
        setSiteSettings(response);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [setSiteSettings]);

  return {
    siteSettings,
    saveSettings: saveSiteSettings,
  };
};
