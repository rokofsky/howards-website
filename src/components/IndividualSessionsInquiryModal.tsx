import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";
import { useT } from "@/hooks/useT";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IndividualSessionsInquiryModal = ({ open, onOpenChange }: Props) => {
  const t = useT();
  const serviceName = t("Individual sessions", "Individuální sezení");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Individual Sessions Inquiry", "Poptávka individuální sezení")}</DialogTitle>
          <DialogDescription>
            {t(
              "Tell me a bit about what you'd like to work on and I'll be in touch.",
              "Napište mi, na čem byste chtěli pracovat, a ozvu se Vám.",
            )}
          </DialogDescription>
        </DialogHeader>
        <ContactForm serviceName={serviceName} showServiceFields formKind="service" />
      </DialogContent>
    </Dialog>
  );
};

export default IndividualSessionsInquiryModal;
