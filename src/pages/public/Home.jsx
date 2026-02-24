import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [allGalleryItems, setAllGalleryItems] = useState([]);

  useEffect(() => {
    api.get("/public/faculty").then(res => {
      setProfile(res.data.profile);
      setMetrics(res.data.metrics);
    });

    // Load initial 6 gallery items
    api.get("/public/gallery").then(res => {
      setGallery(res.data.slice(0, 6));
      setAllGalleryItems(res.data);
    });
  }, []);

  const loadFullGallery = async () => {
    setLoadingGallery(true);
    try {
      // If we already have all items, just show them
      if (allGalleryItems.length > 6) {
        setGallery(allGalleryItems);
      } else {
        // Otherwise fetch all items
        const response = await api.get("/public/gallery?limit=100");
        setAllGalleryItems(response.data);
        setGallery(response.data);
      }
      setShowFullGallery(true);
    } catch (error) {
      console.error("Error loading full gallery:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const openPreview = (image) => {
    setSelectedImage(image);
    setPreviewOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedImage(null), 300);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // CSS Styles as JavaScript Object
  const styles = {
    keyframes: `
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .animate-blob {
        animation: blob 7s infinite;
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-pulse-slow {
        animation: pulse 3s ease-in-out infinite;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
    global: {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }
  };

  // Inject keyframes into head
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles.keyframes;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (!profile) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '96px',
          height: '96px',
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
          borderRadius: '50%',
          marginBottom: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}></div>
        <div style={{
          height: '1rem',
          width: '128px',
          background: '#cbd5e0',
          borderRadius: '0.25rem',
          marginBottom: '0.5rem'
        }}></div>
        <div style={{
          height: '0.75rem',
          width: '96px',
          background: '#e2e8f0',
          borderRadius: '0.25rem'
        }}></div>
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10000,
                backdropFilter: 'blur(5px)'
              }}
              whileHover={{ 
                scale: 1.1,
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            {/* Previous Button */}
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = gallery.findIndex(img => img.id === selectedImage.id);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : gallery.length - 1;
                setSelectedImage(gallery[prevIndex]);
              }}
              style={{
                position: 'absolute',
                left: '2rem',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10000,
                backdropFilter: 'blur(5px)'
              }}
              whileHover={{ 
                scale: 1.1,
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              ‹
            </motion.button>

            {/* Next Button */}
            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = gallery.findIndex(img => img.id === selectedImage.id);
                const nextIndex = currentIndex < gallery.length - 1 ? currentIndex + 1 : 0;
                setSelectedImage(gallery[nextIndex]);
              }}
              style={{
                position: 'absolute',
                right: '2rem',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10000,
                backdropFilter: 'blur(5px)'
              }}
              whileHover={{ 
                scale: 1.1,
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              ›
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                position: 'relative',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <img
                src={selectedImage.media_url}
                alt={selectedImage.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxHeight: '85vh'
                }}
              />
              
              {/* Image Info */}
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: 'white',
                  padding: '2rem',
                  pointerEvents: 'none'
                }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p style={{
                    fontSize: '1rem',
                    opacity: 0.9
                  }}>
                    {selectedImage.description}
                  </p>
                )}
              </motion.div>
            </motion.div>

            {/* Image Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                color: 'white',
                fontSize: '0.875rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {gallery.findIndex(img => img.id === selectedImage.id) + 1} / {gallery.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '384px',
          height: '384px',
          background: 'rgba(79, 70, 229, 0.1)',
          borderRadius: '50%',
          filter: 'blur(64px)',
          opacity: 0.2,
          animation: 'blob 7s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '384px',
          height: '384px',
          background: 'rgba(37, 99, 235, 0.1)',
          borderRadius: '50%',
          filter: 'blur(64px)',
          opacity: 0.2,
          animation: 'blob 7s infinite',
          animationDelay: '2s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '80px',
          width: '384px',
          height: '384px',
          background: 'rgba(147, 51, 234, 0.1)',
          borderRadius: '50%',
          filter: 'blur(64px)',
          opacity: 0.2,
          animation: 'blob 7s infinite',
          animationDelay: '4s'
        }}></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          color: 'white',
          padding: '6rem 0',
          overflow: 'hidden'
        }}
      >
        {/* Abstract Shape Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1
        }}>
          <svg style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '192px',
            color: 'white'
          }} fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 0,100" />
          </svg>
          <svg style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: '256px',
            width: '256px',
            color: 'white',
            opacity: 0.2
          }} fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 10
        }}>
          <motion.div 
            variants={containerVariants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '3rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            className="md:flex-row"
          >
            <motion.div 
              variants={imageVariants}
              whileHover={{ scale: 1.05 }}
              style={{
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
                filter: 'blur(20px)',
                transition: 'all 0.3s ease'
              }}></div>
              <img
                src={profile.profile_image}
                alt="Profile"
                style={{
                  position: 'relative',
                  width: '192px',
                  height: '192px',
                  borderRadius: '50%',
                  border: '4px solid white',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  objectFit: 'cover'
                }}
              />
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              style={{
                textAlign: 'center'
              }}
              className="md:text-left"
            >
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #ffffff, #e0e7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {profile.full_name}
              </h1>
              <p style={{
                marginTop: '0.5rem',
                fontSize: '1.25rem',
                color: '#e0e7ff',
                fontWeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              className="md:justify-start"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile.designation}
              </p>
              <p style={{
                marginTop: '0.5rem',
                color: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              className="md:justify-start"
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {profile.university}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Metrics Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{
          padding: '5rem 0',
          position: 'relative',
          background: 'white'
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          <motion.h2 
            variants={itemVariants}
            style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '3rem',
              color: '#1f2937',
              position: 'relative'
            }}
          >
            Academic Metrics
            <span style={{
              position: 'absolute',
              bottom: '-0.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '5rem',
              height: '0.25rem',
              background: 'linear-gradient(90deg, #4f46e5, #3b82f6)',
              borderRadius: '1rem'
            }}></span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {Object.entries(metrics).map(([key, value], index) => (
              <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  padding: '2rem',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid rgba(79, 70, 229, 0.1)'
                }}
              >
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(59, 130, 246, 0.05))',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}></div>
                
                {/* Animated Border */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #4f46e5, #3b82f6)',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease',
                  transformOrigin: 'left'
                }}></div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {value}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}>
                    {key.replace("_", " ")}
                  </p>
                </motion.div>

                {/* Decorative Icon */}
                <div style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '1rem',
                  fontSize: '2.5rem',
                  opacity: 0.1,
                  transform: 'rotate(12deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  📊
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          position: 'relative'
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 10
        }}>
          <motion.h2 
            variants={itemVariants}
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
              color: '#1f2937'
            }}
          >
            Highlights
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: '3rem',
              maxWidth: '36rem',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            Explore our memorable moments and achievements
          </motion.p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {gallery.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover="hover"
                onClick={() => openPreview(item)}
                style={{
                  position: 'relative',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  aspectRatio: '4/3'
                }}
              >
                <motion.div
                  variants={{
                    hover: { scale: 1.1 }
                  }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img
                    src={item.media_url}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Overlay Gradient */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(79, 70, 229, 0.9), rgba(79, 70, 229, 0.4), transparent)'
                    }}
                  />
                  
                  {/* Content Overlay */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1.5rem',
                      color: 'white',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>{item.title}</h3>
                    {item.description && (
                      <p style={{
                        fontSize: '0.875rem',
                        opacity: 0.9
                      }}>{item.description}</p>
                    )}
                  </motion.div>

                  {/* Zoom Icon */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {!showFullGallery && (
            <motion.div 
              variants={itemVariants}
              style={{
                textAlign: 'center',
                marginTop: '3rem'
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadFullGallery}
                disabled={loadingGallery}
                style={{
                  padding: '0.75rem 2rem',
                  background: loadingGallery ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)',
                  cursor: loadingGallery ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loadingGallery ? 0.7 : 1,
                  minWidth: '200px'
                }}
              >
                {loadingGallery ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'View Full Gallery'
                )}
              </motion.button>
            </motion.div>
          )}

          {showFullGallery && gallery.length > 6 && (
            <motion.div 
              variants={itemVariants}
              style={{
                textAlign: 'center',
                marginTop: '2rem'
              }}
            >
              <p style={{ color: '#6b7280' }}>
                Showing all {gallery.length} images
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Add keyframe for spinner animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}