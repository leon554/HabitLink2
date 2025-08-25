import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

export default function SEO({
  title = "HabitLink - Build Habits & Achieve Goals | Habit Tracking App",
  description = "Track habits, connect them to goals, and see clear progress with detailed charts and insights. Build habits that stick with HabitLink's advanced analytics and goal tracking.",
  keywords = "habit tracker, goal tracker, productivity app, consistency tracking, streaks, self improvement, habit building, goal achievement, personal development, habit analytics",
  image = "https://habit-link.com/habitlinklogo2.svg",
  url = "https://habit-link.com",
  type = "website",
  structuredData
}: SEOProps) {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "HabitLink",
    "description": description,
    "url": url,
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "HabitLink"
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

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="HabitLink" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(defaultStructuredData)}
        </script>
      )}
    </Helmet>
  );
}
