export const iconGroups = [
  {
    label: "Comida",
    icons: ["Apple", "Banana", "Beef", "Cake", "Coffee", "Cookie", "Dessert", "Drink", "Egg", "GlassWater", "Grape", "IceCreamBowl", "LeanPickaxe", "Milk", "Pizza", "Popcorn", "RiceBowl", "Sandwich", "Soup", "Utensils", "UtensilsCrossed", "Wine"],
  },
  {
    label: "Transporte",
    icons: ["Ambulance", "car", "Car", "Bus", "Bike", "Ship", "Train", "TrainFront", "TramFront", "Truck", "Plane", "Fuel", "Map", "Navigation", "Navigation2"],
  },
  {
    label: "Vivienda",
    icons: ["Home", "Building", "Building2", "Warehouse", "Tent", "TreePine", "Fence", "DoorOpen", "Key", "Lock", "House", "Roof", "Lightbulb", "Plug", "PlugZap"],
  },
  {
    label: "Servicios",
    icons: ["Zap", "Wifi", "TowerControl", "Router", "Radio", "RadioTower", "Thermometer", "Droplets", "Flame", "Fan", "Wind", "CloudLightning", "Sun", "Moon"],
  },
  {
    label: "Salud",
    icons: ["Heart", "HeartPulse", "Stethoscope", "Pill", "PillBottle", "Syringe", "Bandage", "Activity", "Cross", "Hospital", "Brain", "Bone", "Eye", "Ear", "Tooth", "Vaccine"],
  },
  {
    label: "Educacion",
    icons: ["GraduationCap", "Book", "BookOpen", "BookOpenText", "Library", "Pen", "PenLine", "Pencil", "Notebook", "NotebookText", "Clipboard", "ClipboardList", "School", "Scroll", "BookMarked", "BookA"],
  },
  {
    label: "Ropa",
    icons: ["Shirt", "Shoe", "Socks", "Hat", "BaggageClaim", "Watch", "Glasses", "Ring", "Gem", "Hand", "Sparkles"],
  },
  {
    label: "Ocio",
    icons: ["Gamepad2", "Gamepad", "Controller", "Music", "Music2", "Music3", "Film", "Clapperboard", "Tv", "Monitor", "Tablet", "Smartphone", "Camera", "Headphones", "Palette", "Paintbrush", "Dices", "Drumstick", "Guitar", "Piano"],
  },
  {
    label: "Finanzas",
    icons: ["Wallet", "WalletCards", "Banknote", "Banknote", "Coins", "PiggyBank", "CreditCard", "DollarSign", "Percent", "TrendingUp", "TrendingDown", "BarChart3", "PieChart", "Receipt", "ReceiptText", "Calculator", "Scale"],
  },
  {
    label: "Compras",
    icons: ["ShoppingCart", "ShoppingBag", "ShoppingBasket", "Store", "Package", "Box", "BaggageClaim", "Gift", "Tag", "Tally1", "Tally2", "Tally3", "List", "ListChecks"],
  },
  {
    label: "Acciones",
    icons: ["CirclePlus", "CircleMinus", "CircleCheck", "CircleX", "Plus", "Minus", "Check", "X", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "RefreshCw", "Settings", "Search", "Filter", "Trash2", "Edit", "Pencil"],
  },
  {
    label: "General",
    icons: ["Circle", "Square", "Triangle", "Star", "Heart", "Flag", "Bell", "BellRing", "Calendar", "Clock", "AlertCircle", "Info", "HelpCircle", "MoreHorizontal", "MoreVertical", "CircleEllipsis", "Ellipsis", "EllipsisVertical", "Smile", "Frown", "Meh", "ThumbsUp", "ThumbsDown", "Users", "User", "Globe", "Compass", "Target", "Crosshair", "Award", "Trophy", "Medal", "Crown", "Diamond", "Sparkle", "Sunrise", "Sunset", "Cloud", "Umbrella", "Snowflake"],
  },
] as const;

export const defaultCategoryIcons: Record<string, string> = {
  Comida: "Utensils",
  Transporte: "Bus",
  Vivienda: "Home",
  Servicios: "Zap",
  Ocio: "Gamepad2",
  Salud: "HeartPulse",
  Educacion: "GraduationCap",
  Ropa: "Shirt",
  Otros: "CircleEllipsis",
};

export const defaultCategoryColors: Record<string, string> = {
  Comida: "#f97316",
  Transporte: "#06b6d4",
  Vivienda: "#8b5cf6",
  Servicios: "#eab308",
  Ocio: "#ec4899",
  Salud: "#ef4444",
  Educacion: "#3b82f6",
  Ropa: "#14b8a6",
  Otros: "#64748b",
};
