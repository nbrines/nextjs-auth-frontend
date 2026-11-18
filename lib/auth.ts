// lib/auth.ts
import { CONFIG } from "./config";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  // Try CONFIG key first, then fall back to literal "accessToken"
  const primaryKey = CONFIG?.STORAGE_KEYS?.ACCESS_TOKEN;
  const token = (primaryKey ? localStorage.getItem(primaryKey) : null) || localStorage.getItem("accessToken");

  if (!token || token === "undefined" || token === "null") {
    return null;
  }
  return token;
};

export const getUserId = (): number | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const userId = decodedPayload.sub ?? decodedPayload.id ?? decodedPayload.userId;
    return userId ? Number(userId) : null;
  } catch {
    return null;
  }
};

export const setTokens = (accessToken?: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return;

  const accessKey = CONFIG?.STORAGE_KEYS?.ACCESS_TOKEN || "accessToken";
  const refreshKey = CONFIG?.STORAGE_KEYS?.REFRESH_TOKEN || "refreshToken";

  if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
    localStorage.setItem(accessKey, accessToken);
    localStorage.setItem("accessToken", accessToken); // ensure both are set
  } else {
    localStorage.removeItem(accessKey);
    localStorage.removeItem("accessToken");
  }

  if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
    localStorage.setItem(refreshKey, refreshToken);
    localStorage.setItem("refreshToken", refreshToken); // ensure both are set
  } else {
    localStorage.removeItem(refreshKey);
    localStorage.removeItem("refreshToken");
  }
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  const accessKey = CONFIG?.STORAGE_KEYS?.ACCESS_TOKEN || "accessToken";
  const refreshKey = CONFIG?.STORAGE_KEYS?.REFRESH_TOKEN || "refreshToken";
  
  localStorage.removeItem(accessKey);
  localStorage.removeItem(refreshKey);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};