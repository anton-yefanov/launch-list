import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received Tally webhook data:", JSON.stringify(data, null, 2));

    const {
      eventId,
      eventType, // Usually "FORM_RESPONSE"
      createdAt,
      data: formData,
    } = data;

    // Process the form fields
    // Tally sends field data as an array of objects
    const processedData = {};

    if (formData && formData.fields) {
      formData.fields.forEach((field) => {
        // Use the field label as key, value as the submitted data
        processedData[field.label] = field.value;
      });
    }

    console.log("Processed form data:", processedData);

    // Here you can:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Trigger other business logic
    // 4. Call external APIs

    // Example: Save to database (pseudo-code)
    // await saveFormSubmission({
    //   eventId,
    //   submittedAt: createdAt,
    //   formData: processedData
    // });

    // Example: Send email notification
    // await sendNotificationEmail(processedData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
        eventId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing Tally webhook:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process webhook",
      },
      { status: 500 },
    );
  }
}
