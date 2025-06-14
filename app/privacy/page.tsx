import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <Link
            className="flex gap-2 text-muted-foreground/50 underline"
            href={"/"}
          >
            <Button variant={"ghost"} className="hover:cursor-pointer">
              <ArrowLeft /> back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: June 14th, 2025</p>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">What We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Local Data</strong>: Your conversation history is stored{" "}
                <em>locally</em> in your browser using <code>localStorage</code>
                . It's never sent to our servers.
              </li>
              <li>
                <strong>AI Processing</strong>: All responses are generated
                using self-hosted{" "}
                <Link href={"https://ollama.com/"} className="underline">
                  Ollama
                </Link>{" "}
                models. Message content is never logged or stored.
              </li>
              <li>
                <strong>Analytics</strong>: We use{" "}
                <a
                  href="https://vercel.com/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Vercel Analytics
                </a>{" "}
                to gather anonymous page performance and visit data. Message
                content is not included.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold mb-2">What We Don't Do</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>No collection of personal information</li>
              <li>No message logging on any server</li>
              <li>No advertising or tracking cookies</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold mb-2">Use at Your Own Risk</h2>
            <p>
              m3-chat is provided <strong>as-is</strong> with no guarantees of
              uptime, availability, or data protection from external factors. We
              prioritize privacy, but recommend caution when using any AI
              service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold mb-2">Questions?</h2>
            <p>
              m3-chat is fully open source. View or contribute to the code on{" "}
              <a
                href="https://github.com/m3-chat"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
