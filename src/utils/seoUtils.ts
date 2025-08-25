// SEO Utility Functions and Constants

export const SEO_CONSTANTS = {
  SITE_NAME: 'HabitLink',
  SITE_URL: 'https://habit-link.com',
  DEFAULT_IMAGE: 'https://habit-link.com/habitlinklogo2.svg',
  DEFAULT_DESCRIPTION: 'Track habits, connect them to goals, and see clear progress with detailed charts and insights. Build habits that stick with HabitLink.',
  DEFAULT_KEYWORDS: 'habit tracker, goal tracker, productivity app, consistency tracking, streaks, self improvement, habit building, goal achievement, personal development, habit analytics'
};

export const PAGE_SEO_CONFIG = {
  home: {
    title: 'HabitLink - Build Habits & Achieve Goals | Free Habit Tracking App',
    description: 'Track habits, connect them to goals, and see clear progress with detailed charts and insights. Build habits that stick with HabitLink\'s advanced analytics and goal tracking. Start free today!',
    keywords: 'habit tracker, goal tracker, productivity app, consistency tracking, streaks, self improvement, habit building, goal achievement, personal development, habit analytics, free habit tracker',
    url: SEO_CONSTANTS.SITE_URL
  },
  dashboard: {
    title: 'Dashboard | HabitLink - Track Your Habits & Goals',
    description: 'View your habit tracking dashboard with detailed analytics, progress charts, and goal insights. Monitor consistency, strength, and progress towards your goals.',
    keywords: 'habit dashboard, goal tracking, progress analytics, habit consistency, goal progress, habit strength, tracking dashboard',
    url: `${SEO_CONSTANTS.SITE_URL}/dashboard`
  },
  stats: {
    title: 'Habit Statistics & Analytics | HabitLink',
    description: 'View detailed habit statistics, consistency analytics, and performance insights. Track your habit progress with comprehensive charts and metrics.',
    keywords: 'habit statistics, habit analytics, consistency tracking, habit performance, habit metrics, habit charts, habit insights',
    url: `${SEO_CONSTANTS.SITE_URL}/stats`
  },
  goals: {
    title: 'Goal Tracking & Management | HabitLink',
    description: 'Set, track, and achieve your goals with HabitLink. Link habits to goals for automatic progress tracking and detailed goal analytics.',
    keywords: 'goal tracking, goal management, goal setting, goal achievement, habit goals, progress tracking',
    url: `${SEO_CONSTANTS.SITE_URL}/goals`
  },
  help: {
    title: 'Help & Support | HabitLink',
    description: 'Get help with HabitLink. Learn how to track habits, set goals, and use our advanced analytics features effectively.',
    keywords: 'habit link help, support, tutorial, how to use habit tracker, habit tracking guide',
    url: `${SEO_CONSTANTS.SITE_URL}/help`
  }
};

// Generate structured data for different page types
export const generateStructuredData = (type: 'WebApplication' | 'Article' | 'FAQPage', data?: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": SEO_CONSTANTS.SITE_NAME,
    "description": SEO_CONSTANTS.DEFAULT_DESCRIPTION,
    "url": SEO_CONSTANTS.SITE_URL,
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": SEO_CONSTANTS.SITE_NAME
    },
    "featureList": [
      "Habit Tracking",
      "Goal Setting", 
      "Progress Analytics",
      "Consistency Monitoring",
      "Streak Tracking",
      "Dark Mode",
      "Mobile Responsive"
    ]
  };

  return { ...baseData, ...data };
};

// Generate meta description with proper length
export const generateMetaDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) {
    return description;
  }
  
  const truncated = description.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// Generate canonical URL
export const generateCanonicalUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONSTANTS.SITE_URL}${cleanPath}`;
};

// Generate Open Graph data
export const generateOpenGraphData = (title: string, description: string, image?: string, url?: string) => ({
  'og:title': title,
  'og:description': description,
  'og:image': image || SEO_CONSTANTS.DEFAULT_IMAGE,
  'og:url': url || SEO_CONSTANTS.SITE_URL,
  'og:type': 'website',
  'og:site_name': SEO_CONSTANTS.SITE_NAME,
  'og:locale': 'en_US'
});

// Generate Twitter Card data
export const generateTwitterCardData = (title: string, description: string, image?: string, url?: string) => ({
  'twitter:card': 'summary_large_image',
  'twitter:title': title,
  'twitter:description': description,
  'twitter:image': image || SEO_CONSTANTS.DEFAULT_IMAGE,
  'twitter:url': url || SEO_CONSTANTS.SITE_URL
});
