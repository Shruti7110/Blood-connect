
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, Heart, Users, Stethoscope, Activity, ExternalLink } from "lucide-react";
import { type AuthUser } from "@/lib/auth";
import { educationContent } from "@/data/education-content";

interface PatientEducationProps {
  user: AuthUser;
}

export default function PatientEducation({ user }: PatientEducationProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'thalassemia-basics': return Heart;
      case 'transfusion-care': return Activity;
      case 'iron-management': return Stethoscope;
      case 'lifestyle': return Users;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'thalassemia-basics': return 'bg-red-100 text-red-600';
      case 'transfusion-care': return 'bg-blue-100 text-blue-600';
      case 'iron-management': return 'bg-green-100 text-green-600';
      case 'lifestyle': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'guide': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Education & Resources</h1>
          <p className="text-gray-600">Learn about thalassemia management, transfusion care, and living well with your condition</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationContent.map((content) => {
            const CategoryIcon = getCategoryIcon(content.category);
            const TypeIcon = getTypeIcon(content.type);
            
            return (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(content.category)}`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-4 h-4 text-gray-500" />
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {content.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Reading time</span>
                      <span>{content.readingTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Difficulty</span>
                      <Badge variant="outline" className="text-xs">
                        {content.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {content.tags && content.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {content.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{content.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.open(content.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        
      </div>
    </div>
  );
}
