import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, ExternalLink, ArrowLeft, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TransactionStatus() {
  const { hash } = useParams<{ hash: string }>();
  const { toast } = useToast();

  // Mock transaction data - in real app, this would come from blockchain query
  const mockTransaction = {
    hash: hash || '0x1234567890abcdef',
    status: 'success', // 'pending' | 'success' | 'failed'
    amount: '100 USDC',
    charity: 'Clean Water Foundation',
    charityId: 0,
    donor: '0x742d35Cc6635C0532925a3b8D6Ac6E4a03a3BBD9',
    timestamp: '2024-01-15 14:30:25 UTC',
    blockNumber: 1234567,
    gasUsed: '21000',
    gasPrice: '20 gwei',
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6 text-warning" />,
          color: 'warning',
          title: 'Transaction Pending',
          description: 'Your donation is being processed on the blockchain...',
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-success" />,
          color: 'success',
          title: 'Donation Successful! 🎉',
          description: 'Your generous donation has been confirmed on the blockchain.',
        };
      case 'failed':
        return {
          icon: <AlertCircle className="h-6 w-6 text-destructive" />,
          color: 'destructive',
          title: 'Transaction Failed',
          description: 'Unfortunately, your transaction could not be completed.',
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-muted-foreground" />,
          color: 'secondary',
          title: 'Unknown Status',
          description: 'Transaction status could not be determined.',
        };
    }
  };

  const statusInfo = getStatusInfo(mockTransaction.status);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard.",
    });
  };

  const explorerUrl = `https://testnet-explorer.monad.xyz/tx/${hash}`;

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Status Card */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {statusInfo.icon}
          </div>
          <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
          <CardDescription>{statusInfo.description}</CardDescription>
          <Badge variant={statusInfo.color as any} className="w-fit mx-auto mt-2">
            {mockTransaction.status.toUpperCase()}
          </Badge>
        </CardHeader>
      </Card>

      {/* Transaction Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-bold text-lg text-primary">{mockTransaction.amount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Charity</p>
              <Link 
                to={`/charity/${mockTransaction.charityId}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {mockTransaction.charity}
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Block</p>
              <p className="font-medium">#{mockTransaction.blockNumber}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Transaction Hash</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {hash?.slice(0, 10)}...{hash?.slice(-8)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hash || '')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">From</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {mockTransaction.donor.slice(0, 6)}...{mockTransaction.donor.slice(-4)}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Timestamp</span>
              <span className="text-sm">{mockTransaction.timestamp}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Gas Used</span>
              <span className="text-sm">{mockTransaction.gasUsed}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" asChild className="flex-1">
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </a>
        </Button>
        {mockTransaction.status === 'success' && (
          <Button variant="charity" asChild className="flex-1">
            <Link to={`/charity/${mockTransaction.charityId}`}>
              View Charity
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}