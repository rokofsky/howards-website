import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import { useT } from "@/hooks/useT";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webinarTitle: string;
  onOrderNow: () => void;
}

export const WebinarInquiryModal = ({ open, onOpenChange, webinarTitle, onOrderNow }: Props) => {
  const t = useT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Inquire about", "Poptat")} {webinarTitle}</DialogTitle>
          <DialogDescription>
            {t(
              "Send a message, or place a non-binding order. We'll email you back to discuss details.",
              "Pošlete zprávu, nebo odešlete nezávaznou objednávku. Ozveme se vám k doladění detailů."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex justify-center">
          <Button
            type="button"
            variant="glass"
            size="lg"
            onClick={onOrderNow}
            className="w-full sm:w-auto"
          >
            {t("Order Now (No payment req)", "Objednat nyní (Bez platby)")}
          </Button>
        </div>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground text-sm font-semibold font-sans">
              {t("or send a message", "nebo pošlete zprávu")}
            </span>
          </div>
        </div>

        <ContactForm serviceName={webinarTitle} showServiceFields formKind="webinar" />
      </DialogContent>
    </Dialog>
  );
};
