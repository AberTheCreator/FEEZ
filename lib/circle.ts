import axios from "axios"
import { ethers } from "ethers" 

const CIRCLE_API_BASE = "https://api.circle.com/v1/paymaster"
const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY

interface UserOperation {
  sender: string
  nonce: string
  initCode: string
  callData: string
  callGasLimit: string
  verificationGasLimit: string
  preVerificationGas: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  paymasterAndData?: string
  signature: string
}

interface EstimateGasRequest {
  chainId: number
  userOperation: UserOperation
}

interface EstimateGasResponse {
  gasFeeNative: string
  gasFeeUSDC: string
  paymasterAndData: string
}

interface SponsorUserOperationRequest {
  chainId: number
  userOperation: UserOperation
  sponsor: boolean
}

interface SponsorUserOperationResponse {
  userOpHash: string
  paymasterAndData: string
  gasFeeUSDC: string
}

export class CirclePaymaster {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || CIRCLE_API_KEY || ""
    if (!this.apiKey) {
      throw new Error("Circle API key is required")
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    }
  }

  async estimateGas(request: EstimateGasRequest): Promise<EstimateGasResponse> {
    try {
      const response = await axios.post(
        `${CIRCLE_API_BASE}/estimateGas`,
        request,
        { headers: this.getHeaders() }
      )

      return response.data
    } catch (error) {
      console.error("Circle Paymaster estimateGas error:", error)
      throw new Error(`Failed to estimate gas: ${error}`)
    }
  }

  async sponsorUserOperation(
    request: SponsorUserOperationRequest
  ): Promise<SponsorUserOperationResponse> {
    try {
      const response = await axios.post(
        `${CIRCLE_API_BASE}/sponsorUserOperation`,
        request,
        { headers: this.getHeaders() }
      )

      return response.data
    } catch (error) {
      console.error("Circle Paymaster sponsorUserOperation error:", error)
      throw new Error(`Failed to sponsor user operation: ${error}`)
    }
  }


  static createMintNFTUserOperation(params: {
    sender: string
    nonce: string
    contractAddress: string
    recipient: string
    tokenURI: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }): UserOperation {
    // Define the NFT ABI (only the mint function)
    const abi = ["function mint(address to, string memory tokenURI)"]
    const iface = new ethers.Interface(abi)

    // Encode the function call
    const callData = iface.encodeFunctionData("mint", [
      params.recipient,
      params.tokenURI,
    ])

    return {
      sender: params.sender,
      nonce: params.nonce,
      initCode: "0x",
      callData,
      callGasLimit: "100000",
      verificationGasLimit: "100000",
      preVerificationGas: "21000",
      maxFeePerGas: params.maxFeePerGas,
      maxPriorityFeePerGas: params.maxPriorityFeePerGas,
      signature: "0x", // Wallet signs later
    }
  }
}

export class MockCirclePaymaster {
  async estimateGas(
    request: EstimateGasRequest
  ): Promise<EstimateGasResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const baseGasNative = 0.0005
    const usdcRate = 0.5

    return {
      gasFeeNative: (baseGasNative * (1 + Math.random() * 0.2)).toFixed(8),
      gasFeeUSDC: (baseGasNative * 3000 * usdcRate).toFixed(2),
      paymasterAndData: "0x" + "0".repeat(130),
    }
  }

  async sponsorUserOperation(
    request: SponsorUserOperationRequest
  ): Promise<SponsorUserOperationResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      userOpHash:
        "0x" + Math.random().toString(16).slice(2).padStart(64, "0"),
      paymasterAndData: "0x" + "0".repeat(130),
      gasFeeUSDC: "0.75",
    }
  }
}

export const circlePaymaster =
  process.env.NODE_ENV === "development"
    ? new MockCirclePaymaster()
    : new CirclePaymaster()
