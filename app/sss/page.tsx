import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "Cihaz sigortası nedir?",
    answer: "Cihaz sigortası, elektronik cihazlarınızı beklenmedik hasarlara, hırsızlığa ve kayıplara karşı koruyan bir sigorta türüdür.",
  },
  {
    question: "Hangi cihazlar sigortalanabilir?",
    answer: "Telefon, laptop, tablet, akıllı saat ve diğer elektronik cihazlar sigortalanabilir.",
  },
  {
    question: "Hasar bildirimi nasıl yapılır?",
    answer: "Dijital platformumuzdan kolayca hasar bildirimi yapabilirsiniz. Giriş yaparak 'Hasar Bildir' sayfasından talebinizi oluşturabilirsiniz.",
  },
  {
    question: "Muafiyet nedir?",
    answer: "Muafiyet, hasar durumunda sizin ödemeniz gereken tutardır. Bu tutar sabit veya yüzde bazlı olabilir.",
  },
  {
    question: "Poliçe süresi ne kadar?",
    answer: "Poliçe süreleri planınıza göre değişir. Abonelik veya peşin ödeme seçenekleri mevcuttur.",
  },
  {
    question: "Hasar talebi ne kadar sürede değerlendirilir?",
    answer: "Hasar talepleri 24 saat içinde ilk değerlendirmeye alınır ve 7 gün içinde tamamlanır.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Sık Sorulan Sorular</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}




