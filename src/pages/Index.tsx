import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Zap, TrendingUp, Users, DollarSign } from 'lucide-react';
import { CHARITIES } from '@/lib/contracts';
import CharityCard from '@/components/CharityCard';
import DonateDialog from '@/components/DonateDialog';
import heroImage from '@/assets/hero-charity.jpg';
import { Link } from 'react-router-dom';

const Index = () => {
  const [selectedCharity, setSelectedCharity] = useState<typeof CHARITIES[0] | null>(null);

  // Mock data - in real app, this would come from blockchain queries
  const stats = {
    totalDonated: '$45,230',
    totalDonors: '324',
    charitiesSupported: '4',
    transactionsProcessed: '1,247'
  };

  const mockCharityData = [
    { totalDonated: '$12,450', donorCount: 89 },
    { totalDonated: '$8,750', donorCount: 56 },
    { totalDonated: '$15,230', donorCount: 127 },
    { totalDonated: '$8,800', donorCount: 52 },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                <Heart className="mr-1 h-3 w-3" />
                Powered by Blockchain
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Transparent Charity
                  <span className="block text-primary-light">Donations</span>
                </h1>
                <p className="text-xl md:text-2xl text-primary-light/90 max-w-lg">
                  Make a difference with cryptocurrency donations tracked on the blockchain for complete transparency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="#charities">
                    <Heart className="mr-2 h-5 w-5" />
                    Start Donating
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Charity donations with blockchain technology"
                className="rounded-2xl shadow-hover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.totalDonated}</p>
              <p className="text-sm text-muted-foreground">Total Donated</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.totalDonors}</p>
              <p className="text-sm text-muted-foreground">Donors</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.charitiesSupported}</p>
              <p className="text-sm text-muted-foreground">Charities</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.transactionsProcessed}</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Why Choose CharityChain
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Blockchain-Powered Giving
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of charitable donations with complete transparency and security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card hover:shadow-hover transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">100% Transparent</h3>
                <p className="text-muted-foreground">
                  Every donation is recorded on the blockchain. Track exactly where your money goes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card hover:shadow-hover transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built on Monad for instant transactions with minimal fees.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card hover:shadow-hover transition-all duration-300">
              <CardContent className="pt-8 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified Charities</h3>
                <p className="text-muted-foreground">
                  All charities are thoroughly vetted to ensure your donations make real impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Charities Section */}
      <section id="charities" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Heart className="mr-1 h-3 w-3" />
              Featured Charities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Make a Difference Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our verified charities and see your impact in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {CHARITIES.map((charity, index) => (
              <CharityCard
                key={charity.id}
                charity={charity}
                totalDonated={mockCharityData[index]?.totalDonated}
                donorCount={mockCharityData[index]?.donorCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-charity text-primary-foreground">
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-6 text-primary-light" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make an Impact?
              </h2>
              <p className="text-xl mb-8 text-primary-light/90 max-w-2xl mx-auto">
                Join hundreds of donors who are already making a difference through transparent blockchain donations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Donating
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                  <Link to="/faq">
                    Learn How It Works
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Donate Dialog */}
      <DonateDialog
        open={!!selectedCharity}
        onOpenChange={(open) => !open && setSelectedCharity(null)}
        charity={selectedCharity || CHARITIES[0]}
      />
    </div>
  );
};

export default Index;
