import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PlansPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-24 bg-white dark:bg-[#111418]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-xs mb-4 uppercase tracking-wider">Fiyatlandırma</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1] mb-4">
                Cihazlarınız İçin <span className="text-accent">Kusursuz</span> Güvence
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Beklenmedik kazalara ve arızalara karşı bütçenize en uygun paketi seçin. Şeffaf fiyatlar, sürpriz yok.
              </p>
            </div>

            {/* Payment Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex h-12 items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 relative border border-gray-200 dark:border-gray-700">
                <button className="relative z-10 flex h-full items-center justify-center rounded-lg px-6 text-sm font-semibold transition-all text-gray-600 dark:text-gray-400 hover:text-[#111418] dark:hover:text-white">
                  Aylık Ödeme
                </button>
                <button className="relative z-10 flex h-full items-center justify-center rounded-lg px-6 bg-primary dark:bg-[#1a2634] shadow-sm text-white text-sm font-bold transition-all border border-transparent dark:border-gray-600">
                  Yıllık Ödeme
                  <span className="ml-2 rounded-full bg-accent text-white px-2 py-0.5 text-[10px] font-bold uppercase">%20 İndirim</span>
                </button>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-12">
              Fiyatlarımıza tüm vergiler dahildir.
            </p>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Extended Warranty */}
              <div className="bg-background-light dark:bg-[#1a2634] rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[120px] text-gray-500">schedule</span>
                </div>
                <div className="mb-6 z-10">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white">Uzatılmış Garanti</h3>
                  <p className="text-sm text-gray-500 mt-2">Garanti sonrası arızalar için.</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6 z-10">
                  <span className="text-4xl font-black text-[#111418] dark:text-white tracking-tight">₺29</span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">/ay</span>
                </div>
                <Link href="/teklif">
                  <button className="w-full py-3 px-4 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors z-10 mb-6">Paketi Seç</button>
                </Link>
                <ul className="space-y-3 flex-1 z-10">
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Üretici garantisi sonrası koruma</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Mekanik ve elektrik arızaları</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-500">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">cancel</span>
                    <span className="line-through">Kaza sonucu hasarlar</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-500">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">cancel</span>
                    <span className="line-through">Hırsızlık koruması</span>
                  </li>
                </ul>
              </div>

              {/* Accidental Damage - Popular */}
              <div className="bg-white dark:bg-[#1a2634] rounded-2xl p-8 border-2 border-accent shadow-xl shadow-orange-500/10 flex flex-col relative overflow-hidden transform md:-translate-y-4 z-10">
                <div className="absolute top-0 left-0 right-0 bg-accent h-1.5"></div>
                <div className="absolute top-4 right-4 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">En Popüler</div>
                <div className="mb-6 mt-2">
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white">Kazaen Hasar</h3>
                  <p className="text-sm text-gray-500 mt-2">Günlük kazalara karşı tam güvence.</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-[#111418] dark:text-white tracking-tight">₺59</span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">/ay</span>
                </div>
                <Link href="/teklif">
                  <button className="w-full py-3 px-4 rounded-lg bg-accent text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-accent/30 mb-6">Hemen Başla</button>
                </Link>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span className="font-medium">Ekran kırılması</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span className="font-medium">Sıvı teması</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span className="font-medium">Düşme ve çarpma</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-accent text-[20px]">check</span>
                    <span className="font-medium">Orijinal parça değişimi</span>
                  </li>
                </ul>
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
                <div className="flex items-baseline gap-1 mb-6 z-10">
                  <span className="text-4xl font-black text-[#111418] dark:text-white tracking-tight">₺89</span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">/ay</span>
                </div>
                <Link href="/teklif">
                  <button className="w-full py-3 px-4 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors z-10 mb-6">Hemen Başla</button>
                </Link>
                <ul className="space-y-3 flex-1 z-10">
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Tüm Kazaen Hasar Kapsamı</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Tüm Uzatılmış Garanti Kapsamı</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Hırsızlık koruması</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 text-[20px]">check</span>
                    <span>Kayıp teminatı</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background-light dark:bg-[#101822]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">Sıkça Sorulan Sorular</h2>
              <p className="text-gray-500 dark:text-gray-400">Planlar hakkında merak ettikleriniz</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "Muafiyet bedeli nedir?", a: "Muafiyet bedeli, hasar durumunda sizin ödemeniz gereken sabit veya yüzdelik tutardır. Örneğin, %10 muafiyetli bir pakette 10.000 TL'lik hasar için 1.000 TL muafiyet bedeli ödersiniz." },
                { q: "Paketimi sonradan değiştirebilir miyim?", a: "Evet, mevcut poliçenizin bitiş tarihinde paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklik işlemleri online olarak yapılabilir." },
                { q: "Yıllık ödeme ile aylık ödeme arasındaki fark nedir?", a: "Yıllık ödemede %20 indirim kazanırsınız. Aylık ödeme daha esnek bir seçenektir ancak yıllık ödeme daha ekonomiktir." },
              ].map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-[#1a2634] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <summary className="flex items-center justify-between p-6 cursor-pointer text-[#111418] dark:text-white font-semibold select-none hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors">
                    <span>{faq.q}</span>
                    <span className="transition-transform group-open:rotate-180">
                      <span className="material-symbols-outlined text-gray-400">keyboard_arrow_down</span>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
