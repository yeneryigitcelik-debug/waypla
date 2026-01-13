import { notFound } from "next/navigation";

const blogPosts: Record<string, { title: string; content: string; date: string }> = {
  "cihaz-sigortasi-nedir": {
    title: "Cihaz Sigortası Nedir?",
    content: "Elektronik cihaz sigortası, cihazlarınızı beklenmedik hasarlara karşı koruyan bir sigorta türüdür...",
    date: "2024-01-15",
  },
  "telefon-sigortasi-faydalari": {
    title: "Telefon Sigortasının Faydaları",
    content: "Akıllı telefonlar günlük hayatımızın vazgeçilmez bir parçası haline geldi...",
    date: "2024-01-10",
  },
  "hasar-bildirimi-nasil-yapilir": {
    title: "Hasar Bildirimi Nasıl Yapılır?",
    content: "Cihazınızda bir hasar oluştuğunda, hızlı bir şekilde hasar bildirimi yapmanız önemlidir...",
    date: "2024-01-05",
  },
  "garanti-uzatma-mi-sigorta-mi": {
    title: "Garanti Uzatma mı Sigorta mı?",
    content: "Cihazınızı korumak için iki ana seçenek var: garanti uzatma ve sigorta...",
    date: "2024-01-01",
  },
  "laptop-sigortasi-ipuclari": {
    title: "Laptop Sigortası İpuçları",
    content: "Laptop'lar iş ve eğitim hayatımızın önemli bir parçası. Onları korumak için...",
    date: "2023-12-25",
  },
  "dijital-cihaz-koruma-rehberi": {
    title: "Dijital Cihaz Koruma Rehberi",
    content: "Dijital cihazlarınızı korumak için dikkat etmeniz gereken noktalar...",
    date: "2023-12-20",
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">
          {new Date(post.date).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>
      </article>
    </div>
  );
}




