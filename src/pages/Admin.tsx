import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  sentTemplates: Array<{
    name: string;
    sentAt: string;
    content: string;
  }>;
};

const emailTemplates = {
  thanks: {
    subject: "Thanks for signing up",
    content: `Thank you for signing up! We're excited to have you on board.

We look forward to helping you achieve great things with our product.

Best regards,
The Team`
  },
  improve: {
    subject: "What can we improve?",
    content: `We hope you're enjoying our product! We're constantly working to make it better, and your feedback would be invaluable.

Could you take a moment to let us know:
• What features do you find most useful?
• What could we improve?
• What features would you like to see added?

Simply reply to this email with your thoughts. We read and consider all feedback carefully.

Thank you for your help!
The Team`
  },
  questions: {
    subject: "How is it going?",
    content: `Hi there! Just checking in to see how you're doing with our product.

Are you finding everything you need? Do you have any questions we can help with?

Feel free to reply to this email - we're here to help!

Best regards,
The Team`
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [draftEmail, setDraftEmail] = useState("");
  const [selectedEmailContent, setSelectedEmailContent] = useState<string | null>(null);

  const { data: contactsWithLogs, isLoading, refetch } = useQuery({
    queryKey: ["contacts-with-logs"],
    queryFn: async () => {
      const { data: contacts, error: contactsError } = await supabase
        .from("contacts")
        .select("*, email_logs(template_name, sent_at, content)")
        .order("created_at", { ascending: false });

      if (contactsError) throw contactsError;

      return contacts.map(contact => ({
        ...contact,
        sentTemplates: contact.email_logs.map((log: { template_name: string, sent_at: string, content: string }) => ({
          name: log.template_name,
          sentAt: log.sent_at,
          content: log.content
        }))
      }));
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const sendEmail = async (name: string, email: string, template: "thanks" | "improve" | "questions" | "custom", contactId: string, content: string) => {
    try {
      const { error: emailError } = await supabase.functions.invoke("send-admin-email", {
        body: { name, email, template, content },
      });

      if (emailError) throw emailError;

      const { error: logError } = await supabase
        .from('email_logs')
        .insert([
          {
            contact_id: contactId,
            template_name: template,
            content: content
          }
        ]);

      if (logError) throw logError;

      toast({
        title: "Email sent successfully",
        description: `Email sent to ${email}`,
      });

      setDraftEmail(""); // Clear the draft email after sending
      await refetch();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending email",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-6">Loading contacts...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactsWithLogs?.map((contact) => (
                  <TableRow 
                    key={contact.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {contact.message}
                    </TableCell>
                    <TableCell>
                      {format(new Date(contact.created_at), "PPp")}
                    </TableCell>
                  </TableRow>
                ))}
                {contactsWithLogs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No contacts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Sheet open={!!selectedContact} onOpenChange={() => {
        setSelectedContact(null);
        setDraftEmail("");
        setSelectedEmailContent(null);
      }}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Contact Details</SheetTitle>
            <SheetDescription>
              Submitted on {selectedContact && format(new Date(selectedContact.created_at), "PPp")}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1">{selectedContact?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{selectedContact?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Message</h3>
              <p className="mt-1 whitespace-pre-wrap">{selectedContact?.message}</p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Email Templates</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => {
                      if (selectedContact && template.content) {
                        setDraftEmail(template.content);
                        setSelectedEmailContent(null);
                      }
                    }}
                    className="w-full"
                  >
                    {template.subject}
                  </Button>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Email Content</h3>
              <Textarea
                value={selectedEmailContent || draftEmail}
                onChange={(e) => {
                  setDraftEmail(e.target.value);
                  setSelectedEmailContent(null);
                }}
                className="min-h-[200px]"
                placeholder="Write your email here..."
              />
              <Button 
                className="mt-4 w-full"
                disabled={!draftEmail.trim()}
                onClick={() => {
                  if (selectedContact) {
                    sendEmail(
                      selectedContact.name,
                      selectedContact.email,
                      "custom",
                      selectedContact.id,
                      draftEmail
                    );
                  }
                }}
              >
                Send Email
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500">Sent Emails</h3>
              <div className="mt-1">
                {selectedContact?.sentTemplates.length === 0 ? (
                  <p className="text-gray-500">No emails sent yet</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedContact?.sentTemplates.map((template, index) => (
                      <li 
                        key={`${template.name}-${template.sentAt}`}
                        className="flex justify-between text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => setSelectedEmailContent(template.content)}
                      >
                        <span className="capitalize">{template.name}</span>
                        <span className="text-gray-500">
                          {format(new Date(template.sentAt), "PPp")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Admin;