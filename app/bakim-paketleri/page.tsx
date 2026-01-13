import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { waypla } from "@/content/waypla";

export const metadata = {
  title: "Bakım Paketleri | Waypla",
  description: waypla.maintenancePackagesCopy.description,
};

export default function MaintenancePackagesPage() {
  const { maintenancePackagesCopy } = waypla;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent font-bold text-xs mb-6 uppercase tracking-wider">
                bakım paketleri
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white leading-[1.1] mb-6">
                {maintenancePackagesCopy.hero}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {maintenancePackagesCopy.description}
              </p>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-16 bg-gray-50 dark:bg-[#1a2634]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {maintenancePackagesCopy.packages.map((pkg, index) => (
                <div
                  key={pkg.name}
                  className={`relative bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 ${
                    index === 1 ? 'ring-2 ring-accent shadow-lg scale-105' : ''
                  } hover:shadow-xl dark:hover:shadow-accent/20 transition-all duration-300`}
                >
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                        ÖNERİLEN
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-primary dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {pkg.description}
                    </p>
                    <div className="mt-4 text-accent font-bold">
                      {pkg.interval}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-accent text-lg mt-0.5">
                          check_circle
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/teklif" className="block">
                    <button className={`w-full h-12 text-sm font-bold rounded-lg transition-colors ${
                      index === 1
                        ? 'bg-accent hover:bg-orange-600 text-white shadow-lg shadow-accent/30'
                        : 'bg-gray-100 dark:bg-[#22303e] hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111418] dark:text-white'
                    }`}>
                      Paketi İncele
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-[#0f1419]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-primary dark:text-white mb-4">
                Sık Sorulan Sorular
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Bakım paketleri hakkında merak ettikleriniz
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-50 dark:bg-[#1a2634] rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary dark:text-white mb-2">
                  Bakım paketleri ne sıklıkla yenilenir?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Her paket kendi periyoduna göre otomatik olarak yenilenir. İptal etmek istediğinizde kolayca durdurabilirsiniz.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-[#1a2634] rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary dark:text-white mb-2">
                  Hangi cihazlar için geçerlidir?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Telefon, tablet, laptop ve akıllı saatler için geçerlidir. Premium paket diğer cihaz türleri için de kullanılabilir.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-[#1a2634] rounded-xl p-6">
                <h3 className="text-lg font-bold text-primary dark:text-white mb-2">
                  Servis ağınızda bakım yapılır mı?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Evet, anlaşmalı servis merkezlerimizde profesyonel bakım hizmetleri sunulmaktadır.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-accent/10 to-orange-100/30 dark:from-accent/5 dark:to-orange-900/10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black text-primary dark:text-white mb-4">
              Cihazınızı Koruyun
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Bakım paketleri ile cihazınızın performansını koruyun ve beklenmedik arızalara karşı hazırlıklı olun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/teklif">
                <button className="h-12 px-8 bg-accent text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-accent/30">
                  Teklif Al
                </button>
              </Link>
              <Link href="/iletisim">
                <button className="h-12 px-8 bg-white dark:bg-[#1a2634] text-[#111418] dark:text-white border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  İletişim
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}