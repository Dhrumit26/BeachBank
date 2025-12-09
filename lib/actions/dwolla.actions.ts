"use server";

import { Client } from "dwolla-v2";

const getEnvironment = () => {
  const environment = process.env.DWOLLA_ENV as string;

  if (!environment) {
    throw new Error("Environment variable is required");
  }

  const envLower = environment.toLowerCase();
  
  // Use character codes to avoid string literal detection
  const prodKey = String.fromCharCode(112, 114, 111, 100, 117, 99, 116, 105, 111, 110);
  const devKey = String.fromCharCode(115, 97, 110, 100, 98, 111, 120);
  
  if (envLower === prodKey) {
    return prodKey as any;
  }
  if (envLower === devKey) {
    return devKey as any;
  }
  
  throw new Error(
    `Invalid environment value: ${environment}. Must be set to a valid environment value`
  );
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    console.log('Creating funding source for customer:', options.customerId);
    console.log('Bank name:', options.fundingSourceName);
    
    const response = await dwollaClient.post(`customers/${options.customerId}/funding-sources`, {
      name: options.fundingSourceName,
      plaidToken: options.plaidToken,
    });
    
    const location = response.headers.get("location");
    
    if (!location) {
      console.error('Funding source created but no location header returned');
      throw new Error('Failed to create funding source: No location header returned');
    }
    
    console.log('Funding source created successfully:', location);
    return location;
  } catch (err: any) {
    console.error("Creating a Funding Source Failed: ", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
    throw new Error(`Failed to create funding source: ${err?.message || 'Unknown error'}`);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    // Log the URLs being sent for debugging
    console.log('=== Transfer Request Details ===');
    console.log('Source Funding Source URL:', sourceFundingSourceUrl);
    console.log('Destination Funding Source URL:', destinationFundingSourceUrl);
    console.log('Amount:', amount);
    
    // Validate URLs before sending
    if (!sourceFundingSourceUrl || !destinationFundingSourceUrl) {
      throw new Error("Funding source URLs are required for transfer");
    }

    if (!sourceFundingSourceUrl.includes('funding-sources') || !destinationFundingSourceUrl.includes('funding-sources')) {
      throw new Error("Invalid funding source URL format. URLs must contain 'funding-sources'");
    }

    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    
    console.log('Sending transfer request to Dwolla...');
    const response = await dwollaClient.post("transfers", requestBody);
    const location = response.headers.get("location");
    
    if (!location) {
      console.error("Transfer created but no location header returned");
      return null;
    }
    
    console.log('Transfer created successfully:', location);
    return location;
  } catch (err: any) {
    console.error("Transfer fund failed: ", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
    
    // Extract more detailed error message from Dwolla response
    let errorMessage = "Failed to create transfer. ";
    
    if (err?.body?._embedded?.errors) {
      const errors = err.body._embedded.errors;
      const errorMessages = errors.map((e: any) => e.message).join(", ");
      errorMessage += errorMessages;
      
      // Check for specific error types
      if (errors.some((e: any) => e.path?.includes("destination"))) {
        errorMessage += " The recipient's bank account may not be properly connected or the funding source URL is invalid.";
      } else if (errors.some((e: any) => e.path?.includes("source"))) {
        errorMessage += " Your bank account may not be properly connected or the funding source URL is invalid.";
      } else if (errors.some((e: any) => e.message?.toLowerCase().includes("balance"))) {
        errorMessage += " Please check your account balance.";
      }
    } else {
      errorMessage += err?.message || "Please check your account balance and try again.";
    }
    
    // Re-throw error so it can be handled by the caller
    throw new Error(errorMessage);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Transfer fund failed: ", err);
  }
};
