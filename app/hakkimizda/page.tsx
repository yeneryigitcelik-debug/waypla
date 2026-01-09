import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brand } from "@/lib/brand";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Hakkımızda</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          {brand.description}
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Misyonumuz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {brand.name} olarak, elektronik cihazlarınızı güvenceye almak için 
                şeffaf, hızlı ve dijital-first bir çözüm sunuyoruz. 
                Müşterilerimize en iyi koruma deneyimini sağlamak için çalışıyoruz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vizyonumuz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Türkiye'nin önde gelen dijital cihaz sigortası platformu olmak ve 
                müşterilerimize en iyi hizmeti sunmak.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Değerlerimiz</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Şeffaflık: Tüm koşullarımız net ve anlaşılır</li>
                <li>Hız: Hızlı teklif ve hasar yönetimi</li>
                <li>Güven: Güvenilir servis ağı ve müşteri desteği</li>
                <li>İnovasyon: Dijital teknolojilerle sürekli gelişim</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


