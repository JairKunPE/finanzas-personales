export const defaultCategories = [
  { name: "Comida", icon: "Utensils", color: "#f97316" },
  { name: "Transporte", icon: "Bus", color: "#06b6d4" },
  { name: "Vivienda", icon: "Home", color: "#8b5cf6" },
  { name: "Servicios", icon: "Zap", color: "#eab308" },
  { name: "Ocio", icon: "Gamepad2", color: "#ec4899" },
  { name: "Salud", icon: "HeartPulse", color: "#ef4444" },
  { name: "Educacion", icon: "GraduationCap", color: "#3b82f6" },
  { name: "Ropa", icon: "Shirt", color: "#14b8a6" },
  { name: "Otros", icon: "CircleEllipsis", color: "#64748b" },
] as const;

export type DefaultCategoryName = (typeof defaultCategories)[number]["name"];
