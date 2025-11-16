import { Helmet } from 'react-helmet-async';

const StructuredData = ({ data }) => {
  if (!data) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

// Helper function to generate Organization schema
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'VHASS Academy',
    alternateName: 'VHASS Softwares',
    url: 'https://www.vhassacademy.com',
    logo: 'https://www.vhassacademy.com/VHASS.png',
    description: 'VHASS Academy offers comprehensive cybersecurity training and entrepreneurship courses. Learn from industry experts and transform your career.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9-1-70, Brilliant\'s School Area',
      addressLocality: 'Ibrahimpatnam',
      addressRegion: 'Andhra Pradesh',
      postalCode: '521456',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-89853-20226',
      contactType: 'Customer Service',
      email: 'info@vhassacademy.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Telugu']
    },
    sameAs: [
      'https://www.vhassacademy.com'
    ],
    foundingDate: '2020',
    areaServed: {
      '@type': 'Country',
      name: 'India'
    }
  };
};

// Helper function to generate Course schema
export const generateCourseSchema = (course) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title || course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'VHASS Academy',
      url: 'https://www.vhassacademy.com'
    },
    courseCode: course._id,
    educationalCredentialAwarded: 'Certificate of Completion',
    teaches: course.category || 'Cybersecurity',
    coursePrerequisites: course.prerequisites || 'Basic computer knowledge',
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `https://www.vhassacademy.com/course/${course.slug || course._id}`
      }
    })
  };
};

// Helper function to generate WebSite schema
export const generateWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VHASS Academy',
    url: 'https://www.vhassacademy.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.vhassacademy.com/course?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

// Helper function to generate BreadcrumbList schema
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

export default StructuredData;

