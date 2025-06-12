import { Rocket } from "lucide-react";

export default function Footer({ isListView }: { isListView: boolean }) {
  return (
    <footer className="text-center mt-16 space-y-6">
      <div className="flex items-center justify-center space-x-2 text-muted-foreground ">
        <Rocket className="size-4 hidden md:flex" />
        <p className="text-sm">
          {isListView
            ? "Use this startup launch checklist to track your submissions across all platforms"
            : "Click on any startup directory to visit their website and begin your launch journey"}
        </p>
      </div>
      <div className="max-w-4xl mx-auto text-left mt-8 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">
              When should I launch my startup on these directories?
            </h4>
            <p className="text-muted-foreground">
              Launch when you have a working product or MVP, clear value
              proposition, and can handle increased traffic and user feedback.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">
              How many directories should I submit to?
            </h4>
            <p className="text-muted-foreground">
              Start with 5-10 most relevant platforms, then gradually expand.
              Quality and relevance matter more than quantity.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">
              What&#39;s the best startup launch strategy?
            </h4>
            <p className="text-muted-foreground">
              Prepare compelling copy, visuals, and have a plan for engaging
              with users who discover your startup through these platforms.
            </p>
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
