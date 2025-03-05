import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  companyName: string;
  description: string;
  avgStar: number;
  totalRating: number;
  onlyFromCost: number;
}

// ✅ Sử dụng HTTP nếu API cho phép
const API_URL = "http://localhost:7171/api/tour"; 

async function getTours(): Promise<Tour[]> {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to fetch tours: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

export default async function TourOperator() {
  const tours = await getTours();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Tours</h1>

      {tours.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No tours available
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{tour.title}</span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" />
                    {tour.avgStar.toFixed(1)} ({tour.totalRating} ratings)
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {tour.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">From ${tour.onlyFromCost.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{tour.companyName}</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
