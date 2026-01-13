import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Nasıl Çalışır?</h1>

        <div className="space-y-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <CardTitle className="text-2xl">Cihaz Seç</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cihazınızın kategorisini, markasını, modelini ve satın alma tarihini seçin. 
                Cihaz değerini belirtin ve anında teklif alın.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <CardTitle className="text-2xl">Plan Seç</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Size uygun kapsam planını seçin. Abonelik veya peşin ödeme seçeneklerinden birini tercih edin.
                Şeffaf fiyatlandırma ile ne ödeyeceğinizi önceden bilin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <CardTitle className="text-2xl">Hasar Olursa</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dijital platformumuzdan hızlı bir şekilde hasar bildirin. 
                Talebiniz değerlendirilir ve en yakın servis merkezine yönlendirilirsiniz. 
                Onarım veya değişim süreci 7 gün içinde tamamlanır.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>Hızlı ve Kolay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Tüm süreç dijital platformumuz üzerinden yönetilir. 
              Poliçe belgelerinize online erişebilir, hasar geçmişinizi takip edebilir, 
              cihazlarınızı yönetebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




