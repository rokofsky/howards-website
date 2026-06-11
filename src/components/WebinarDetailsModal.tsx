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
          <button
            onClick={onInquire}
            style={{
              backgroundColor: "#d4a882",
              color: "#3d2010",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {t("Inquire", "Poptat")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
