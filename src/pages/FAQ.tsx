import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqs = [
    {
      question: "What is CharityChain?",
      answer: "CharityChain is a blockchain-based charitable donation platform built on the Monad network. It enables transparent, secure, and efficient donations to verified charities using USDC cryptocurrency."
    },
    {
      question: "How do I make a donation?",
      answer: "To make a donation, you need to: 1) Connect your wallet (MetaMask recommended), 2) Ensure you're on the Monad testnet, 3) Have USDC tokens in your wallet, 4) Select a charity and click 'Donate', 5) Approve the USDC spending if needed, 6) Confirm the donation transaction."
    },
    {
      question: "What wallet do I need?",
      answer: "We recommend MetaMask as it's widely supported and easy to use. Make sure to add the Monad Testnet to your wallet. Other Web3 wallets that support custom networks should also work."
    },
    {
      question: "Is my donation tax deductible?",
      answer: "Tax deductibility depends on your local tax laws and the charity's status in your jurisdiction. Please consult with a tax professional for specific advice regarding your donations."
    },
    {
      question: "How are charities verified?",
      answer: "All charities on our platform undergo a rigorous verification process including legal registration checks, mission validation, and ongoing monitoring to ensure they are legitimate and effective organizations."
    },
    {
      question: "Can I see where my donation goes?",
      answer: "Yes! All donations are recorded on the blockchain, providing complete transparency. You can track your transaction and see how funds are distributed to the charity's wallet address."
    },
    {
      question: "What are the fees?",
      answer: "CharityChain charges no platform fees. You only pay the standard blockchain gas fees for transaction processing on the Monad network, which are typically very low."
    },
    {
      question: "Can I donate anonymously?",
      answer: "While your wallet address is visible on the blockchain (providing transparency), personal information is not required or stored on our platform. Your donations can be considered pseudonymous."
    },
    {
      question: "What if my transaction fails?",
      answer: "If your transaction fails, no funds will be deducted from your wallet. Common causes include insufficient gas fees, network congestion, or insufficient USDC balance. Check your wallet and try again."
    },
    {
      question: "Is CharityChain secure?",
      answer: "Yes, CharityChain is built on blockchain technology which provides inherent security. Our smart contracts handle all donations, and funds go directly to charity wallets without intermediaries."
    },
    {
      question: "Can I donate other cryptocurrencies?",
      answer: "Currently, we only support USDC donations to ensure stability and ease of use for charities. We plan to add support for other tokens in future updates."
    },
    {
      question: "How do I get USDC for donations?",
      answer: "You can obtain USDC through cryptocurrency exchanges, DEXs, or other DeFi platforms. For the Monad testnet, you may need to bridge tokens from other networks or use testnet faucets."
    }
  ];

  const quickLinks = [
    { title: "Getting Started", description: "Learn how to make your first donation", link: "/" },
    { title: "Supported Charities", description: "View all verified charities", link: "/" },
    { title: "Monad Network", description: "Learn about the blockchain we use", link: "https://monad.xyz" },
    { title: "Contact Support", description: "Get help with any issues", link: "mailto:support@charitychain.org" },
  ];

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          <HelpCircle className="mr-1 h-3 w-3" />
          Frequently Asked Questions
        </Badge>
        <h1 className="text-4xl font-bold mb-6">How can we help you?</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about CharityChain and blockchain donations
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-hover transition-all duration-300">
            <CardContent className="pt-6">
              {link.link.startsWith('http') ? (
                <a href={link.link} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </a>
              ) : link.link.startsWith('mailto') ? (
                <a href={link.link} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </a>
              ) : (
                <Link to={link.link} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Click on any question to view the answer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="mt-12 bg-gradient-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            Still have questions?
          </CardTitle>
          <CardDescription>
            We're here to help you make a difference through blockchain donations
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="charity" asChild>
              <a href="mailto:support@charitychain.org">
                Contact Support
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}