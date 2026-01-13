import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Çerez Politikası</h1>
        <Card>
          <CardContent className="p-8 prose max-w-none">
            <p className="text-gray-700">
              Bu web sitesi, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
            </p>
            <p className="text-gray-700 mt-4">
              Çerezler, web sitesinin düzgün çalışması, kullanıcı tercihlerinin hatırlanması 
              ve analitik amaçlar için kullanılmaktadır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




