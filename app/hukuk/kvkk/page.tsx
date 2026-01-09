import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KVKKPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">KVKK Aydınlatma Metni</h1>
        <Card>
          <CardContent className="p-8 prose max-w-none">
            <p className="text-gray-700">
              Bu sayfa KVKK (Kişisel Verilerin Korunması Kanunu) aydınlatma metnini içermektedir.
              Gerçek bir uygulamada bu metin hukuk ekibi tarafından hazırlanmalıdır.
            </p>
            <p className="text-gray-700 mt-4">
              Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında 
              işlenmektedir. Verileriniz sadece hizmet sunumu için kullanılmaktadır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


