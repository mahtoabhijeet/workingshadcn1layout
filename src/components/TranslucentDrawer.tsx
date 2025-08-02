"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article, MOCK_ARTICLES } from "@/lib/data";

interface TranslucentDrawerProps {
  activeTab: string;
  onArticleCardClick: (article: Article) => void;
}

export default function TranslucentDrawer({
  activeTab,
  onArticleCardClick,
}: TranslucentDrawerProps) {
  const filteredArticles = MOCK_ARTICLES.filter(article => {
    // For simplicity, let's assume 'trails' tab shows all articles for now,
    // and other tabs might filter based on content later if needed.
    // For now, we'll just show all mock articles.
    return true;
  });

  return (
    <div className="bg-background/80 backdrop-blur-sm h-full flex flex-col border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
      </div>
      <div className="p-4 overflow-y-auto">
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onArticleCardClick(article)}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{article.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
