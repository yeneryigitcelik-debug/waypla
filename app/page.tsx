import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 flex flex-col gap-6 text-center lg:text-left z-10">
                <div>
                  <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-xs mb-4 uppercase tracking-wider">waypla güvencesiyle</span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1]">
                    Teknolojini<br/><span className="text-accent">sigortala.</span>
          </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                  Cihazın güvende, hasar süreci de öyle. waypla ile Türkiye'nin en kapsamlı elektronik cihaz koruma platformunu keşfedin.
                </p>
                <div className="mt-4 bg-white dark:bg-[#1a2634] p-2 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
                  <form className="flex flex-col sm:flex-row gap-2" action="/teklif">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">smartphone</span>
                      </div>
                      <select className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#f8fafc] dark:bg-[#22303e] border-0 text-sm font-medium text-[#111418] dark:text-white focus:ring-2 focus:ring-accent cursor-pointer appearance-none" defaultValue="">
                        <option disabled value="">Cihaz Tipi Seçin</option>
                        <option value="phone">Akıllı Telefon</option>
                        <option value="laptop">Laptop</option>
                        <option value="tablet">Tablet</option>
                        <option value="watch">Akıllı Saat</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">currency_lira</span>
                      </div>
                      <input className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#f8fafc] dark:bg-[#22303e] border-0 text-sm font-medium text-[#111418] dark:text-white focus:ring-2 focus:ring-accent placeholder-gray-400" placeholder="Cihaz Bedeli (TL)" type="number" />
                    </div>
                    <Link href="/teklif">
                      <button className="h-12 px-8 bg-accent text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap" type="button">
                        Hemen Teklif Gör
                      </button>
                    </Link>
                  </form>
                </div>
                <div className="flex items-center gap-4 justify-center lg:justify-start mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                    <span>Anında Onay</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                    <span>7/24 Destek</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                    <span>Orijinal Parça</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-white dark:from-[#1a2634] dark:to-[#111418] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl">
                  <div className="aspect-[4/3] w-full bg-cover bg-center rounded-xl overflow-hidden relative group" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDE57JmgJM9JaPNx9-Lx3tDb2eIXtvyh4ZlOFBdq1XqESVVYYRYCbe5_64wI_McXt0IAdtfdcuz7uNKPeoXj5m7ln56znuoo7B71gIRxGYAyhFje6W0Ar-zVs4eHhBJsrsu_CmccuD7I1OT1YdOxntjmpx7h3GKT-U9eAYmK8L_une2ggxmoEuZdA_DEQHSLUT9qghydoPpoZIKO8qpNV6oY9U9k_UnEE0aVxUc4CTAV3fQkRxVoAN6DGu5ZoXlDNQdLMTH4c90M3p-')"}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">Apple & Samsung</p>
                      <p className="text-sm opacity-90">Yetkili Servis Güvencesiyle</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/hasar/bildir" className="group flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-background-light dark:bg-[#1a2634] hover:bg-white dark:hover:bg-[#22303e] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">report_problem</span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#111418] dark:text-white">Hasar Bildir</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hızlıca dosya oluştur</p>
                </div>
              </Link>
              <Link href="/servis-agi" className="group flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-background-light dark:bg-[#1a2634] hover:bg-white dark:hover:bg-[#22303e] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">location_on</span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#111418] dark:text-white">Servis Bul</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">En yakın nokta</p>
                </div>
              </Link>
              <Link href="/planlar" className="group flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-background-light dark:bg-[#1a2634] hover:bg-white dark:hover:bg-[#22303e] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">article</span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#111418] dark:text-white">Planları İncele</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sana uygun paketler</p>
                </div>
              </Link>
              <Link href="/kurumsal" className="group flex flex-col items-center justify-center gap-4 p-8 rounded-xl bg-background-light dark:bg-[#1a2634] hover:bg-white dark:hover:bg-[#22303e] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">business_center</span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#111418] dark:text-white">Kurumsal Teklif</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Şirketler için özel</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Device Categories */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white">Koruma Kapsamındaki Cihazlar</h2>
              <Link href="/planlar" className="text-accent font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Tümünü Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
              {[
                { name: "Akıllı Telefon", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_BK--b7Qg8WYYxXCgoyIB8bcYfqn-ZUUqt9W85AE_ggMmysI3U6Wu5vlaQXmlNZXjwp7VUUOTmUDo4Osb5WRxG1OjoLAaB7HZQnagrOH2B-Z5aXgDD8xm7vX7BUnJhCA1g3ugxnRhkDCo3G7hWqpsWTI9zNpPFdeFJDpGW3PUM7WOBG9xTCK9RpRJnMsmEod-r6rC992S5dDWgacJ-v4L1JfobFnxjx4-XJiUtd86wDolX8HZWoEU_YY385t2jRaCtcIpKmehXkPt" },
                { name: "Laptop", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA74lmYx1O1vEnP5DJcHoiRepjepvIWIrfZwLPAvYFx8O7mA1G8tGIkcYKby7ejP3qG7i4oMl_J_RXxgmIphhzqfWeDLblkdOTteaD6zUn2wh92lSOcyDvfanTdGZctnX5sSgNLIajijCNA5KJEJpx2WdS-k3zhTgTCGao068t9PmlsxVjgjTHsIOK44svxGjnjremdrNpQJSSpXemaLRoLC9WUmXxUvyhvJc5ZUlHabvhA3gYeIEpIChahX7HkkJEZEzejDoFywiEd" },
                { name: "Tablet", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD120jj1SjIKx_IBOLYk7gPo0XhGhqjlZ5odZNf84vappxWx8VKyJg5ugCDbTu6o5NzkAS8WWQIaJw8hwtUwBooBaHssL1lpXruKtzcEYSOOi7KIdP0qVu1nqD_AQX8vIVTtThzoVMbGOxqt0snHP0hWn30ndydrgssNPC4c6S-uRmgdM1JvnTyYjMSdIl0gR9cyZH04SEjdBDG4RmCPPa_MYauLzsE5-fUUBe7RvloAjz7ZxvbpOHuwcj08nGWzRgl7tKxMjzh-a2b" },
                { name: "Akıllı Saat", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuNPlhrCtqc3gtBChw3l4pyzlweIZEoxc6BR4voKyO7_EF-yESWDyImJw2OEus22nrBfcZag-3ZeiIFaQGNhUc_X6K0kKfIUyj28tzsAEKE5mqUWt8u-7GltiSnymWEl8AwvJt4s6aJI4Gu_TJ0WxQnqVnHRd-f_92wRc68ujz2Afbib9TUBiIoB2PM9RyqNVoaY8kduNwmGavOH3Bo7AvwavkzT_tTSqtxfs2R9VnFr7HKxP0Zy9-_tBiqc7AiC-z795tIzXyMO2Q" },
                { name: "Oyun Konsolu", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHcl0-ZF8GDUMExq2e8XOoDQvxBrFIBoGIovuqgPGxZcvCZGkaGF5znwenKk_52VVtkCvNZJ7N4kGQN2nSe7-LbWsPeCRd-xp5Gr584VBslrwOOvdFSsbm8TDoOnIWWtPb1WBEqttXARpiuSluHeBBSLgE0aG3wcw45jCRECYKETlNZWDJEhv9J0osXkkKyXSTeBfVUtUAvxXyLOFcJkFoVZg9TlSSQgC6iI5VA2q-MzIFrdydkOovogPVMSe0atjh8Ztaf__VHLhG" },
              ].map((device, i) => (
                <div key={i} className="min-w-[160px] flex-1 bg-white dark:bg-[#1a2634] rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3 cursor-pointer hover:border-accent/50 transition-colors snap-start">
                  <div className="w-full aspect-square rounded-lg bg-gray-50 dark:bg-[#22303e] bg-center bg-cover" style={{backgroundImage: `url('${device.image}')`}}></div>
                  <p className="font-semibold text-[#111418] dark:text-white">{device.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Plans */}
        <section className="py-16 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">Size Uygun Koruma Planı</h2>
              <p className="text-gray-500 dark:text-gray-400">İhtiyacınıza göre şekillenen esnek ve kapsamlı paketler.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Extended Warranty */}
              <div className="bg-background-light dark:bg-[#1a2634] rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[120px] text-gray-500">schedule</span>
                </div>
                <div className="mb-6 z-10">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white">Uzatılmış Garanti</h3>
                  <p className="text-sm text-gray-500 mt-2">Üretici garantisi bittikten sonra başlar.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1 z-10">
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>+1 veya +2 yıl ek süre</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Mekanik arızalar</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Elektriksel arızalar</span>
                  </li>
                </ul>
                <Link href="/planlar">
                  <button className="w-full py-3 px-4 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors z-10">İncele</button>
                </Link>
              </div>

              {/* Accidental Damage - Popular */}
              <div className="bg-white dark:bg-[#1a2634] rounded-2xl p-8 border-2 border-accent shadow-xl shadow-orange-500/10 flex flex-col relative overflow-hidden transform md:-translate-y-4 z-10">
                <div className="absolute top-0 left-0 right-0 bg-accent h-1.5"></div>
                <div className="absolute top-4 right-4 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Popüler</div>
                <div className="mb-6 mt-2">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white">Kazaen Hasar</h3>
                  <p className="text-sm text-gray-500 mt-2">Günlük kazalara karşı tam güvence.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span>Ekran kırılması</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span>Sıvı teması</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span>Düşme ve çarpma</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span>Orijinal parça değişimi</span>
                  </li>
                </ul>
                <Link href="/teklif">
                  <button className="w-full py-3 px-4 rounded-lg bg-accent text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-accent/30">Hemen Al</button>
                </Link>
              </div>

              {/* Full Coverage */}
              <div className="bg-background-light dark:bg-[#1a2634] rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[120px] text-gray-500">shield</span>
                </div>
                <div className="mb-6 z-10">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white">Tam Koruma</h3>
                  <p className="text-sm text-gray-500 mt-2">Hırsızlık dahil en kapsamlı paket.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1 z-10">
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Kazaen Hasar kapsamı</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Uzatılmış Garanti kapsamı</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Hırsızlık koruması</span>
                  </li>
                </ul>
                <Link href="/planlar">
                  <button className="w-full py-3 px-4 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors z-10">İncele</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-background-light dark:bg-[#101822]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white">Nasıl Çalışır?</h2>
            </div>
            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
                {[
                  { num: "1", title: "Cihazını Seç", desc: "Korumak istediğin elektronik cihazın marka ve modelini sisteme gir." },
                  { num: "2", title: "Paketi Belirle", desc: "İhtiyaçlarına en uygun koruma paketini seç ve ödemeni güvenle tamamla." },
                  { num: "3", title: "Güvendesin", desc: "Artık cihazın koruma altında. Hasar durumunda tek tıkla bize ulaş." },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center bg-background-light dark:bg-[#101822]">
                    <div className={`w-16 h-16 rounded-full ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-[#1a2634] border-2 border-gray-200 dark:border-gray-700 text-gray-400'} flex items-center justify-center text-2xl font-bold mb-6 ${i === 0 ? 'shadow-lg shadow-blue-900/30' : ''}`}>
                      {step.num}
                    </div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Network */}
        <section className="py-16 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl p-8 lg:p-12 overflow-hidden relative">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px"}}></div>
              <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                <div className="flex-1 text-white">
                  <h2 className="text-3xl font-bold mb-4">Geniş Servis Ağı</h2>
                  <p className="text-blue-100 mb-8 max-w-md">
                    Türkiye'nin 81 ilinde, 1000'den fazla yetkili servis noktası ile cihazınız nerede bozulursa bozulsun, çözüm yanınızda.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white">rocket_launch</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Hızlı Teslimat</h4>
                        <p className="text-sm text-blue-100">Cihazınız evinizden alınır, onarılır ve evinize teslim edilir.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white">handyman</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Uzman Teknisyenler</h4>
                        <p className="text-sm text-blue-100">Sadece marka onaylı yetkili servislerde orijinal parça ile onarım.</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/servis-agi">
                    <button className="mt-8 px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors">
                      Servis Ağı Haritası
                    </button>
                  </Link>
                </div>
                <div className="flex-1 w-full flex justify-center lg:justify-end">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 w-full max-w-md">
                    <div className="aspect-video rounded-lg bg-gray-800 bg-opacity-40 w-full relative overflow-hidden" style={{background: "linear-gradient(to right, #0f172a, #1e3a8a)"}}>
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent rounded-full animate-ping"></div>
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-accent rounded-full animate-ping" style={{animationDelay: "0.5s"}}></div>
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-accent rounded-full animate-ping" style={{animationDelay: "1s"}}></div>
                      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-white rounded-full"></div>
                      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/40 px-2 py-1 rounded">
                        Canlı Servis Durumu
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-white/80 text-sm">
                      <span>Aktif Onarım: <strong>1,240</strong></span>
                      <span>Tamamlanan: <strong>45,000+</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
