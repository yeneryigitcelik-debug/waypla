import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const blogPosts = [
  {
    slug: "cihaz-sigortasi-nedir",
    title: "Cihaz Sigortası Nedir?",
    description: "Elektronik cihaz sigortası hakkında bilmeniz gerekenler",
    date: "2024-01-15",
  },
  {
    slug: "telefon-sigortasi-faydalari",
    title: "Telefon Sigortasının Faydaları",
    description: "Akıllı telefonunuzu korumanın önemi",
    date: "2024-01-10",
  },
  {
    slug: "hasar-bildirimi-nasil-yapilir",
    title: "Hasar Bildirimi Nasıl Yapılır?",
    description: "Adım adım hasar bildirimi rehberi",
    date: "2024-01-05",
  },
  {
    slug: "garanti-uzatma-mi-sigorta-mi",
    title: "Garanti Uzatma mı Sigorta mı?",
    description: "İki seçenek arasındaki farklar",
    date: "2024-01-01",
  },
  {
    slug: "laptop-sigortasi-ipuclari",
    title: "Laptop Sigortası İpuçları",
    description: "Laptop'unuzu korumak için öneriler",
    date: "2023-12-25",
  },
  {
    slug: "dijital-cihaz-koruma-rehberi",
    title: "Dijital Cihaz Koruma Rehberi",
    description: "Cihazlarınızı nasıl koruyabilirsiniz?",
    date: "2023-12-20",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Blog</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Cihaz koruma ve sigorta hakkında güncel yazılar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString("tr-TR")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}




