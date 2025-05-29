export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBt7_VVq_kLxenCM76WjXsElWJyDJQxgNc"; // It's better to use environment variables

export const DEFAULT_MAP_CENTER = {
  lat: 41.2995, // Tashkent
  lng: 69.2401,
};

export const DEFAULT_MAP_ZOOM = 12;

export const LANGUAGES: { code: "en" | "ru" | "uz"; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uz", name: "O'zbekcha" },
];
