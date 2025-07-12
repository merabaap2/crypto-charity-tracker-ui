import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Heart, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { useRealtimeStats } from '@/hooks/useRealtimeStats';
import { Skeleton } from '@/components/ui/skeleton';

export default function RealtimeStats() {
  const { data, error, isLoading, isConnected } = useRealtimeStats();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">Failed to load statistics</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-8 w-8 mb-2" />
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Donated',
      value: `$${data.platform.total_donated.toLocaleString()}`,
      icon: DollarSign,
      description: 'USDC donated',
      color: 'text-primary',
    },
    {
      title: 'Total Donors',
      value: data.platform.unique_donors.toLocaleString(),
      icon: Users,
      description: 'Unique contributors',
      color: 'text-blue-600',
    },
    {
      title: 'Active Charities',
      value: data.platform.active_charities.toString(),
      icon: Heart,
      description: 'Verified organizations',
      color: 'text-pink-600',
    },
    {
      title: 'Total Donations',
      value: data.platform.total_donations.toLocaleString(),
      icon: TrendingUp,
      description: 'Transactions processed',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Statistics</h2>
        <Badge variant={isConnected ? 'default' : 'secondary'} className="flex items-center space-x-1">
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>Offline</span>
            </>
          )}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-hover transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                <div className="text-right flex-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Donations</span>
          </CardTitle>
          <CardDescription>
            Latest contributions from our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentDonations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      to {donation.charity.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${donation.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(donation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}