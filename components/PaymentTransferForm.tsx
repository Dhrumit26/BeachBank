"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      let receiverAccountId;
      try {
        receiverAccountId = decryptId(data.sharableId);
      } catch (decryptError: any) {
        alert(decryptError.message || "Invalid sharable ID format. Please check the sharable ID and try again.");
        setIsLoading(false);
        return;
      }
      
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      
      if (!receiverBank) {
        alert("Receiver bank account not found. Please check the sharable ID.");
        setIsLoading(false);
        return;
      }

      const senderBank = await getBank({ documentId: data.senderBank });

      if (!senderBank) {
        alert("Sender bank account not found. Please select a valid bank account.");
        setIsLoading(false);
        return;
      }

      if (!senderBank.fundingSourceUrl || !receiverBank.fundingSourceUrl) {
        alert("Bank account funding source URL is missing. Please ensure both accounts are properly connected.");
        setIsLoading(false);
        return;
      }

      // Validate funding source URLs format
      const isValidUrl = (url: string) => {
        try {
          return url && (url.startsWith('https://') || url.startsWith('http://')) && url.includes('funding-sources');
        } catch {
          return false;
        }
      };

      if (!isValidUrl(senderBank.fundingSourceUrl)) {
        alert(`Invalid sender bank funding source URL. Please reconnect your bank account.`);
        console.error('Invalid sender funding source URL:', senderBank.fundingSourceUrl);
        setIsLoading(false);
        return;
      }

      if (!isValidUrl(receiverBank.fundingSourceUrl)) {
        alert(`Invalid receiver bank funding source URL. The recipient's bank account may not be properly connected.`);
        console.error('Invalid receiver funding source URL:', receiverBank.fundingSourceUrl);
        setIsLoading(false);
        return;
      }

      console.log('=== Transfer Debug Info ===');
      console.log('Full Sender Bank Object:', JSON.stringify(senderBank, null, 2));
      console.log('Full Receiver Bank Object:', JSON.stringify(receiverBank, null, 2));
      console.log('Sender Bank userId:', senderBank.userId, 'Type:', typeof senderBank.userId);
      console.log('Receiver Bank userId:', receiverBank.userId, 'Type:', typeof receiverBank.userId);

      // Helper function to extract userId from object or string
      const extractUserId = (userId: any): string | null => {
        if (!userId) return null;
        
        // If it's already a string, return it
        if (typeof userId === 'string') {
          return userId.trim();
        }
        
        // If it's an object, try to extract the ID
        if (typeof userId === 'object') {
          // Try common ID field names
          if (userId.$id) return String(userId.$id).trim();
          if (userId.id) return String(userId.id).trim();
          if (userId.userId) return String(userId.userId).trim();
          // If it's an array, get the first element
          if (Array.isArray(userId) && userId.length > 0) {
            return extractUserId(userId[0]);
          }
          // Try to stringify and parse if it's a simple object
          try {
            const stringified = JSON.stringify(userId);
            // If it looks like it might contain an ID, try to extract it
            const idMatch = stringified.match(/"(\$?id|userId)":\s*"([^"]+)"/);
            if (idMatch && idMatch[2]) {
              return idMatch[2].trim();
            }
          } catch (e) {
            console.error('Error extracting userId from object:', e);
          }
        }
        
        return null;
      };

      // Extract and validate sender userId
      let senderUserId = extractUserId(senderBank.userId);
      if (!senderUserId) {
        const errorMsg = `Invalid sender user ID. The bank account has an invalid user ID format.\n\n` +
          `Bank Account ID: ${senderBank.$id}\n` +
          `User ID Value: ${JSON.stringify(senderBank.userId)}\n` +
          `User ID Type: ${typeof senderBank.userId}\n\n` +
          `Please reconnect your bank account through the "My Banks" page.`;
        alert(errorMsg);
        console.error('Invalid sender userId. Full bank object:', senderBank);
        setIsLoading(false);
        return;
      }

      // Extract and validate receiver userId
      let receiverUserId = extractUserId(receiverBank.userId);
      if (!receiverUserId) {
        const errorMsg = `Invalid receiver user ID. The recipient's bank account has an invalid user ID format.\n\n` +
          `Bank Account ID: ${receiverBank.$id}\n` +
          `User ID Value: ${JSON.stringify(receiverBank.userId)}\n` +
          `User ID Type: ${typeof receiverBank.userId}\n\n` +
          `The recipient needs to reconnect their bank account.`;
        alert(errorMsg);
        console.error('Invalid receiver userId. Full bank object:', receiverBank);
        setIsLoading(false);
        return;
      }

      console.log('Extracted sender userId:', senderUserId);
      console.log('Extracted receiver userId:', receiverUserId);
      console.log('Transfer params:', {
        source: senderBank.fundingSourceUrl,
        destination: receiverBank.fundingSourceUrl,
        amount: data.amount
      });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      
      // create transfer
      const transfer = await createTransfer(transferParams);

      if (!transfer) {
        alert("Transfer failed. Please check your account balance and try again.");
        setIsLoading(false);
        return;
      }

      // create transfer transaction
      // Ensure all fields are valid strings/numbers
      const transaction = {
        name: String(data.name || '').trim(),
        amount: String(data.amount || '0'), // Keep as string for now, will convert in action
        senderId: senderUserId, // Use extracted userId (already validated as string)
        senderBankId: String(senderBank.$id).trim(),
        receiverId: receiverUserId, // Use extracted userId (already validated as string)
        receiverBankId: String(receiverBank.$id).trim(),
        email: String(data.email || '').trim(),
      };

      // Validate all required fields
      if (!transaction.senderId || !transaction.receiverId || !transaction.senderBankId || !transaction.receiverBankId) {
        alert("Missing required transaction information. Please try again.");
        console.error('Invalid transaction data:', transaction);
        setIsLoading(false);
        return;
      }

      console.log('Creating transaction record:', transaction);

      try {
        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          console.log('Transaction record created successfully');
          form.reset();
          router.push("/");
        } else {
          alert("Transfer completed but failed to create transaction record. Please contact support.");
        }
      } catch (transactionError: any) {
        console.error('Transaction creation error:', transactionError);
        alert(`Transfer completed successfully, but failed to save transaction record: ${transactionError.message}. The transfer was successful, but you may need to contact support to verify the transaction.`);
        // Still redirect since transfer was successful
        form.reset();
        router.push("/");
      }
    } catch (error: any) {
      console.error("Submitting create transfer request failed: ", error);
      const errorMessage = error?.message || "Transfer failed. Please try again.";
      alert(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Select Source Bank
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient&apos;s Email Address
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: johndoe@gmail.com"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Plaid Sharable Id
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the public account number"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
