declare module "@paystack/inline-js" {
  interface PaystackTransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    reference?: string;
    channels?: ("card" | "bank" | "ussd" | "qr" | "mobile_money" | "bank_transfer" | "eft")[];
    metadata?: Record<string, unknown>;
    onSuccess: (transaction: { reference: string; [key: string]: unknown }) => void;
    onCancel: () => void;
  }

  class PaystackPop {
    newTransaction(options: PaystackTransactionOptions): void;
  }

  export default PaystackPop;
}
