import { useParams } from 'react-router-dom';
import { CHARITIES } from '@/lib/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Target, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CharityDetail() {
  const { id } = useParams<{ id: string }>();
  const charity = CHARITIES.find(c => c.id === parseInt(id || '0'));

  if (!charity) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Charity Not Found</h1>
          <Link to="/">
            <Button variant="charity">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock donation data
  const recentDonations = [
    { donor: '0x1234...5678', amount: '100 USDC', timestamp: '2 hours ago', txHash: '0xabc123' },
    { donor: '0x2345...6789', amount: '250 USDC', timestamp: '5 hours ago', txHash: '0xdef456' },
    { donor: '0x3456...7890', amount: '75 USDC', timestamp: '1 day ago', txHash: '0x789abc' },
    { donor: '0x4567...8901', amount: '500 USDC', timestamp: '2 days ago', txHash: '0x012def' },
  ];

  return (
    <div className="container py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Charities
          </Button>
        </Link>
      </div>

      {/* Charity Hero Section */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div>
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              <Heart className="mr-1 h-3 w-3" />
              Verified Charity
            </Badge>
            <h1 className="text-4xl font-bold mb-4">{charity.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{charity.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">$12,450</p>
                    <p className="text-sm text-muted-foreground">Total Donated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Supporters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button variant="charity" size="lg" className="w-full">
            <Heart className="mr-2 h-5 w-5" />
            Donate Now
          </Button>
        </div>

        <Card className="bg-gradient-card">
          <CardContent className="p-0">
            <img
              src="/placeholder.svg"
              alt={charity.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      </div>

      {/* Mission Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {charity.mission}
          </p>
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>
            Latest contributions from our amazing supporters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDonations.map((donation, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{donation.donor}</p>
                    <p className="text-sm text-muted-foreground">{donation.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{donation.amount}</p>
                  <Link
                    to={`/tx/${donation.txHash}`}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    View Transaction
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}