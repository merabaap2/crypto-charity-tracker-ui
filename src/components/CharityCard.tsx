import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import DonateDialog from './DonateDialog';
import CharityPlaceholderImage from './CharityPlaceholderImage';

interface CharityCardProps {
  charity: {
    id: number;
    name: string;
    description: string;
    address: string;
    image: string;
  };
  totalDonated?: string;
  donorCount?: number;
}

export default function CharityCard({ charity, totalDonated = "$0", donorCount = 0 }: CharityCardProps) {
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);

  return (
    <>
      <Card className="group bg-gradient-card hover:shadow-hover transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="mb-2">
            <Heart className="mr-1 h-3 w-3" />
            Verified
          </Badge>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Raised</p>
            <p className="font-bold text-primary">{totalDonated}</p>
          </div>
        </div>
        
        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
          <CharityPlaceholderImage
            charityId={charity.id}
            charityName={charity.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <CardTitle className="text-xl line-clamp-2">{charity.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {charity.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            {donorCount} supporters
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Target className="mr-1 h-4 w-4" />
            Active
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="charity" 
            className="flex-1" 
            onClick={() => setIsDonateDialogOpen(true)}
          >
            <Heart className="mr-2 h-4 w-4" />
            Donate Now
          </Button>
          <Button variant="outline" size="default" asChild>
            <Link to={`/charity/${charity.id}`}>
              Learn More
            </Link>
          </Button>
        </div>
      </CardContent>
      </Card>
      
      <DonateDialog 
        open={isDonateDialogOpen}
        onOpenChange={setIsDonateDialogOpen}
        charity={charity}
      />
    </>
  );
}
