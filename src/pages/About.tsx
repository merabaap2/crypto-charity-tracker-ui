import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Zap, Globe, Users, Target } from 'lucide-react';
import heroImage from '@/assets/hero-charity.jpg';

export default function About() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Transparent & Secure",
      description: "All donations are recorded on the blockchain for complete transparency and security."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast & Low Cost",
      description: "Built on Monad for lightning-fast transactions with minimal fees."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Impact",
      description: "Support verified charities making a difference worldwide."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Driven",
      description: "Join a community of donors committed to positive change."
    }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Foundation",
      status: "completed",
      items: ["Basic donation functionality", "Charity verification system", "Monad testnet integration"]
    },
    {
      phase: "Phase 2",
      title: "Enhancement",
      status: "current",
      items: ["Advanced analytics", "Mobile app", "Multi-token support"]
    },
    {
      phase: "Phase 3",
      title: "Expansion",
      status: "planned",
      items: ["Cross-chain compatibility", "NFT rewards for donors", "Charity governance features"]
    }
  ];

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          <Heart className="mr-1 h-3 w-3" />
          About CharityChain
        </Badge>
        <h1 className="text-4xl font-bold mb-6 bg-gradient-charity bg-clip-text text-transparent">
          Revolutionizing Charitable Giving
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          CharityChain leverages blockchain technology to create a transparent, efficient, and 
          secure platform for charitable donations, built on the high-performance Monad network.
        </p>
        <div className="relative rounded-2xl overflow-hidden shadow-charity max-w-4xl mx-auto">
          <img
            src={heroImage}
            alt="Charity and blockchain technology"
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      </div>

      {/* Mission Section */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
          <CardDescription className="text-lg">
            Bridging the gap between generous donors and impactful charities through blockchain transparency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                Every donation is tracked on-chain, ensuring funds reach their intended destination.
              </p>
            </div>
            <div>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Impact</h3>
              <p className="text-muted-foreground">
                Supporting verified charities that create measurable positive change in the world.
              </p>
            </div>
            <div>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Building a global community of donors united by the desire to make a difference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose CharityChain?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card hover:shadow-hover transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">Built with Cutting-Edge Technology</CardTitle>
          <CardDescription>
            Leveraging the best blockchain and web technologies for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['Monad', 'React', 'TypeScript', 'Wagmi', 'Viem', 'Tailwind', 'USDC', 'Web3'].map((tech) => (
              <Badge key={tech} variant="secondary" className="p-3 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roadmap */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Development Roadmap</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {roadmap.map((phase, index) => (
            <Card key={index} className={`${
              phase.status === 'current' ? 'ring-2 ring-primary' : ''
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{phase.phase}</CardTitle>
                  <Badge variant={
                    phase.status === 'completed' ? 'default' :
                    phase.status === 'current' ? 'default' : 'secondary'
                  } className={
                    phase.status === 'completed' ? 'bg-success text-success-foreground' :
                    phase.status === 'current' ? 'bg-primary text-primary-foreground' : ''
                  }>
                    {phase.status}
                  </Badge>
                </div>
                <CardDescription className="font-semibold text-foreground">
                  {phase.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}