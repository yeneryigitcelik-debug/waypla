import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Kullanım Koşulları</h1>
        <Card>
          <CardContent className="p-8 prose max-w-none">
            <p className="text-gray-700">
              Bu sayfa kullanım koşullarını içermektedir. Gerçek bir uygulamada bu metin 
              hukuk ekibi tarafından hazırlanmalıdır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




