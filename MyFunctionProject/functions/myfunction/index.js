/**
 * Describe Myfunction here.
 *
 * The exported method is the entry point for your code when the function is invoked. 
 *
 * Following parameters are pre-configured and provided to your function on execution: 
 * @param event: represents the data associated with the occurrence of an event, and  
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.

 
 export default async function (event, context, logger) {
    logger.info(
      `Invoking myfunction with payload ${JSON.stringify(event.data || {})}`
    );
  
    const results = await context.org.data.query("SELECT Id, Name FROM Account");
    logger.info(JSON.stringify(results));
    return results;
  };
 */

  "use strict";

export default async function (event, context, logger) {
  logger.info(
    `Invoking salesforcesdkjs Function with payload ${JSON.stringify(event.data || {})}`
  );

  // Extract Properties from Payload
  const { name, accountNumber, industry, type, website } = event.data;

  // Validate the payload params
  if (!name) {
    throw new Error(`Please provide account name`);
  }

  // Define a record using the RecordForCreate type and providing the Developer Name
  const account = {
    type: "Account",
    fields: {
      Name: `${name}-${Date.now()}`,
      Industry: industry,
      Type: type,
      Website: website,
    },
  };

  logger.info(
    `AA payload ${JSON.stringify(account)}`
  );

  try {
    // Insert the record using the SalesforceSDK DataApi and get the new Record Id from the result
    const { id: recordId } = await context.org.dataApi.create(account);

    logger.info(
      `AA new id >> ${id}`
    );

    // Query Accounts using the SalesforceSDK DataApi to verify that our new Account was created.
    const soql = `SELECT Fields(STANDARD) FROM Account WHERE Id = '${recordId}'`;

    logger.info(
      `AA SOQL >> ${soql}`
    );

    const queryResults = await context.org.dataApi.query(soql);

    logger.info(
      `AA Query Result  >> ${queryResults}`
    );


    return queryResults;
  } catch (err) {
    // Catch any DML errors and pass the throw an error with the message
    const errorMessage = `Failed to insert record. Root Cause: ${err.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};