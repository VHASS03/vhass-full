import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'VHASS Academy - Cybersecurity & Entrepreneurship Courses',
  description = 'VHASS Academy offers comprehensive cybersecurity training and entrepreneurship courses. Learn from industry experts and transform your career with hands-on experience.',
  keywords = 'cybersecurity courses, entrepreneurship training, online courses, VHASS Academy, cybersecurity training India, learn cybersecurity, cybersecurity certification',
  image = 'https://www.vhassacademy.com/VHASS.png',
  url = 'https://www.vhassacademy.com',
  type = 'website',
  author = 'VHASS Academy',
  canonical = null,
}) => {
  const fullTitle = title.includes('VHASS') ? title : `${title} | VHASS Academy`;
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="VHASS Academy" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@vhassacademy" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#5a2d82" />
      <meta name="msapplication-TileColor" content="#5a2d82" />
      <meta name="application-name" content="VHASS Academy" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-AP" />
      <meta name="geo.placename" content="Ibrahimpatnam, Andhra Pradesh" />
      <meta name="geo.position" content="17.0;80.0" />
      <meta name="ICBM" content="17.0, 80.0" />
    </Helmet>
  );
};

export default SEO;

