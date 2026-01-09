import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ClaimManagementPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
              <div className="flex-1 flex flex-col gap-6 text-center lg:text-left z-10">
                <div>
                  <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-xs mb-4 uppercase tracking-wider">7/24 Kesintisiz Destek</span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1]">
                    Hasar Yönetimi <br/><span className="text-accent">ve Takibi</span>
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                  Cihazınızda oluşan hasarı endişe etmeyin. waypla hızlı bildirim sistemi ile süreci başlatın, uzman ekibimiz en kısa sürede onarım veya değişim işlemlerini tamamlasın.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/hasar/bildir">
                    <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-accent hover:bg-orange-600 text-white text-base font-bold shadow-lg shadow-accent/30 transition-all hover:scale-105">
                      <span className="material-symbols-outlined">add_circle</span>
                      Hasar Bildir
                    </button>
                  </Link>
                  <Link href="/hesabim">
                    <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-white dark:bg-[#1a2634] border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white text-base font-medium hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors">
                      <span className="material-symbols-outlined">search</span>
                      Durum Sorgula
                    </button>
                  </Link>
                </div>
                <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    <span>Yetkili Servis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    <span>Orijinal Parça</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-white dark:from-[#1a2634] dark:to-[#111418] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl">
                  <div className="aspect-[4/3] w-full bg-cover bg-center rounded-xl overflow-hidden relative group" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0CtxZzp5nXiBJXPFMJF62kyRuBbSmdIzZ-DKeyJ11noME3ViyjcFiC_t8S-yRvzXh4t6lGD4UDaqowpSRYk7n4ysj-_UQsTwrVR0lqWIJh3YVwCFvtpZVSXTMiZtI2mGOckmBCugdtW_rpPpuJH4TZkGlbFqChl3PdIeYY8Jd20Hmyq3wkMn_IQ0fJNZAwWPz2jyBELgbugk6jGt2wOlYdGZOqjf3fJCMXOjov8BZbEArfUN9vD4nQMQ0AyG2-4KB_UOPnWpqOW0i')"}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">Hızlı Hasar Çözümü</p>
                      <p className="text-sm opacity-90">24 Saat İçinde Değerlendirme</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-background-light dark:bg-[#101822]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">Şeffaf Hasar Süreci</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Hasar bildiriminden teslimata kadar her adımı sizin için şeffaflaştırdık. Sadece 4 adımda cihazınız ilk günkü gibi.
              </p>
            </div>
            <div className="relative">
              <div className="hidden lg:block absolute top-[24px] left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { num: "1", icon: "edit_document", title: "Hasar Bildirimi", desc: "Web sitemizden formu doldurun ve hasarlı cihazın fotoğraflarını yükleyin.", active: true },
                  { num: "2", icon: "find_in_page", title: "Değerlendirme", desc: "Uzman ekibimiz 24 saat içinde talebinizi inceler ve onay sürecini başlatır.", active: false },
                  { num: "3", icon: "build", title: "Onarım & Değişim", desc: "Cihazınız yetkili serviste orijinal parçalarla onarılır veya yenisiyle değiştirilir.", active: false },
                  { num: "4", icon: "local_shipping", title: "Teslimat & Takip", desc: "İşlem tamamlandığında cihazınız adresinize kargolanır, anlık takip edebilirsiniz.", active: false },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className={`size-12 rounded-full ${step.active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white dark:bg-[#1a2634] border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'} flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="material-symbols-outlined">{step.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "timer", title: "Hızlı Sonuç", desc: "Taleplerin %95'i ilk 24 saat içinde sonuçlandırılır.", color: "blue" },
                { icon: "verified", title: "Garantili İşlem", desc: "Yapılan tüm onarımlar 6 ay parça garantisi altındadır.", color: "green" },
                { icon: "support_agent", title: "Canlı Destek", desc: "Süreç boyunca aklınıza takılan her şey için yanınızdayız.", color: "purple" },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background-light dark:bg-[#1a2634] shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className={`size-12 rounded-lg ${feature.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : feature.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'} flex items-center justify-center flex-none`}>
                    <span className="material-symbols-outlined">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111418] dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

