import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [step, setStep] = useState<'input' | 'approve' | 'donate' | 'success'>('input');
  const { toast } = useToast();

  // Mock user balance
  const userBalance = 1000; // USDC

  const handleApprove = async () => {
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
        description: "You don't have enough USDC for this donation.",
        variant: "destructive",
      });
      return;
    }

    setIsApproving(true);
    
    // Simulate approval transaction
    setTimeout(() => {
      setIsApproving(false);
      setStep('donate');
      toast({
        title: "Approval Successful",
        description: "USDC spending approved. You can now complete your donation.",
      });
    }, 2000);
  };

  const handleDonate = async () => {
    setIsDonating(true);
    
    // Simulate donation transaction
    setTimeout(() => {
      setIsDonating(false);
      setStep('success');
      toast({
        title: "Donation Successful! 🎉",
        description: `Thank you for donating $${amount} USDC to ${charity.name}`,
      });
    }, 3000);
  };

  const resetDialog = () => {
    setAmount('');
    setStep('input');
    setIsApproving(false);
    setIsDonating(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetDialog, 300); // Reset after dialog closes
  };

  const getStepInfo = () => {
    switch (step) {
      case 'input':
        return {
          title: `Donate to ${charity.name}`,
          description: "Enter the amount you'd like to donate in USDC",
        };
      case 'approve':
        return {
          title: "Approve USDC Spending",
          description: "Authorize the smart contract to spend your USDC tokens",
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

          {/* Step Content */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Donation Amount (USDC)</Label>
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
                    <span className="text-sm text-muted-foreground">USDC</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Balance: {userBalance.toLocaleString()} USDC
                </p>
              </div>

              {/* Quick amount buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['10', '25', '50', '100'].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset)}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>

              <Button
                variant="charity"
                className="w-full"
                onClick={handleApprove}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Continue to Approve
              </Button>
            </div>
          )}

          {step === 'approve' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <AlertCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm">
                  You need to approve spending of <strong>${amount} USDC</strong> before you can donate.
                  This is a one-time approval for this donation amount.
                </p>
              </div>

              <Button
                variant="charity"
                className="w-full"
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isApproving ? 'Approving...' : `Approve $${amount} USDC`}
              </Button>
            </div>
          )}

          {step === 'donate' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm">
                  Ready to donate <strong>${amount} USDC</strong> to {charity.name}.
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
                {isDonating ? 'Processing Donation...' : `Donate $${amount} USDC`}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-success/5 rounded-lg">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm">
                  Your donation of <strong>${amount} USDC</strong> has been successfully sent to {charity.name}.
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                Transaction Hash: 0x1234...5678
              </div>

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