"use client";
import { useEffect, useState } from "react";

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    submitted_at?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    subject?: string;
    message?: string;
}>>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  async function fetchMessages() {
    try {
      const res = await fetch("/api/contact-messages", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setError(data.error || "Erreur de chargement");
      }
    } catch (err) {
      setError("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }
  fetchMessages();
}, []);

return (
  <div className="max-w-5xl mx-auto py-16">
    <h1 className="text-3xl font-bold mb-8 text-purple">Messages de contact</h1>
    {loading ? (
      <div className="text-sm text-body">Chargement des messages...</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : !messages.length ? (
      <div className="text-body">Aucun message enregistré.</div>
    ) : (
      <div className="overflow-x-auto rounded-xl border border-purple/20 bg-white dark:bg-navy/80 shadow-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-purple/10">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Sujet</th>
              <th className="px-4 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id} className="border-t border-purple/10">
                <td className="px-4 py-2 whitespace-nowrap text-xs">
                  {msg.submitted_at ? new Date(msg.submitted_at).toLocaleString("fr-FR") : "-"}
                </td>
                <td className="px-4 py-2">{msg.first_name} {msg.last_name}</td>
                <td className="px-4 py-2">{msg.email}</td>
                <td className="px-4 py-2">{msg.subject}</td>
                <td className="px-4 py-2">{msg.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}
