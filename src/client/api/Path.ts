import Constants from "expo-constants";
import { Platform } from "react-native";

// Get development server IP address for physical devices
// This uses Expo's manifest to get the LAN IP where Metro bundler is running
const getLocalIpAddress = (): string => {
  // For Expo Go on physical devices
  if (Constants.expoConfig?.hostUri) {
    const hostUri = Constants.expoConfig.hostUri;
    const hostIp = hostUri.split(":")[0]; // Extract IP from hostUri (IP:PORT)
    return `http://${hostIp}:8080/api`;
  }
  return "http://localhost:8080/api"; // Fallback
};

// Local development server URLs based on platform and device type
const LOCAL_DEV_URL = Platform.select({
  // Android emulator needs special IP for localhost
  android: Constants.isDevice
    ? getLocalIpAddress() // Physical Android device - use LAN IP
    : "http://10.0.2.2:8080/api", // Android emulator

  // iOS simulator can use localhost, physical devices need LAN IP
  ios: Constants.isDevice
    ? getLocalIpAddress() // Physical iOS device - use LAN IP
    : "http://localhost:8080/api", // iOS simulator

  // Default fallback for web
  default: "http://localhost:8080/api",
});

// Select which URL to use (switch to PROD_URL when deploying)
const API_ROOT = process.env.EXPO_PUBLIC_API_URL ?? LOCAL_DEV_URL;

console.log(`Using API endpoint: ${API_ROOT}`);

const buildUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedRoot = API_ROOT.endsWith("/")
    ? API_ROOT.slice(0, -1)
    : API_ROOT;

  return `${normalizedRoot}${normalizedPath}`;
};

export const ApiPaths = {
  root: API_ROOT,

  users: {
    get: (id: string) => buildUrl(`/users/profile/${id}`),
    login: () => buildUrl("/users/login"),
    logout: () => buildUrl("/users/logout"),
    get_user_profile: () => buildUrl("/users/me"),
    update_user_profile: () => buildUrl("/users/me"),
  },

  animals: {
    root: buildUrl("/animals"),
    get: (id: number) => buildUrl(`/animals/${id}`),
    create: buildUrl("/animals"),
    update: (id: number) => buildUrl(`/animals/${id}`),
    delete: (id: number) => buildUrl(`/animals/${id}`),
    get_user_animals: buildUrl("/animals/me"),
    get_all: buildUrl("/animals"),
  },

  requests: {
    root: buildUrl("/requests"),
    get: (id: string) => buildUrl(`/requests/${id}`),
    create: buildUrl("/requests"),
    update: (id: string) => buildUrl(`/requests/${id}`),
    delete: (id: string) => buildUrl(`/requests/${id}`),
    get_user_requests: buildUrl("/requests/me"),
    get_all: buildUrl("/requests"),
  },

  clinics: {
    root: buildUrl("/clinics"),
    get: (id: number) => buildUrl(`/clinics/${id}`),
    create: buildUrl("/clinics"),
    update: (id: number) => buildUrl(`/clinics/${id}`),
    delete: (id: number) => buildUrl(`/clinics/${id}`),
    get_all: buildUrl("/clinics"),
  },

  checkups: {
    root: buildUrl("/checkups"),
    get: (id: number) => buildUrl(`/checkups/${id}`),
    create: buildUrl("/checkups"),
    update: (id: number) => buildUrl(`/checkups/${id}`),
    delete: (id: number) => buildUrl(`/checkups/${id}`),
    get_all: buildUrl("/checkups"),
  },

  supplies: {
    root: buildUrl("/supplies"),
    get: (clinicId: number, supplyId: number) =>
      buildUrl(`/supplies/${clinicId}/supplies/${supplyId}`),
    create: buildUrl("/supplies"),
    associateSupply: (clinicId: number) =>
      buildUrl(`/supplies/${clinicId}/supplies`),
    update: (clinicId: number, supplyId: number) =>
      buildUrl(`/supplies/${clinicId}/supply/${supplyId}`),
    delete: (clinicId: number, supplyId: number) =>
      buildUrl(`/supplies/${clinicId}/supply/${supplyId}`),
    get_all: buildUrl("/supplies"),
    get_clinic_supplies: (clinicId: number) =>
      buildUrl(`/supplies/${clinicId}/supplies`),
    get_supply: (supplyId: number) => buildUrl(`/supplies/${supplyId}`),
  },

  guides: {
    root: buildUrl("/guides"),
    get: (id: number) => buildUrl(`/guides/${id}`),
    create: buildUrl("/guides"),
    update: (id: number) => buildUrl(`/guides/${id}`),
    delete: (id: number) => buildUrl(`/guides/${id}`),
    get_all: buildUrl("/guides"),
  },
};
