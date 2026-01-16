import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Product cards data for popular protections
const popularProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Akıllı Telefon",
    price: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_BK--b7Qg8WYYxXCgoyIB8bcYfqn-ZUUqt9W85AE_ggMmysI3U6Wu5vlaQXmlNZXjwp7VUUOTmUDo4Osb5WRxG1OjoLAaB7HZQnagrOH2B-Z5aXgDD8xm7vX7BUnJhCA1g3ugxnRhkDCo3G7hWqpsWTI9zNpPFdeFJDpGW3PUM7WOBG9xTCK9RpRJnMsmEod-r6rC992S5dDWgacJ-v4L1JfobFnxjx4-XJiUtd86wDolX8HZWoEU_YY385t2jRaCtcIpKmehXkPt",
    popular: true,
  },
  {
    id: 2,
    name: "MacBook Air M2",
    category: "Laptop",
    price: 180,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA74lmYx1O1vEnP5DJcHoiRepjepvIWIrfZwLPAvYFx8O7mA1G8tGIkcYKby7ejP3qG7i4oMl_J_RXxgmIphhzqfWeDLblkdOTteaD6zUn2wh92lSOcyDvfanTdGZctnX5sSgNLIajijCNA5KJEJpx2WdS-k3zhTgTCGao068t9PmlsxVjgjTHsIOK44svxGjnjremdrNpQJSSpXemaLRoLC9WUmXxUvyhvJc5ZUlHabvhA3gYeIEpIChahX7HkkJEZEzejDoFywiEd",
    popular: false,
  },
  {
    id: 3,
    name: "iPad Pro",
    category: "Tablet",
    price: 90,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD120jj1SjIKx_IBOLYk7gPo0XhGhqjlZ5odZNf84vappxWx8VKyJg5ugCDbTu6o5NzkAS8WWQIaJw8hwtUwBooBaHssL1lpXruKtzcEYSOOi7KIdP0qVu1nqD_AQX8vIVTtThzoVMbGOxqt0snHP0hWn30ndydrgssNPC4c6S-uRmgdM1JvnTyYjMSdIl0gR9cyZH04SEjdBDG4RmCPPa_MYauLzsE5-fUUBe7RvloAjz7ZxvbpOHuwcj08nGWzRgl7tKxMjzh-a2b",
    popular: false,
  },
  {
    id: 4,
    name: "PlayStation 5",
    category: "Oyun Konsolu",
    price: 150,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHcl0-ZF8GDUMExq2e8XOoDQvxBrFIBoGIovuqgPGxZcvCZGkaGF5znwenKk_52VVtkCvNZJ7N4kGQN2nSe7-LbWsPeCRd-xp5Gr584VBslrwOOvdFSsbm8TDoOnIWWtPb1WBEqttXARpiuSluHeBBSLgE0aG3wcw45jCRECYKETlNZWDJEhv9J0osXkkKyXSTeBfVUtUAvxXyLOFcJkFoVZg9TlSSQgC6iI5VA2q-MzIFrdydkOovogPVMSe0atjh8Ztaf__VHLhG",
    popular: false,
  },
];

// Trust indicators
const trustIndicators = [
  { icon: "verified", label: "Yetkili Servis", description: "Apple & Samsung Ortağı" },
  { icon: "build", label: "Orijinal Parça", description: "Garantili Onarım" },
  { icon: "support_agent", label: "7/24 Destek", description: "Her Zaman Yanınızda" },
  { icon: "speed", label: "Hızlı Onay", description: "24 Saat İçinde" },
];

// How it works steps
const howItWorksSteps = [
  {
    step: 1,
    title: "Cihazını Seç",
    description: "Korumak istediğin cihazı katalogdan seç veya kendin ekle.",
    icon: "devices",
  },
  {
    step: 2,
    title: "Planını Belirle",
    description: "İhtiyaçlarına uygun koruma paketini seç ve ödemeni tamamla.",
    icon: "verified_user",
  },
  {
    step: 3,
    title: "Koruma Başlasın",
    description: "Anında aktif poliçenle cihazın artık güvende.",
    icon: "shield",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Clean & Minimal */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left: Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Türkiye&apos;nin 1 Numaralı Cihaz Koruma Platformu</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                  Cihazınız İçin
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    En İyi Koruma
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8">
                  Ekran kırılması, sıvı teması, hırsızlık... Ne olursa olsun, cihazınız Waypla güvencesiyle korunuyor.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/planlar"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                  >
                    <span>Ürünleri İncele</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                  <Link
                    href="/hasar-bildir"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-orange-500 text-[20px]">report_problem</span>
                    <span>Hasar Bildir</span>
                  </Link>
                </div>
              </div>

              {/* Right: Abstract Tech Visual */}
              <div className="flex-1 w-full max-w-lg lg:max-w-none">
                <div className="relative">
                  {/* Decorative blurs */}
                  <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

                  {/* Main image container */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl p-6 shadow-2xl shadow-gray-200/50">
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE57JmgJM9JaPNx9-Lx3tDb2eIXtvyh4ZlOFBdq1XqESVVYYRYCbe5_64wI_McXt0IAdtfdcuz7uNKPeoXj5m7ln56znuoo7B71gIRxGYAyhFje6W0Ar-zVs4eHhBJsrsu_CmccuD7I1OT1YdOxntjmpx7h3GKT-U9eAYmK8L_une2ggxmoEuZdA_DEQHSLUT9qghydoPpoZIKO8qpNV6oY9U9k_UnEE0aVxUc4CTAV3fQkRxVoAN6DGu5ZoXlDNQdLMTH4c90M3p-"
                        alt="Premium cihaz koruma hizmeti"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    </div>

                    {/* Floating stats card */}
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-green-600 text-[20px]">trending_up</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Müşteri Memnuniyeti</p>
                          <p className="text-lg font-bold text-gray-900">%98</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators Band */}
        <section className="py-8 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trustIndicators.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-600 text-[24px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Products Grid */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Popüler Koruma Planları
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                En çok tercih edilen cihazlar için hazır koruma paketleri. Hemen satın alın, anında koruma başlasın.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
                >
                  {product.popular && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                      En Popüler
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="aspect-square w-full mb-4 rounded-xl bg-gray-50 overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</p>
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600">₺{product.price}</span>
                      <span className="text-sm text-gray-500">/ ay</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/teklif?product=${product.id}`}
                      className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm font-semibold text-center rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Satın Al
                    </Link>
                    <Link
                      href={`/planlar?product=${product.id}`}
                      className="py-2.5 px-4 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Detaylar
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-10">
              <Link
                href="/planlar"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                <span>Tüm Ürünleri Görüntüle</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Nasıl Çalışır?
              </h2>
              <p className="text-lg text-gray-600">
                3 basit adımda cihazınızı koruma altına alın
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {howItWorksSteps.map((step, i) => (
                <div key={step.step} className="relative text-center">
                  {/* Connector line (hidden on mobile) */}
                  {i < howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200" style={{ transform: 'translateX(50%)' }}></div>
                  )}

                  {/* Step circle */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-6">
                    <span className="material-symbols-outlined text-[32px]">{step.icon}</span>
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Cihazınızı Korumaya Başlayın
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Dakikalar içinde poliçenizi oluşturun ve cihazınız için kapsamlı koruma güvencesine kavuşun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/teklif"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                <span>Hemen Teklif Al</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link
                href="/planlar"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <span>Planları İncele</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-gray-900 mb-1">50K+</p>
                <p className="text-gray-600">Aktif Müşteri</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900 mb-1">1000+</p>
                <p className="text-gray-600">Servis Noktası</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900 mb-1">%98</p>
                <p className="text-gray-600">Memnuniyet Oranı</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900 mb-1">&lt;24h</p>
                <p className="text-gray-600">Ortalama Onay Süresi</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
