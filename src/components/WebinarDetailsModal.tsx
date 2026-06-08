import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";

interface WebinarDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  details: string;
  onInquire: () => void;
}

export const WebinarDetailsModal = ({ open, onOpenChange, title, details, onInquire }: WebinarDetailsModalProps) => {
  const t = useT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="whitespace-pre-line text-sm text-foreground/80 leading-relaxed py-2">
          {details || t("No additional details yet.", "Zatím žádné další podrobnosti.")}
        </div>
        <div className="flex justify-end pt-2">
          <Button className="!bg-[#d4a882] !text-[#3d2010] hover:!bg-[#c99870] !border-0" onClick={onInquire}>
            {t("Inquire", "Poptat")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
