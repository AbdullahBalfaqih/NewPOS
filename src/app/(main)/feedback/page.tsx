"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useLocale } from "@/contexts/LocaleContext";

export default function FeedbackPage() {
  const { translate } = useLocale();

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">
            {translate("الشكاوى والاقتراحات", "Complaints & Suggestions")}
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            {translate("نحن نهتم برأيك. شاركنا بشكواك أو اقتراحك.", "We care about your opinion. Share your complaint or suggestion with us.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="complaint">
              <AccordionTrigger className="font-headline text-xl hover:no-underline text-destructive/80 hover:text-destructive">
                {translate("تقديم شكوى", "Submit a Complaint")}
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <FeedbackForm type="complaint" />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="suggestion">
              <AccordionTrigger className="font-headline text-xl hover:no-underline text-primary/80 hover:text-primary">
                {translate("تقديم اقتراح", "Submit a Suggestion")}
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <FeedbackForm type="suggestion" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
