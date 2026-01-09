import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function APIDocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">API Dokümantasyonu</h1>
        <p className="text-xl text-gray-600 mb-12">
          Partner entegrasyonu için API referansı
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Kimlik Doğrulama</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                API isteklerinizde header'da API anahtarınızı göndermeniz gerekir:
              </p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teklif Alma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">POST /api/v1/quote</p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "category": "phone",
  "brand": "Apple",
  "model": "iPhone 15 Pro",
  "declaredValue": 25000,
  "purchaseDate": "2024-01-01",
  "coverageType": "FULL_COVERAGE"
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Poliçe Oluşturma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">POST /api/v1/policies</p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "quoteId": "quote_123",
  "paymentMode": "subscription_monthly"
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Satış bildirimleri için webhook URL'inizi ayarlayın:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>policy.created - Yeni poliçe oluşturulduğunda</li>
                <li>policy.activated - Poliçe aktif olduğunda</li>
                <li>claim.created - Hasar talebi oluşturulduğunda</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-blue-50">
          <CardContent className="p-6">
            <p className="text-gray-700">
              <strong>Not:</strong> Bu API dokümantasyonu örnek amaçlıdır. 
              Gerçek API endpoint'leri ve detaylı dokümantasyon partner hesabı açıldıktan sonra sağlanacaktır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


