import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: scrollY * 0.5 }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758182042983-e87a6fc89053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwZmxhZyUyMGhlcml0YWdlfGVufDF8fHx8MTc2MTE4MDIzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Vietnam Heritage"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background/90" />
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top decorative pattern */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-8 left-1/2 -translate-x-1/2"
          >
            <svg viewBox="0 0 200 100" className="w-48 h-24 text-primary/20" fill="currentColor">
              <path d="M10 50 Q 50 20, 100 50 T 190 50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
              <circle cx="100" cy="50" r="3" />
              <circle cx="40" cy="40" r="2" opacity="0.7"/>
              <circle cx="160" cy="40" r="2" opacity="0.7"/>
            </svg>
          </motion.div>

          {/* Vietnamese pattern decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute top-1/4 left-12 w-32 h-32 opacity-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-1/4 right-12 w-40 h-40 opacity-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary" fill="currentColor">
              <path d="M50 10 L55 40 L85 40 L62 58 L70 88 L50 70 L30 88 L38 58 L15 40 L45 40 Z" opacity="0.6"/>
            </svg>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-8 max-w-6xl"
        >
          {/* Decorative Header with Clock Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-block mb-8">
              <div className="flex items-center gap-6 mb-8">
                <motion.div 
                  animate={{ width: [0, 80] }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-px bg-gradient-to-r from-transparent to-primary"
                />
                
                {/* Clock Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 60 60" className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(139,105,20,0.5)]">
                    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                    <path d="M30 10 L30 30 L45 40" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="30" cy="30" r="3" fill="currentColor"/>
                    {/* Hour marks */}
                    <circle cx="30" cy="8" r="1.5" fill="currentColor" opacity="0.6"/>
                    <circle cx="30" cy="52" r="1.5" fill="currentColor" opacity="0.6"/>
                    <circle cx="8" cy="30" r="1.5" fill="currentColor" opacity="0.6"/>
                    <circle cx="52" cy="30" r="1.5" fill="currentColor" opacity="0.6"/>
                  </svg>
                </motion.div>
                
                <motion.div 
                  animate={{ width: [0, 80] }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-px bg-gradient-to-l from-transparent to-primary"
                />
              </div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-6xl md:text-8xl text-white mb-4 tracking-wider drop-shadow-2xl" 
              style={{ fontFamily: 'serif' }}
            >
              Echoes of Viet Nam
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex items-center justify-center gap-3 mb-12"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(139,105,20,0.8)]" 
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(139,105,20,0.8)]" 
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(139,105,20,0.8)]" 
              />
            </motion.div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="space-y-6 mb-12"
          >
            <p className="text-3xl md:text-4xl text-white/90" style={{ fontFamily: 'serif' }}>
              Chào mừng bạn đến với
            </p>
            <h2 className="text-4xl md:text-6xl text-primary tracking-wide drop-shadow-[0_0_20px_rgba(139,105,20,0.6)]" style={{ fontFamily: 'serif' }}>
              Thế Giới Lịch Sử Việt Nam
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Hành trình khám phá những dấu ấn lịch sử hào hùng, từ những ngày đấu tranh giành độc lập 
            đến thời đại xây dựng và phát triển đất nước
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2 px-10 py-6 rounded-sm shadow-[0_0_20px_rgba(139,105,20,0.4)] hover:shadow-[0_0_30px_rgba(139,105,20,0.6)] transition-all">
              Bắt Đầu Khám Phá <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-sm px-10 py-6 backdrop-blur-sm">
              Tìm Hiểu Thêm
            </Button>
          </motion.div>
        </motion.div>

        {/* Side Decorative Indicators */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3"
        >
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent"
          />
          <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(139,105,20,0.8)]" />
          <div className="w-2 h-2 bg-white/50 rounded-full" />
          <div className="w-2 h-2 bg-white/30 rounded-full" />
        </motion.div>

        {/* Decorative scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-3 bg-white/60 rounded-full"
              />
            </div>
          </motion.div>
          <p className="text-white/60 text-xs mt-3 tracking-wider">SCROLL</p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 border border-primary/30 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-primary/30 rounded-full" />
        </div>
        
        <div className="container mx-auto px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-1 bg-primary mx-auto mb-8" />
            <h2 className="text-5xl mb-8" style={{ fontFamily: 'serif' }}>
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Echoes of Viet Nam được thành lập với sứ mệnh lưu giữ và lan tỏa những giá trị lịch sử quý báu 
              của dân tộc Việt Nam. Chúng tôi tin rằng, thông qua việc tìm hiểu quá khứ, thế hệ trẻ sẽ hiểu rõ hơn 
              về nguồn gốc, truyền thống và tự hào về bản sắc văn hóa của mình.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl mb-3">Giáo Dục</h3>
                <p className="text-muted-foreground text-sm">
                  Cung cấp kiến thức lịch sử chính xác và sinh động
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl mb-3">Lan Tỏa</h3>
                <p className="text-muted-foreground text-sm">
                  Kết nối cộng đồng yêu lịch sử Việt Nam
                </p>
              </div>
              <div className="p-6 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl mb-3">Lưu Giữ</h3>
                <p className="text-muted-foreground text-sm">
                  Bảo tồn di sản văn hóa cho thế hệ tương lai
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
