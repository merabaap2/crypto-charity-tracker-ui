export const CHARITY_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890' as const;
export const USDC_CONTRACT_ADDRESS = '0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c' as const;

export const CHARITY_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "charityId",
        "type": "uint8"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "charity",
        "type": "address"
      }
    ],
    "name": "totalDonated",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "charity",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Donation",
    "type": "event"
  }
] as const;

export const USDC_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Mock charities data
export const CHARITIES = [
  {
    id: 0,
    name: "Clean Water Foundation",
    description: "Providing clean water access to communities worldwide",
    address: "0x742d35Cc6635C0532925a3b8D6Ac6E4a03a3BBD9",
    image: "/placeholder.svg",
    mission: "Our mission is to ensure every person has access to clean, safe drinking water. We build wells, water treatment facilities, and educate communities about water conservation.",
  },
  {
    id: 1,
    name: "Education for All",
    description: "Supporting education initiatives in underserved areas",
    address: "0x8a0A5CCa7B7C6EC3EC7093E6Eb8A4C3F6D4E5fA2",
    image: "/placeholder.svg",
    mission: "We believe education is the key to breaking the cycle of poverty. Our programs provide schools, teachers, and educational materials to children in need.",
  },
  {
    id: 2,
    name: "Medical Relief International",
    description: "Emergency medical aid and healthcare infrastructure",
    address: "0x9B1E2C3D4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D",
    image: "/placeholder.svg",
    mission: "Delivering critical medical care to areas affected by natural disasters, conflicts, and health crises while building sustainable healthcare systems.",
  },
  {
    id: 3,
    name: "Environmental Conservation",
    description: "Protecting forests and wildlife habitats",
    address: "0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0",
    image: "/placeholder.svg",
    mission: "Preserving our planet's biodiversity through forest conservation, wildlife protection, and sustainable development initiatives.",
  },
] as const;