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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  sentTemplates: Array<{
    name: string;
    sentAt: string;
  }>;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contactsWithLogs, isLoading, refetch } = useQuery({
    queryKey: ["contacts-with-logs"],
    queryFn: async () => {
      const { data: contacts, error: contactsError } = await supabase
        .from("contacts")
        .select("*, email_logs(template_name, sent_at)")
        .order("created_at", { ascending: false });

      if (contactsError) throw contactsError;

      return contacts.map(contact => ({
        ...contact,
        sentTemplates: contact.email_logs.map((log: { template_name: string, sent_at: string }) => ({
          name: log.template_name,
          sentAt: log.sent_at
        }))
      }));
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const sendEmail = async (name: string, email: string, template: "thanks" | "improve" | "questions", contactId: string) => {
    try {
      const { error: emailError } = await supabase.functions.invoke("send-admin-email", {
        body: { name, email, template },
      });

      if (emailError) throw emailError;

      const { error: logError } = await supabase
        .from('email_logs')
        .insert([
          {
            contact_id: contactId,
            template_name: template,
          }
        ]);

      if (logError) throw logError;

      toast({
        title: "Email sent successfully",
        description: `${template} email sent to ${email}`,
      });

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
                  <TableHead>Actions</TableHead>
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
                    <TableCell>
                      <div className="flex gap-2">
                        {["thanks", "improve", "questions"].map((template) => {
                          const sentTemplate = contact.sentTemplates.find(
                            (t) => t.name === template
                          );
                          const isDisabled = !!sentTemplate;

                          return (
                            <HoverCard key={template}>
                              <HoverCardTrigger asChild>
                                <div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isDisabled) {
                                        sendEmail(contact.name, contact.email, template as "thanks" | "improve" | "questions", contact.id);
                                      }
                                    }}
                                    disabled={isDisabled}
                                    className={isDisabled ? "opacity-50" : ""}
                                  >
                                    {template.charAt(0).toUpperCase() + template.slice(1)}
                                  </Button>
                                </div>
                              </HoverCardTrigger>
                              {isDisabled && (
                                <HoverCardContent className="w-auto">
                                  <p className="text-sm">
                                    Sent on {format(new Date(sentTemplate.sentAt), "PPp")}
                                  </p>
                                </HoverCardContent>
                              )}
                            </HoverCard>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contactsWithLogs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No contacts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Sheet open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Contact Details</SheetTitle>
            <SheetDescription>
              Submitted on {selectedContact && format(new Date(selectedContact.created_at), "PPp")}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
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
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sent Emails</h3>
              <div className="mt-1">
                {selectedContact?.sentTemplates.length === 0 ? (
                  <p className="text-gray-500">No emails sent yet</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedContact?.sentTemplates.map((template) => (
                      <li key={template.name} className="flex justify-between text-sm">
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