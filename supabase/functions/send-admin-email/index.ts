import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "npm:zod@3.22.4";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { ThanksEmail } from './_templates/thanks.tsx';
import { ImproveEmail } from './_templates/improve.tsx';
import { QuestionsEmail } from './_templates/questions.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const adminEmailSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  template: z.enum(["thanks", "improve", "questions"]),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate the request body
    const validationResult = adminEmailSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data",
          details: validationResult.error.errors 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }

    const { name, email, template } = validationResult.data;

    // Generate a unique reference ID
    const refId = `${Date.now()}.${Math.random().toString(36).substring(2)}@loveable-resend.online`;

    // Select the appropriate template and subject
    let EmailTemplate;
    let subject;
    switch (template) {
      case "thanks":
        EmailTemplate = ThanksEmail;
        subject = "Thank you for signing up!";
        break;
      case "improve":
        EmailTemplate = ImproveEmail;
        subject = "Help us improve our product";
        break;
      case "questions":
        EmailTemplate = QuestionsEmail;
        subject = "How is everything going?";
        break;
    }

    // Render the React email template
    const html = await renderAsync(
      React.createElement(EmailTemplate, {
        name,
      })
    );

    const emailResponse = await resend.emails.send({
      from: "Chris <chris@updates.loveable-resend.online>",
      to: [email],
      subject,
      html,
      headers: {
        "X-Entity-Ref-ID": refId,
      }
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);