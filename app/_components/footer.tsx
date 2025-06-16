import { Rocket } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QuestionsWithAnswers = [
  {
    q: "When should I launch my startup on these directories?",
    a: "Launch when you have a working MVP with core features, a clear value proposition, professional branding materials, and capacity to handle user feedback and potential traffic spikes. Avoid launching too early with an incomplete product.",
  },
  {
    q: "How many directories should I submit to?",
    a: "Start with 8-12 high-quality, relevant platforms that match your target audience. Focus on directories with active communities and good domain authority. It's better to do fewer submissions well than many submissions poorly.",
  },
  {
    q: "Where should I launch my startup first?",
    a: "Begin with Product Hunt, Hacker News, and Reddit (relevant subreddits) for maximum visibility. Then expand to niche directories specific to your industry, followed by general startup directories like BetaList, Launching Next, and AngelList.",
  },
  {
    q: "What's the best startup launch strategy?",
    a: "Prepare compelling copy, high-quality visuals, and a landing page optimized for conversions. Build an email list pre-launch, engage authentically with communities, respond promptly to feedback, and have analytics in place to track traffic and conversions from each platform.",
  },
];

export default function Footer({ isListView }: { isListView: boolean }) {
  return (
    <footer className="text-center mt-16 space-y-6">
      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
        <Rocket className="size-4 hidden md:flex" />
        <p className="text-sm">
          {isListView
            ? "Use this startup launch checklist to track your submissions across all platforms"
            : "Click on any startup directory to visit their website and begin your launch journey"}
        </p>
      </div>
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-background rounded-lg border border-border/40 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="w-full">
          {QuestionsWithAnswers.map((it, index) => (
            <AccordionItem key={index} value={it.q}>
              <AccordionTrigger className="text-sm font-medium">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground text-left">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 p-4 bg-muted/50 rounded-md border border-border/30 flex flex-col items-center gap-3">
          <div>
            <p className="text-xs font-medium">Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Schedule your launches strategically - Tuesday through Thursday
              typically see higher engagement. Prepare different versions of
              your pitch for different platforms.
            </p>
          </div>
          <div className="bg-primary/10 text-primary p-1.5 rounded-full mt-0.5">
            <Rocket className="size-3.5" />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/70">
        Last updated: {new Date().toLocaleDateString()} | Free startup launch
        directory list
      </p>
    </footer>
  );
}
