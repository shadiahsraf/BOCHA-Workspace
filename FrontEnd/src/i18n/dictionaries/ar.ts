import type { TranslationSchema } from '../types';

export const ar = {
  common: {
    appName: 'BOCHA Workspace',
    tagline: 'منصة الإنتاجية الشخصية بالذكاء الاصطناعي',
    save: 'حفظ',
    cancel: 'إلغاء',
    loading: 'جارٍ التحميل...',
  },
  theme: {
    title: 'المظهر والسمات',
    light: 'فاتح',
    dark: 'داكن',
    system: 'تلقائي',
    selectedPreference: 'الوضع المحدد',
    resolvedTheme: 'السمة المفعلة',
    domClass: 'فئة <html> في المستند',
    colorScheme: 'نمط ألوان المتصفح',
  },
  locale: {
    title: 'اللغة والمنطقة',
    english: 'English',
    arabic: 'العربية',
    currentLanguage: 'اللغة الحالية',
    layoutDirection: 'اتجاه التخطيط',
    activeTypography: 'الخط النشط',
    previewCardTitle: 'التخطيط ثنائي الاتجاه والخصائص المنطقية',
    previewCardDesc: 'تنعكس هذه البطاقة أفقياً تلقائياً عبر الخصائص المنطقية للـ CSS وتدوير الأيقونات الموجهة.',
    navigationAction: 'استكشاف مساحة العمل',
  },
  verification: {
    heading: 'معرض نظام التصميم والمعمارية',
    subheading: 'رموز تصميم المرحلة الثانية، معمارية المظهر للمرحلة 3.2 وتدويل اللغات للمرحلة 3.3',
  },
} satisfies TranslationSchema;
