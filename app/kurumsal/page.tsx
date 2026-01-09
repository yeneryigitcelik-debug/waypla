import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function CorporatePage() {
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
                  <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-xs mb-4 uppercase tracking-wider">Kurumsal Filo Güvencesi</span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1]">
                    Teknolojini Sigortala: <br/>İş Sürekliliğini <span className="text-accent">Koru</span>
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                  waypla ile şirket telefonları, laptopları ve tabletleri için kapsamlı koruma, hızlı onarım ve yedek cihaz hizmeti.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link href="/iletisim">
                    <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-accent hover:bg-orange-600 text-white text-base font-bold shadow-lg shadow-accent/30 transition-all hover:scale-105">
                      Teklif Alın
                    </button>
                  </Link>
                  <Link href="/iletisim">
                    <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-white dark:bg-[#1a2634] border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white text-base font-medium hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors">
                      Demo Talep Et
                    </button>
                  </Link>
                </div>
                <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                    <span>5000+ Kurumsal Cihaz waypla Güvencesinde</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-white dark:from-[#1a2634] dark:to-[#111418] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl">
                  <div className="aspect-[4/3] w-full bg-cover bg-center rounded-xl overflow-hidden relative group" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwNUwzyAn2b2IDylTrskyoiCnbMxEZOTOxYigx-ziqRzgxH5ED9UCzrTQEQB-Tkw9quuIi1nQMrM49Ej4Rn_Bv79IID70ypSQ5R8yw8aNjgqpC4xvuR-uqwEl2jJ4yYYsOV80RarwYQ57nJmZLFSmxsyPp_9b-hQ7vegguIHQuvuzRny6AoDinViXm2z7Xorq0mx2zXVH5fDlxwH8ujyz59T7QyMrBpznvPRp6IxlX8VFja04RhjOKAVxST9Rmea2_5_hQ5MAAogaV')"}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">Kurumsal Çözümler</p>
                      <p className="text-sm opacity-90">Filo Yönetimi ve Raporlama</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-background-light dark:bg-[#101822]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">Neden waypla?</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Kurumsal ihtiyaçlarınıza özel geliştirilmiş çözümlerimizle iş sürekliliğinizi koruyun, maliyetlerinizi düşürün.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "inventory_2", title: "Merkezi Envanter Yönetimi", desc: "Tüm şirket cihazlarınızı tek bir panelden yönetin. Garanti süreleri, poliçe durumları ve kullanıcı atamalarını anlık takip edin." },
                { icon: "bar_chart", title: "Detaylı Hasar Raporları", desc: "Arıza sıklığı, onarım maliyetleri ve hasar türlerini analiz eden detaylı raporlarla bütçenizi kontrol altında tutun." },
                { icon: "credit_card", title: "Esnek Faturalandırma", desc: "İşletmenizin nakit akışına uygun aylık abonelik veya yıllık peşin ödeme planları ile bütçenizi yormayın." },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2634] p-6 hover:shadow-lg hover:border-accent/30 transition-all">
                  <div className="size-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold leading-tight text-[#111418] dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Form */}
        <section className="py-16 bg-primary">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">Kurumsal Filo Teklifi Alın</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Şirketiniz için en uygun koruma paketini belirleyelim. Uzman ekibimiz 24 saat içinde size özel teklif ile dönüş yapsın.
                </p>
              </div>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#111418] dark:text-white" htmlFor="company">Şirket Adı</label>
                  <input className="h-12 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] px-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:text-white" id="company" placeholder="Örn: Teknoloji A.Ş." type="text" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#111418] dark:text-white" htmlFor="fleet-size">Cihaz Sayısı</label>
                  <select className="h-12 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] px-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:text-white" id="fleet-size" defaultValue="">
                    <option disabled value="">Seçiniz</option>
                    <option value="1-10">1 - 10 Cihaz</option>
                    <option value="11-50">11 - 50 Cihaz</option>
                    <option value="51-200">51 - 200 Cihaz</option>
                    <option value="200+">200+ Cihaz</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-[#111418] dark:text-white" htmlFor="contact-name">Yetkili Kişi</label>
                    <input className="h-12 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] px-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:text-white" id="contact-name" placeholder="Ad Soyad" type="text" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-[#111418] dark:text-white" htmlFor="phone">Telefon</label>
                    <input className="h-12 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] px-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:text-white" id="phone" placeholder="0555..." type="tel" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#111418] dark:text-white" htmlFor="email">E-posta</label>
                  <input className="h-12 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] px-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:text-white" id="email" placeholder="isim@sirket.com" type="email" />
                </div>
                <button className="mt-4 flex items-center justify-center rounded-lg h-12 w-full bg-accent text-white text-base font-bold hover:bg-orange-600 transition-colors shadow-md" type="button">
                  Teklif İste
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Kişisel verileriniz KVKK kapsamında korunmaktadır.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

