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
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const sendEmail = async (name: string, email: string, template: "thanks" | "improve" | "questions", contactId: string) => {
    try {
      // Send the email
      const { error: emailError } = await supabase.functions.invoke("send-admin-email", {
        body: { name, email, template },
      });

      if (emailError) throw emailError;

      // Log the email send
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
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts?.map((contact) => (
                  <TableRow key={contact.id}>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendEmail(contact.name, contact.email, "thanks", contact.id)}
                        >
                          Thanks
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendEmail(contact.name, contact.email, "improve", contact.id)}
                        >
                          Improve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendEmail(contact.name, contact.email, "questions", contact.id)}
                        >
                          Questions
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {contacts?.length === 0 && (
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
    </div>
  );
};

export default Admin;