import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PartnersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 flex flex-col gap-6 text-center lg:text-left z-10">
                <div>
                  <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs mb-4 uppercase tracking-wider">İş Ortaklığı Programı</span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1]">
                    Gelirlerinizi <br /><span className="text-accent">Artırın.</span>
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                  E-ticaret sitenizde, mağazanızda veya uygulamanızda waypla sigorta ürünlerini sunun. Zahmetsiz entegrasyon ile ek gelir modeli oluşturun.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/iletisim">
                    <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-accent hover:bg-orange-600 text-white text-base font-bold shadow-lg shadow-accent/30 transition-all hover:scale-105">
                      Partner Ol
                    </button>
                  </Link>
                  <a href="#entegrasyon" className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-white dark:bg-[#1a2634] border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white text-base font-medium hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors">
                    Nasıl Çalışır?
                  </a>
                </div>
              </div>
              <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-white dark:from-[#1a2634] dark:to-[#111418] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl">
                  <div className="aspect-[4/3] w-full bg-cover bg-center rounded-xl overflow-hidden relative group" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHcl0-ZF8GDUMExq2e8XOoDQvxBrFIBoGIovuqgPGxZcvCZGkaGF5znwenKk_52VVtkCvNZJ7N4kGQN2nSe7-LbWsPeCRd-xp5Gr584VBslrwOOvdFSsbm8TDoOnIWWtPb1WBEqttXARpiuSluHeBBSLgE0aG3wcw45jCRECYKETlNZWDJEhv9J0osXkkKyXSTeBfVUtUAvxXyLOFcJkFoVZg9TlSSQgC6iI5VA2q-MzIFrdydkOovogPVMSe0atjh8Ztaf__VHLhG')" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">B2B2C Çözümler</p>
                      <p className="text-sm opacity-90">API & Widget Entegrasyonu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Models */}
        <section className="py-16 bg-background-light dark:bg-[#101822]" id="entegrasyon">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">Size Uygun İş Modeli</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Hangi sektörde olursanız olun, müşterilerinize değer katacak bir çözümümüz var.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Perakende", icon: "storefront", desc: "Mağaza içi satış ekranlarına entegre olun, cihaz satarken sigortayı da tek tıkla ekleyin." },
                { title: "E-Ticaret", icon: "shopping_cart", desc: "Checkout sayfasında veya ürün detayında 'Sepete Ekle' butonu ile çapraz satış yapın." },
                { title: "Telekom", icon: "cell_tower", desc: "Tarifeye ek cihaz kampanyalarınızla birlikte sigorta paketlerini bundle yapın." },
                { title: "Finans", icon: "account_balance", desc: "Bankacılık uygulamanız üzerinden müşterilerinize cihaz sigortası sunun." },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-[#1a2634] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-6">Neden waypla Partner?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#111418] dark:text-white">Yüksek Komisyon</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Her poliçe satışından tatmin edici gelir payı elde edin.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">api</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#111418] dark:text-white">Kolay API</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Modern REST API ve hazır widget'lar ile saatler içinde entegrasyonu tamamlayın.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#111418] dark:text-white">Müşteri Memnuniyeti</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hasar süreçlerini biz yönetelim, siz sadece satışa odaklanın.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gray-100 dark:bg-[#1a2634] rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm font-bold text-primary">W</div>
                      <div>
                        <p className="font-bold text-[#111418] dark:text-white">Partner Paneli</p>
                        <p className="text-xs text-green-500">Canlı Veri</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">more_horiz</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-[#22303e] p-4 rounded-xl shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Toplam Satış</p>
                      <p className="text-xl font-black text-[#111418] dark:text-white">₺142,500</p>
                      <p className="text-[10px] text-green-500 flex items-center mt-1">
                        <span className="material-symbols-outlined text-[12px]">trending_up</span> %12 artış
                      </p>
                    </div>
                    <div className="bg-white dark:bg-[#22303e] p-4 rounded-xl shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Komisyon</p>
                      <p className="text-xl font-black text-accent">₺28,400</p>
                      <p className="text-[10px] text-gray-400 mt-1">Bu ay</p>
                    </div>
                  </div>
                  <div className="h-32 bg-white dark:bg-[#22303e] rounded-xl w-full flex items-end justify-between p-4 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative group">
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-sm transition-all group-hover:bg-accent" style={{ height: `${h}%` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Hemen Başvurun</h2>
                <p className="text-blue-100 mb-8">
                  Partner programımıza katılın, entegrasyon dokümanlarına erişin ve satışa başlayın.
                </p>
                <Link href="/iletisim">
                  <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                    Başvuru Formu
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
