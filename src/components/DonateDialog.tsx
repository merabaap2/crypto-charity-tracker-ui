import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertCircle, CheckCircle, Loader2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useConnect, useDisconnect, useWriteContract, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CHARITY_CONTRACT_ADDRESS, CHARITY_CONTRACT_ABI } from '@/lib/contracts';
import { metaMask } from 'wagmi/connectors';

interface DonateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  charity: {
    id: number;
    name: string;
    address: string;
  };
}

export default function DonateDialog({ open, onOpenChange, charity }: DonateDialogProps) {
  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [step, setStep] = useState<'connect' | 'input' | 'donate' | 'success'>('connect');
  const { toast } = useToast();
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  
  // Get user's MON balance
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address,
    query: { enabled: !!address }
  });
  
  const userBalance = balance ? parseFloat(formatEther(balance.value)) : 0;
  
  // Update step based on connection status
  useEffect(() => {
    if (isConnected && step === 'connect') {
      setStep('input');
    } else if (!isConnected && step !== 'connect') {
      setStep('connect');
    }
  }, [isConnected, step]);
  
  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      toast({
        title: "Connection Failed",
        description: connectError.message,
        variant: "destructive",
      });
    }
  }, [connectError, toast]);
  
  // Handle write contract errors
  useEffect(() => {
    if (writeError) {
      toast({
        title: "Transaction Failed",
        description: writeError.message,
        variant: "destructive",
      });
    }
  }, [writeError, toast]);

  const handleConnectWallet = async () => {
    const metaMaskConnector = connectors.find(c => c.id === 'metaMask');
    if (metaMaskConnector) {
      await connect({ connector: metaMaskConnector });
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to continue.",
        variant: "destructive",
      });
    }
  };

  const handleProceedToDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough MON for this donation.",
        variant: "destructive",
      });
      return;
    }

    // Since we're using native tokens, no approval needed
    setStep('donate');
  };

  const handleDonate = async () => {
    setIsDonating(true);
    
    try {
      await writeContract({
        address: CHARITY_CONTRACT_ADDRESS,
        abi: CHARITY_CONTRACT_ABI,
        functionName: 'donate',
        args: [charity.id],
        value: parseEther(amount),
      });
      
      // Wait for transaction
      setTimeout(async () => {
        await refetchBalance();
        setIsDonating(false);
        setStep('success');
        toast({
          title: "Donation Successful! 🎉",
          description: `Thank you for donating ${amount} MON to ${charity.name}`,
        });
      }, 3000);
    } catch (error) {
      setIsDonating(false);
      console.error('Donation failed:', error);
    }
  };

  const resetDialog = () => {
    setAmount('');
    setStep(isConnected ? 'input' : 'connect');
    setIsApproving(false);
    setIsDonating(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetDialog, 300); // Reset after dialog closes
  };

  const getStepInfo = () => {
    switch (step) {
      case 'connect':
        return {
          title: "Connect Your Wallet",
          description: "Connect MetaMask to start donating to charity",
        };
      case 'input':
        return {
          title: `Donate to ${charity.name}`,
          description: "Enter the amount you'd like to donate in MON",
        };
      case 'donate':
        return {
          title: "Complete Donation",
          description: "Confirm your donation transaction",
        };
      case 'success':
        return {
          title: "Donation Complete! 🎉",
          description: "Your generous donation has been sent successfully",
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            {stepInfo.title}
          </DialogTitle>
          <DialogDescription>
            {stepInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Charity Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{charity.name}</p>
                <p className="text-sm text-muted-foreground">
                  {charity.address.slice(0, 6)}...{charity.address.slice(-4)}
                </p>
              </div>
              <Badge variant="secondary">
                <Heart className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
          </div>

          {/* Wallet Info */}
          {isConnected && (
            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Connected Wallet</p>
                  <p className="text-xs text-muted-foreground">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{userBalance.toFixed(4)} MON</p>
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          {step === 'connect' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <Wallet className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm">
                  Connect your MetaMask wallet to donate to {charity.name}.
                  Make sure you have MON tokens in your wallet and are connected to Monad network.
                </p>
              </div>

              <Button
                variant="charity"
                className="w-full"
                onClick={handleConnectWallet}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </Button>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Donation Amount (MON)</Label>
                <div className="relative mt-1">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-muted-foreground">MON</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Balance: {userBalance.toFixed(4)} MON
                </p>
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['0.1', '0.5', '1', '5'].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset)}
                  >
                    {preset} MON
                  </Button>
                ))}
              </div>

              <Button
                variant="charity"
                className="w-full"
                onClick={handleProceedToDonate}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Continue to Donate
              </Button>
            </div>
          )}


          {step === 'donate' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm">
                  Ready to donate <strong>{amount} MON</strong> to {charity.name}.
                  Confirm this transaction in your wallet.
                </p>
              </div>

              <Button
                variant="charity"
                className="w-full"
                onClick={handleDonate}
                disabled={isDonating}
              >
                {isDonating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDonating ? 'Processing Donation...' : `Donate ${amount} MON`}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-success/5 rounded-lg">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm">
                  Your donation of <strong>{amount} MON</strong> has been successfully sent to {charity.name}.
                </p>
              </div>

              {hash && (
                <div className="text-xs text-muted-foreground break-all">
                  <p>Transaction Hash:</p>
                  <p className="font-mono">{hash}</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs"
                    onClick={() => window.open(`https://testnet-explorer.monad.xyz/tx/${hash}`, '_blank')}
                  >
                    View on Explorer
                  </Button>
                </div>
              )}

              <Button
                variant="charity"
                className="w-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}